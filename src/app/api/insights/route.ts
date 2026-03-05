import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { GeminiService } from '@/lib/gemini-service'

export async function POST(request: Request) {
    try {
        const { user_id } = await request.json()

        if (!user_id) {
            return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
        }

        const cid = `CID-${user_id.substring(0, 8).toUpperCase()}`
        console.log('Fetching insights for CID:', cid)

        // List all files in the CID folder
        const bucket = process.env.SUPABASE_BUCKET!
        const { data: files, error: listError } = await supabase.storage
            .from(bucket)
            .list(cid, {
                limit: 1000,
                offset: 0,
            })

        if (listError) {
            console.error('Error listing files:', listError)
            return NextResponse.json({ error: 'Failed to list files', details: listError.message }, { status: 500 })
        }

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No crawled data found. Please crawl a website first.' }, { status: 404 })
        }

        // Recursively get all .md files
        const allMarkdownFiles: Array<{ url: string; 'markdown-context': string }> = []
        
        async function fetchFilesRecursively(prefix: string) {
            const { data: items, error } = await supabase.storage
                .from(bucket)
                .list(prefix, { limit: 1000 })

            if (error || !items) return

            for (const item of items) {
                const fullPath = prefix ? `${prefix}/${item.name}` : item.name
                
                if (item.id === null) {
                    // It's a folder, recurse
                    await fetchFilesRecursively(fullPath)
                } else if (item.name.endsWith('.md')) {
                    // It's a markdown file, download it
                    const { data: fileData, error: downloadError } = await supabase.storage
                        .from(bucket)
                        .download(fullPath)

                    if (!downloadError && fileData) {
                        const markdownContent = await fileData.text()
                        
                        // Extract URL from markdown (it's in the format: **URL:** https://...)
                        const urlMatch = markdownContent.match(/\*\*URL:\*\*\s*(.+)/i)
                        const url = urlMatch ? urlMatch[1].trim() : ''

                        allMarkdownFiles.push({
                            url,
                            'markdown-context': markdownContent
                        })
                    }
                }
            }
        }

        await fetchFilesRecursively(cid)

        console.log(`Found ${allMarkdownFiles.length} markdown files`)

        if (allMarkdownFiles.length === 0) {
            return NextResponse.json({ error: 'No markdown files found' }, { status: 404 })
        }

        // Use Gemini service to analyze insights
        const analysis = await GeminiService.analyzeDashboardInsights(allMarkdownFiles)

        return NextResponse.json({
            success: true,
            analysis,
            pages_analyzed: allMarkdownFiles.length
        })

    } catch (error) {
        console.error('Insights generation error:', error)
        return NextResponse.json({ 
            error: 'Failed to generate insights', 
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 })
    }
}

