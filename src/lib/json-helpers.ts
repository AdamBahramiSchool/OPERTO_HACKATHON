/**
 * JSON Validation and Repair Helpers
 * Utilities for handling potentially malformed JSON from AI responses
 */

/**
 * Extract JSON from text that may contain markdown code blocks or other wrapping
 */
export function extractJSON(text: string): string {
    // Remove leading/trailing whitespace
    let cleaned = text.trim()

    // Try to extract from markdown code blocks
    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch && codeBlockMatch[1]) {
        cleaned = codeBlockMatch[1].trim()
    }

    // Remove any leading/trailing non-JSON characters
    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
    }

    return cleaned
}

/**
 * Attempt to repair common JSON issues
 */
export function repairJSON(jsonString: string): string {
    let repaired = jsonString

    // Remove trailing commas before closing braces/brackets
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1')

    return repaired
}

/**
 * Validate and parse JSON with multiple fallback strategies
 */
export function safeParseJSON<T = any>(text: string): { success: true; data: T } | { success: false; error: string; rawText: string } {
    try {
        // Strategy 1: Direct parse
        const parsed = JSON.parse(text)
        return { success: true, data: parsed }
    } catch (error1) {
        console.log('Direct parse failed, trying to extract JSON...')
        
        try {
            // Strategy 2: Extract and parse
            const extracted = extractJSON(text)
            const parsed = JSON.parse(extracted)
            return { success: true, data: parsed }
        } catch (error2) {
            console.log('Extraction failed, trying to repair JSON...')
            
            try {
                // Strategy 3: Extract, repair, and parse
                const extracted = extractJSON(text)
                const repaired = repairJSON(extracted)
                const parsed = JSON.parse(repaired)
                return { success: true, data: parsed }
            } catch (error3) {
                // All strategies failed
                const errorMessage = error3 instanceof Error ? error3.message : String(error3)
                console.error('All JSON parse strategies failed:', errorMessage)
                
                return {
                    success: false,
                    error: errorMessage,
                    rawText: text.substring(0, 1000) // Return first 1000 chars for debugging
                }
            }
        }
    }
}

/**
 * Validate that parsed JSON matches expected schema structure
 */
export function validateDashboardInsightsSchema(data: any): { valid: true; data: any } | { valid: false; errors: string[] } {
    const errors: string[] = []

    // Check required top-level fields
    if (!data.website_url) errors.push('Missing required field: website_url')
    if (!data.overall_rating) errors.push('Missing required field: overall_rating')
    if (!data.website_scores) errors.push('Missing required field: website_scores')
    if (!data.flawed_pages) errors.push('Missing required field: flawed_pages')
    if (!data.summary) errors.push('Missing required field: summary')

    // Check overall_rating structure
    if (data.overall_rating) {
        if (typeof data.overall_rating.score !== 'number') errors.push('overall_rating.score must be a number')
        if (!data.overall_rating.category) errors.push('Missing overall_rating.category')
        if (!data.overall_rating.grade) errors.push('Missing overall_rating.grade')
    }

    // Check website_scores structure
    if (data.website_scores) {
        const requiredScores = [
            'nap_consistency',
            'schema_implementation',
            'content_localization',
            'technical_geo_seo',
            'keyword_optimization',
            'user_experience'
        ]
        
        for (const scoreKey of requiredScores) {
            if (!data.website_scores[scoreKey]) {
                errors.push(`Missing website_scores.${scoreKey}`)
            } else {
                const score = data.website_scores[scoreKey]
                if (typeof score.score !== 'number') errors.push(`${scoreKey}.score must be a number`)
                if (typeof score.percentage !== 'number') errors.push(`${scoreKey}.percentage must be a number`)
            }
        }
    }

    // Check flawed_pages is an array
    if (data.flawed_pages && !Array.isArray(data.flawed_pages)) {
        errors.push('flawed_pages must be an array')
    }

    // Check summary structure
    if (data.summary) {
        const requiredSummaryFields = [
            'total_pages_analyzed',
            'flawed_pages_count',
            'critical_issues_count',
            'high_issues_count',
            'medium_issues_count',
            'low_issues_count'
        ]
        
        for (const field of requiredSummaryFields) {
            if (typeof data.summary[field] !== 'number') {
                errors.push(`summary.${field} must be a number`)
            }
        }
    }

    if (errors.length > 0) {
        return { valid: false, errors }
    }

    return { valid: true, data }
}

