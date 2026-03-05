# Gemini API Integration Setup

This project now includes AI-powered SEO analysis using Google's Gemini API.

## Features

- **Automated Website Crawling**: Crawls hotel websites and extracts HTML content
- **AI-Powered Analysis**: Uses Gemini 1.5 Flash to analyze SEO performance
- **Normalized Metrics**: Returns structured data including:
  - Overall SEO score (0-100)
  - Individual metrics (SEO Health, Page Speed, Mobile Friendly, Content Quality, Technical SEO)
  - Specific issues with severity levels
  - Actionable suggestions with priority and estimated impact
  - Summary and timestamp

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```bash
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=your_bucket_name
```

### 3. Install Dependencies

Dependencies are already installed. If needed, run:

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

## Usage

### Via Dashboard UI

1. Navigate to **Dashboard > SEO Analysis**
2. Enter your hotel website URL
3. Click "Analyze Website"
4. Wait for the crawling and analysis to complete
5. View the results including scores, issues, and suggestions

### Via API

#### 1. Crawl Website

```bash
POST /api/crawl
Content-Type: application/json

{
  "seed_url": "https://your-hotel-website.com"
}
```

Response (Server-Sent Events):
```
data: {"url": "https://...", "title": "...", "content": "...", "index": 1, "queued": 5}
data: {"url": "https://...", "title": "...", "content": "...", "index": 2, "queued": 4}
...
data: {"done": true, "total": 10}
```

#### 2. Analyze with Gemini

```bash
POST /api/analyze
Content-Type: application/json

{
  "pages": [
    {
      "url": "https://example.com",
      "content": "<html>...</html>"
    },
    {
      "url": "https://example.com/about",
      "content": "<html>...</html>"
    }
  ]
}
```

Response:
```json
{
  "overallScore": 87,
  "metrics": {
    "seoHealth": 85,
    "pageSpeed": 72,
    "mobileFriendly": 94,
    "contentQuality": 88,
    "technicalSEO": 90
  },
  "issues": [
    {
      "url": "https://example.com/rooms",
      "issue": "Missing meta description",
      "severity": "high",
      "category": "seo"
    }
  ],
  "suggestions": [
    {
      "title": "Add Meta Descriptions",
      "description": "Add unique meta descriptions to all pages...",
      "priority": "high",
      "category": "seo",
      "estimatedImpact": "Could improve CTR by 15-20%"
    }
  ],
  "summary": "Overall, the website has good SEO fundamentals...",
  "analyzedPages": 10,
  "timestamp": "2026-03-05T12:00:00.000Z"
}
```

## Response Schema

See `src/types/seo-analysis.ts` for the complete TypeScript definitions.

## Cost Considerations

- Gemini 1.5 Flash is used for cost-effectiveness
- Each analysis processes up to 5000 characters per page
- Monitor your API usage at [Google AI Studio](https://makersuite.google.com/)

## Troubleshooting

### "Gemini API key not configured"
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Restart the development server after adding the key

### "Failed to parse AI response"
- The AI occasionally returns markdown-formatted JSON
- The code attempts to clean this automatically
- Check the console logs for the raw response

### Rate Limits
- Gemini API has rate limits based on your tier
- Consider implementing caching for repeated analyses
- Add delays between requests if needed

## Future Enhancements

- [ ] Cache analysis results in Supabase
- [ ] Historical tracking of SEO scores
- [ ] Competitor analysis
- [ ] Automated recommendations implementation
- [ ] Export reports as PDF

