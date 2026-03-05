import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import JSZip from 'jszip'
import { JSDOM } from 'jsdom'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const user_id = formData.get('user_id') as string

        if (!file || !user_id) {
            return NextResponse.json({ error: 'Missing file or user_id' }, { status: 400 })
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File too large. Maximum size is 50MB' }, { status: 400 })
        }

        const cid = `CID-${user_id.substring(0, 8).toUpperCase()}`
        console.log('Processing upload for CID:', cid)

        // Read the zip file
        const arrayBuffer = await file.arrayBuffer()
        const zip = await JSZip.loadAsync(arrayBuffer)

        let htmlFiles = 0
        let jsFiles = 0
        let otherFiles = 0
        let totalFiles = 0

        const markdownContent: string[] = []
        const extractedFiles: Array<{ filename: string; content: string; type: 'html' | 'js' }> = []
        markdownContent.push('# Uploaded Build Bundle\n')
        markdownContent.push(`**Upload Date:** ${new Date().toISOString()}\n`)
        markdownContent.push(`**CID:** ${cid}\n`)
        markdownContent.push(`**Original File:** ${file.name}\n\n`)
        markdownContent.push('---\n\n')

        // Process each file in the zip
        for (const [filename, zipEntry] of Object.entries(zip.files)) {
            // Skip directories and hidden files
            if (zipEntry.dir || filename.startsWith('__MACOSX') || filename.includes('/.')) {
                continue
            }

            totalFiles++

            try {
                const content = await zipEntry.async('string')

                // Process HTML files
                if (filename.endsWith('.html') || filename.endsWith('.htm')) {
                    htmlFiles++
                    const extractedText = extractTextFromHTML(content)
                    markdownContent.push(`## HTML File: ${filename}\n`)
                    markdownContent.push(`**Path:** \`${filename}\`\n\n`)
                    markdownContent.push('**Extracted Content:**\n')
                    markdownContent.push('```\n')
                    markdownContent.push(extractedText.substring(0, 5000)) // Limit to 5000 chars per file
                    markdownContent.push('\n```\n\n')
                    markdownContent.push('---\n\n')

                    // Store for optimization
                    extractedFiles.push({
                        filename,
                        content: content.substring(0, 10000), // Limit for AI processing
                        type: 'html'
                    })
                }
                // Process JS files
                else if (filename.endsWith('.js') || filename.endsWith('.jsx') || filename.endsWith('.ts') || filename.endsWith('.tsx')) {
                    jsFiles++
                    const readableStrings = extractReadableStrings(content)
                    if (readableStrings.length > 0) {
                        markdownContent.push(`## JavaScript File: ${filename}\n`)
                        markdownContent.push(`**Path:** \`${filename}\`\n\n`)
                        markdownContent.push('**Readable Strings:**\n')
                        markdownContent.push('```\n')
                        markdownContent.push(readableStrings.join('\n').substring(0, 3000)) // Limit to 3000 chars
                        markdownContent.push('\n```\n\n')
                        markdownContent.push('---\n\n')
                    }

                    // Store for optimization (only .js files, not TypeScript)
                    if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
                        extractedFiles.push({
                            filename,
                            content: content.substring(0, 8000), // Limit for AI processing
                            type: 'js'
                        })
                    }
                }
                // Process special files
                else if (filename.endsWith('robots.txt') || filename.endsWith('sitemap.xml') || filename.endsWith('.json')) {
                    otherFiles++
                    markdownContent.push(`## Special File: ${filename}\n`)
                    markdownContent.push(`**Path:** \`${filename}\`\n\n`)
                    markdownContent.push('**Content:**\n')
                    markdownContent.push('```\n')
                    markdownContent.push(content.substring(0, 5000))
                    markdownContent.push('\n```\n\n')
                    markdownContent.push('---\n\n')
                }
                // Process CSS files (extract readable text)
                else if (filename.endsWith('.css')) {
                    otherFiles++
                    const cssText = extractCSSText(content)
                    if (cssText.length > 0) {
                        markdownContent.push(`## CSS File: ${filename}\n`)
                        markdownContent.push(`**Path:** \`${filename}\`\n\n`)
                        markdownContent.push('**Extracted Text:**\n')
                        markdownContent.push('```\n')
                        markdownContent.push(cssText.join('\n').substring(0, 2000))
                        markdownContent.push('\n```\n\n')
                        markdownContent.push('---\n\n')
                    }
                }
            } catch (fileError) {
                console.error(`Error processing file ${filename}:`, fileError)
                // Continue with other files
            }
        }

        // Create final markdown
        const finalMarkdown = markdownContent.join('')

        // Upload to Supabase storage
        const storagePath = `uploaded-data/${cid}/bundle.md`
        const { error: uploadError } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET!)
            .upload(storagePath, finalMarkdown, {
                contentType: 'text/markdown',
                upsert: true, // Overwrite if exists
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload to storage', details: uploadError.message }, { status: 500 })
        }

        console.log(`✓ Uploaded bundle: ${storagePath}`)

        // Store metadata in database (optional - you can create a table for this)
        // For now, we'll just return success

        return NextResponse.json({
            success: true,
            cid,
            storagePath,
            stats: {
                totalFiles,
                htmlFiles,
                jsFiles,
                otherFiles,
            },
            bundleSize: finalMarkdown.length,
            files: extractedFiles, // Return files for optimization
        })

    } catch (error) {
        console.error('Upload bundle error:', error)
        return NextResponse.json({
            error: 'Failed to process upload',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}

// Helper function to extract text from HTML
function extractTextFromHTML(html: string): string {
    try {
        const dom = new JSDOM(html)
        const document = dom.window.document

        // Remove script and style tags
        const scripts = document.querySelectorAll('script, style')
        scripts.forEach(el => el.remove())

        // Get text content
        const text = document.body?.textContent || ''
        
        // Clean up whitespace
        return text.replace(/\s+/g, ' ').trim()
    } catch (error) {
        console.error('HTML parsing error:', error)
        return ''
    }
}

// Helper function to extract readable strings from JS
function extractReadableStrings(js: string): string[] {
    const strings: string[] = []
    
    // Match string literals (both single and double quotes)
    const stringRegex = /["'`]([^"'`\n]{10,}?)["'`]/g
    let match
    
    while ((match = stringRegex.exec(js)) !== null) {
        const str = match[1].trim()
        // Filter out code-like strings
        if (!str.includes('function') && !str.includes('=>') && !str.includes('const ')) {
            strings.push(str)
        }
    }
    
    return [...new Set(strings)] // Remove duplicates
}

// Helper function to extract text from CSS
function extractCSSText(css: string): string[] {
    const text: string[] = []
    
    // Extract content from CSS (e.g., content: "text")
    const contentRegex = /content:\s*["']([^"']+)["']/g
    let match
    
    while ((match = contentRegex.exec(css)) !== null) {
        text.push(match[1])
    }
    
    return [...new Set(text)]
}

