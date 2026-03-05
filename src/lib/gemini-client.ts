/**
 * Client-side utility for interacting with the Gemini SEO Analysis API
 */

import type { PageData, SEOAnalysisResponse } from '@/types/seo-analysis';

export interface CrawlProgress {
  current: number;
  total: number;
  url?: string;
  title?: string;
}

export interface CrawlResult {
  pages: PageData[];
  total: number;
}

/**
 * Crawl a website and collect page data
 */
export async function crawlWebsite(
  seedUrl: string,
  onProgress?: (progress: CrawlProgress) => void
): Promise<CrawlResult> {
  const response = await fetch('/api/crawl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seed_url: seedUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to start crawling');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  const pages: PageData[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));

        if (data.done) {
          total = data.total;
          if (onProgress) {
            onProgress({ current: total, total });
          }
        } else if (data.url && data.content) {
          pages.push({ url: data.url, content: data.content });
          if (onProgress) {
            onProgress({
              current: data.index,
              total: data.queued + data.index,
              url: data.url,
              title: data.title,
            });
          }
        }
      }
    }
  }

  return { pages, total };
}

/**
 * Analyze pages with Gemini AI
 */
export async function analyzePages(pages: PageData[]): Promise<SEOAnalysisResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pages }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Analysis failed');
  }

  return response.json();
}

/**
 * Complete workflow: crawl and analyze a website
 */
export async function crawlAndAnalyze(
  seedUrl: string,
  onCrawlProgress?: (progress: CrawlProgress) => void,
  onAnalyzeStart?: () => void
): Promise<SEOAnalysisResponse> {
  // Step 1: Crawl
  const { pages } = await crawlWebsite(seedUrl, onCrawlProgress);

  if (pages.length === 0) {
    throw new Error('No pages were crawled successfully');
  }

  // Step 2: Analyze
  if (onAnalyzeStart) {
    onAnalyzeStart();
  }

  return analyzePages(pages);
}

