# Operto Insights — Hotel Intelligence Platform

AI-powered SEO analysis and insights platform specifically designed for hotels.

## Features

- 🔍 **Website Crawler**: Automated crawling of hotel websites
- 🤖 **AI-Powered SEO Analysis**: Gemini AI integration for comprehensive SEO insights
- 📊 **Normalized Metrics**: Structured scoring across multiple dimensions
- 🎯 **Actionable Suggestions**: Prioritized recommendations with estimated impact
- 📈 **Dashboard**: Beautiful glassmorphic UI for data visualization
- 🔐 **Authentication**: Supabase-powered user management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI**: Google Gemini 1.5 Flash
- **UI**: React 19, Tailwind CSS v4
- **Auth & Storage**: Supabase
- **Crawling**: Puppeteer, Cheerio

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Supabase credentials (URL, keys, bucket name)

See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for detailed setup instructions.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Dashboard

1. **Sign Up / Login**: Create an account or sign in
2. **SEO Analysis**: Navigate to Dashboard > SEO Analysis
3. **Enter URL**: Input your hotel website URL
4. **Analyze**: Click "Analyze Website" to start crawling and AI analysis
5. **View Results**: See scores, issues, and actionable suggestions

### API Endpoints

#### POST `/api/crawl`
Crawls a website and returns page data via Server-Sent Events.

#### POST `/api/analyze`
Analyzes page data with Gemini AI and returns normalized SEO metrics.

See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for detailed API documentation.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── crawl/          # Website crawler endpoint
│   │   ├── analyze/        # Gemini AI analysis endpoint
│   │   └── health-check/   # Health check endpoint
│   ├── dashboard/
│   │   ├── analysis/       # SEO analysis page
│   │   ├── crawler/        # Crawler page
│   │   └── data/           # Hotel data & context page
│   └── signup/             # Authentication pages
├── components/
│   └── DashboardLayout.tsx # Main dashboard layout
├── lib/
│   ├── gemini-client.ts    # Client utilities for Gemini API
│   └── supabase.js         # Supabase client
└── types/
    └── seo-analysis.ts     # TypeScript types for SEO analysis
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
