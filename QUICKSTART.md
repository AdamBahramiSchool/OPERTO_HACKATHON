# Quick Start Guide - Gemini SEO Analysis

Get up and running with AI-powered SEO analysis in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- A Google account (for Gemini API key)
- Supabase account (for authentication)

## Step 1: Get Your Gemini API Key (2 minutes)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

> 💡 **Tip**: The free tier includes 15 requests per minute, which is perfect for testing!

## Step 2: Configure Environment (1 minute)

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Add your Supabase credentials (if not already configured)

## Step 3: Install & Run (2 minutes)

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Analysis

1. **Sign up / Login** to the dashboard
2. Navigate to **Dashboard → SEO Analysis**
3. Enter a hotel website URL (try: `https://www.marriott.com`)
4. Click **"Analyze Website"**
5. Watch the magic happen! ✨

## What You'll See

### During Analysis
- Real-time crawl progress
- Number of pages discovered
- Current page being analyzed

### After Analysis
- **Overall SEO Score** (0-100)
- **5 Key Metrics**:
  - SEO Health
  - Page Speed
  - Mobile Friendly
  - Content Quality
  - Technical SEO
- **Issues List**: Specific problems found with severity levels
- **Suggestions**: Actionable recommendations with priority and impact

## Example Response

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
      "description": "Add unique meta descriptions to all pages to improve click-through rates from search results.",
      "priority": "high",
      "category": "seo",
      "estimatedImpact": "Could improve CTR by 15-20%"
    }
  ],
  "summary": "Overall, the website has good SEO fundamentals with room for improvement in page speed and meta descriptions.",
  "analyzedPages": 10,
  "timestamp": "2026-03-05T12:00:00.000Z"
}
```

## Troubleshooting

### "Gemini API key not configured"
- Make sure you added `GEMINI_API_KEY` to `.env.local`
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "No pages were crawled"
- Check if the URL is accessible
- Try a simpler website first
- Check your internet connection

### Analysis takes too long
- Large websites may take several minutes
- The crawler respects rate limits
- Consider testing with smaller sites first

## Next Steps

- Read [GEMINI_SETUP.md](./GEMINI_SETUP.md) for detailed documentation
- Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for technical details
- Explore the API endpoints for custom integrations

## Cost & Limits

- **Free Tier**: 15 requests/minute, 1500 requests/day
- **Cost**: Gemini 1.5 Flash is very affordable (~$0.075 per 1M tokens)
- **Optimization**: Each page is limited to 5000 characters to reduce costs

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review [GEMINI_SETUP.md](./GEMINI_SETUP.md)
3. Check the console logs for detailed error messages

---

**Happy Analyzing! 🚀**

