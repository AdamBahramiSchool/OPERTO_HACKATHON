import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import type { PageData, SEOAnalysisResponse } from '@/types/seo-analysis';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { pages }: { pages: PageData[] } = await request.json();

    if (!pages || pages.length === 0) {
      return NextResponse.json(
        { error: 'No pages provided for analysis' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare the prompt
    const prompt = `You are an expert SEO analyst. Analyze the following hotel website pages and provide a comprehensive SEO analysis.

Website Pages Data:
${pages.map((page, idx) => `
Page ${idx + 1}:
URL: ${page.url}
HTML Content (first 5000 chars): ${page.content.substring(0, 5000)}
---
`).join('\n')}

Please analyze these pages and provide a JSON response with the following structure:
{
  "overallScore": <number 0-100>,
  "metrics": {
    "seoHealth": <number 0-100>,
    "pageSpeed": <number 0-100>,
    "mobileFriendly": <number 0-100>,
    "contentQuality": <number 0-100>,
    "technicalSEO": <number 0-100>
  },
  "issues": [
    {
      "url": "<page url>",
      "issue": "<description of the issue>",
      "severity": "low|medium|high|critical",
      "category": "seo|performance|accessibility|content|technical"
    }
  ],
  "suggestions": [
    {
      "title": "<suggestion title>",
      "description": "<detailed description>",
      "priority": "low|medium|high|critical",
      "category": "seo|performance|accessibility|content|technical",
      "estimatedImpact": "<impact description>"
    }
  ],
  "summary": "<overall summary of the analysis>"
}

Focus on:
1. SEO best practices (meta tags, headings, alt text, etc.)
2. Page performance indicators from HTML structure
3. Mobile-friendliness based on viewport and responsive design
4. Content quality (keyword usage, readability, structure)
5. Technical SEO (schema markup, canonical tags, robots meta, etc.)

Provide actionable, specific suggestions for improvement. Return ONLY valid JSON, no markdown formatting.`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let analysisData: Partial<SEOAnalysisResponse>;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: text },
        { status: 500 }
      );
    }

    // Add metadata
    const finalResponse: SEOAnalysisResponse = {
      overallScore: analysisData.overallScore || 0,
      metrics: analysisData.metrics || {
        seoHealth: 0,
        pageSpeed: 0,
        mobileFriendly: 0,
        contentQuality: 0,
        technicalSEO: 0,
      },
      issues: analysisData.issues || [],
      suggestions: analysisData.suggestions || [],
      summary: analysisData.summary || 'Analysis completed',
      analyzedPages: pages.length,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze website',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

