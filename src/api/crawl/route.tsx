import puppeteer from 'puppeteer'
import { load } from 'cheerio'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

/* ─── HTML → Markdown ───────────────────────────────────────────────────── */

function htmlToMarkdown(html: string, url: string, title: string): string {
    const $ = load(html)

    $('script, style, noscript, iframe, svg, canvas, picture').remove()
    $('nav, footer, header, [role="navigation"], [role="banner"], [role="contentinfo"]').remove()
    $('[class*="cookie"], [class*="popup"], [class*="modal"], [class*="overlay"]').remove()
    $('[id*="cookie"], [id*="modal"], [id*="popup"]').remove()

    const metaDesc = $('meta[name="description"]').attr('content')?.trim() ?? ''
    const metaKeywords = $('meta[name="keywords"]').attr('content')?.trim() ?? ''

    let md = `# ${title}\n\n`
    md += `**URL:** ${url}\n\n`
    if (metaDesc) md += `**Description:** ${metaDesc}\n\n`
    if (metaKeywords) md += `**Keywords:** ${metaKeywords}\n\n`
    md += `---\n\n`

    const main = $('main, article, [role="main"], .main, #main, .content, #content').first()
    const root = main.length ? main : $('body')

    root.find('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote').each((_, el) => {
        const tag = (el as { tagName?: string }).tagName?.toLowerCase() ?? ''
        const text = $(el).text().replace(/\s+/g, ' ').trim()
        if (!text) return

        const heading = tag.match(/^h(\d)$/)
        if (heading) {
            md += `${'#'.repeat(Number(heading[1]))} ${text}\n\n`
        } else if (tag === 'p') {
            md += `${text}\n\n`
        } else if (tag === 'ul' || tag === 'ol') {
            $(el).children('li').each((i, li) => {
                const liText = $(li).text().replace(/\s+/g, ' ').trim()
                if (liText) md += tag === 'ol' ? `${i + 1}. ${liText}\n` : `- ${liText}\n`
            })
            md += '\n'
        } else if (tag === 'blockquote') {
            md += `> ${text}\n\n`
        }
    })

    return md.trim()
}

/* ─── URL → Storage path ────────────────────────────────────────────────── */
// Pattern: {cid}/{domain-without-tld}/{page-path}.md
// e.g.  CID-A1B2C3D4/grandpacific/rooms/suites.md
//       CID-A1B2C3D4/grandpacific/index.md

function urlToStoragePath(url: string, cid: string): string {
    const { hostname, pathname } = new URL(url)

    // Strip www. prefix, then strip TLD(s) (.com, .net, .co.uk, etc.)
    const domain = hostname
        .replace(/^www\./, '')
        .replace(/\.[a-z]{2,6}(\.[a-z]{2})?$/i, '')

    const slug =
        pathname === '/'
            ? 'index'
            : pathname.replace(/^\/|\/$/g, '').replace(/[^a-zA-Z0-9/_-]/g, '-')

    return `${cid}/${domain}/${slug}.md`
}

/* ─── Route ─────────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
    // Resolve authenticated user from session cookie
    const cookieStore = await cookies()
    const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: () => {},
            },
        }
    )

    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // CID matches DashboardLayout convention
    const cid = `CID-${user.id.substring(0, 8).toUpperCase()}`

    const { seed_url } = await request.json()

    const encoder = new TextEncoder()
    const send = (data: object) => encoder.encode(`data: ${JSON.stringify(data)}\n\n`)

    const stream = new ReadableStream({
        async start(controller) {
            const baseDomain = new URL(seed_url).hostname
            const visited = new Set<string>()
            const queue: string[] = [seed_url]

            const browser = await puppeteer.launch({ headless: true })

            try {
                while (queue.length > 0) {
                    const url = queue.shift()!

                    if (visited.has(url)) continue
                    visited.add(url)

                    const page = await browser.newPage()
                    try {
                        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })

                        const title = await page.title()
                        const html = await page.content()

                        const markdown = htmlToMarkdown(html, url, title)

                        const storagePath = urlToStoragePath(url, cid)
                        const { error: uploadError } = await supabase.storage
                            .from('Markdown')
                            .upload(storagePath, markdown, {
                                contentType: 'text/markdown; charset=utf-8',
                                upsert: true,
                            })

                        if (uploadError) {
                            console.error(`[storage] ${url} →`, uploadError.message)
                        } else {
                            console.log(`[${visited.size}] ${url} — "${title}" → Markdown/${storagePath}`)
                        }

                        controller.enqueue(
                            send({
                                url,
                                title,
                                index: visited.size,
                                queued: queue.length,
                                stored: !uploadError,
                                storagePath: uploadError ? null : storagePath,
                            })
                        )

                        const links = await page.$$eval('a[href]', (anchors) =>
                            anchors.map((a) => (a as HTMLAnchorElement).href)
                        )

                        for (const link of links) {
                            try {
                                const parsed = new URL(link)
                                const normalized = parsed.origin + parsed.pathname

                                if (
                                    parsed.hostname === baseDomain &&
                                    !visited.has(normalized) &&
                                    !queue.includes(normalized)
                                ) {
                                    queue.push(normalized)
                                }
                            } catch {
                                // skip invalid URLs
                            }
                        }
                    } catch (err) {
                        const message = err instanceof Error ? err.message : String(err)
                        controller.enqueue(send({ url, error: message, index: visited.size }))
                    } finally {
                        await page.close()
                    }
                }
            } finally {
                await browser.close()
            }

            controller.enqueue(send({ done: true, total: visited.size }))
            controller.close()
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
}
