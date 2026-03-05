import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/**
 * Gemini Blog Generation Service
 * Generates SEO-optimized blog posts from website content
 */

interface BlogPostOptions {
    markdownContent: string
    pageUrl: string
    tone?: 'professional' | 'casual' | 'friendly' | 'luxury'
    length?: 'short' | 'medium' | 'long'
    focusKeywords?: string[]
}

interface BlogPost {
    title: string
    content: string
    metaDescription: string
    suggestedTags: string[]
}

/**
 * Generate blog post ideas from website content
 * @param markdownContent Combined markdown content from all pages
 * @param count Number of ideas to generate
 * @returns Array of blog post ideas
 */
export async function generateBlogIdeas(markdownContent: string, count: number = 10): Promise<string[]> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.8,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 2048,
            },
        })

        const prompt = `Based on the following website content, generate ${count} SEO-optimized blog post ideas that would help improve the website's search engine ranking and provide value to visitors.

Website Content (truncated):
${markdownContent.substring(0, 8000)}

Generate ${count} blog post ideas that:
1. Are relevant to the hotel/hospitality industry
2. Would attract potential guests searching for information
3. Include location-based keywords when applicable
4. Address common questions or concerns travelers have
5. Could naturally link back to the website's services

Return ONLY a JSON array of strings, each string being one blog post idea. Example format:
["Blog idea 1", "Blog idea 2", "Blog idea 3"]`

        const result = await model.generateContent(prompt)
        const response = result.response.text()
        
        // Parse the JSON response
        const ideas = JSON.parse(response)
        return Array.isArray(ideas) ? ideas : []
    } catch (error) {
        console.error('Error generating blog ideas:', error)
        throw new Error(`Failed to generate blog ideas: ${error instanceof Error ? error.message : String(error)}`)
    }
}

/**
 * Generate a complete SEO-optimized blog post
 * @param options Blog post generation options
 * @returns Generated blog post with metadata
 */
export async function generateBlogPost(options: BlogPostOptions): Promise<BlogPost> {
    try {
        // Load the blog generation prompt
        const promptPath = path.join(process.cwd(), 'OPERTO_HACKATHON/src/SKILLS/blog_generation_prompt.md')
        const systemPrompt = fs.readFileSync(promptPath, 'utf-8')

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
            },
        })

        // Determine word count based on length
        const wordCounts = {
            short: '500-800',
            medium: '1000-1500',
            long: '1800-2500'
        }
        const targetWordCount = wordCounts[options.length || 'medium']

        const userInput = `Generate an SEO-optimized blog post with the following parameters:

**Source Page URL:** ${options.pageUrl}
**Tone:** ${options.tone || 'professional'}
**Target Length:** ${targetWordCount} words
**Focus Keywords:** ${options.focusKeywords?.join(', ') || 'None specified - extract from content'}

**Source Content (markdown):**
${options.markdownContent.substring(0, 10000)}

Generate a complete blog post following the system prompt instructions.`

        console.log(`Generating blog post for ${options.pageUrl}...`)

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: userInput }
        ])

        const response = result.response.text()
        const blogPost = JSON.parse(response)

        console.log('Blog post generated successfully')

        return {
            title: blogPost.title || 'Untitled Blog Post',
            content: blogPost.content || '',
            metaDescription: blogPost.metaDescription || '',
            suggestedTags: blogPost.suggestedTags || []
        }
    } catch (error) {
        console.error('Error generating blog post:', error)
        throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : String(error)}`)
    }
}

