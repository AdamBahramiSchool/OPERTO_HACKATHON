import puppeteer from 'puppeteer'

export async function POST(request: Request) {
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
                        console.log(`[${visited.size}] ${url} — "${title}"`)

                        // stream this page result to the client immediately
                        controller.enqueue(send({ url, title, index: visited.size, queued: queue.length }))

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