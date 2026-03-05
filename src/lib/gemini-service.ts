import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import { safeParseJSON, validateDashboardInsightsSchema } from './json-helpers'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/**
 * Gemini AI Service
 * Centralized service for all Gemini AI operations
 */
export class GeminiService {
    /**
     * Analyze website pages for GEO SEO insights
     * @param pages Array of page objects with url and markdown-context
     * @returns Structured GEO SEO analysis
     */
    static async analyzeDashboardInsights(
        pages: Array<{ url: string; 'markdown-context': string }>
    ): Promise<any> {
        try {
            // Load the system prompt
            const promptPath = path.join(process.cwd(), 'src/SKILLS/dashboard_insights_prompt.md')
            const systemPrompt = fs.readFileSync(promptPath, 'utf-8')

            // Configure Gemini 2.5 Flash
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                    temperature: 0.3,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 65536,
                    responseMimeType: 'application/json',
                    // @ts-ignore - thinkingConfig limits thinking tokens to preserve output budget
                    thinkingConfig: { thinkingBudget: 2048 },
                },
            })

            // Prepare the input - summarize pages to reduce token count
            const pagesSummary = pages.map(p => ({
                url: p.url,
                'markdown-context': p['markdown-context'].substring(0, 3000) // Limit each page to 3000 chars
            }))

            const userInput = `Analyze the following ${pages.length} website pages and provide a comprehensive GEO SEO audit:\n\n${JSON.stringify(pagesSummary, null, 2)}`

            console.log(`Sending ${pages.length} pages to Gemini (${userInput.length} characters)...`)

            // Generate insights
            const result = await model.generateContent([
                { text: systemPrompt },
                { text: userInput }
            ])

            const response = result.response
            const analysisText = response.text()

            console.log('Received response from Gemini')
            console.log('Response length:', analysisText.length, 'characters')

            // Log first and last 200 chars for debugging
            console.log('Response start:', analysisText.substring(0, 200))
            console.log('Response end:', analysisText.substring(analysisText.length - 200))

            // Use safe JSON parser with multiple fallback strategies
            const parseResult = safeParseJSON(analysisText)

            if (!parseResult.success) {
                console.error('Failed to parse JSON after all strategies')
                console.error('Parse error:', parseResult.error)
                console.error('Raw text preview:', parseResult.rawText)

                // Save the failed response to a file for debugging
                try {
                    const debugPath = path.join(process.cwd(), 'gemini-debug-response.txt')
                    fs.writeFileSync(debugPath, analysisText)
                    console.log('Saved full response to:', debugPath)
                } catch (writeError) {
                    console.error('Could not save debug file:', writeError)
                }

                throw new Error(`Invalid JSON response from Gemini: ${parseResult.error}`)
            }

            console.log('Successfully parsed JSON response')

            // Validate the schema
            const validationResult = validateDashboardInsightsSchema(parseResult.data)

            if (!validationResult.valid) {
                console.error('Schema validation failed:', validationResult.errors)
                console.warn('Returning data anyway, but it may be incomplete')
                // Return the data anyway, but log the issues
            } else {
                console.log('Schema validation passed ✓')
            }

            return parseResult.data
        } catch (error) {
            console.error('Gemini analysis error:', error)
            throw new Error(`Failed to analyze insights: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    /**
     * Placeholder for future Gemini methods
     * Example: Content generation, summarization, etc.
     */
    
    // static async generateContent(prompt: string): Promise<string> {
    //     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    //     const result = await model.generateContent(prompt)
    //     return result.response.text()
    // }

    // static async summarizeText(text: string): Promise<string> {
    //     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    //     const result = await model.generateContent(`Summarize the following text:\n\n${text}`)
    //     return result.response.text()
    // }
}

