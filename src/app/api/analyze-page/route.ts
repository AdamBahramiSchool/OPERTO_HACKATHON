import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { cid, pageUrl } = await request.json();

    if (!cid || !pageUrl) {
      return NextResponse.json(
        { error: "CID and page URL are required" },
        { status: 400 }
      );
    }

    // Fetch markdown files from Supabase bucket using CID
    const { data: files, error: listError } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "Markdown")
      .list(cid);

    if (listError) {
      return NextResponse.json(
        { error: `Error fetching data: ${listError.message}` },
        { status: 500 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No crawled data found for your company. Please run a crawl first." },
        { status: 404 }
      );
    }

    // Extract domain and path from input URL
    const inputDomain = new URL(pageUrl).hostname;
    const inputPath = new URL(pageUrl).pathname;

    // Find matching markdown content
    let foundPage = false;
    let markdownContent = "";
    const discoveredPages: string[] = [];

    for (const file of files) {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "Markdown")
        .download(`${cid}/${file.name}`);

      if (downloadError) continue;

      const content = await fileData.text();

      // Parse the markdown to extract URLs
      const urlMatches = content.match(/https?:\/\/[^\s)]+/g) || [];
      discoveredPages.push(...urlMatches);

      // Check if this file contains the specific page
      if (content.includes(pageUrl) || urlMatches.some((url) => url.includes(inputPath))) {
        foundPage = true;
        markdownContent = content;
      }
    }

    const allPages = [...new Set(discoveredPages)];

    if (!foundPage) {
      // Check if domain matches
      const domainMatches = allPages.some((url) => {
        try {
          return new URL(url).hostname === inputDomain;
        } catch {
          return false;
        }
      });

      if (domainMatches) {
        return NextResponse.json(
          {
            error: `Page not found in crawled data. The domain exists, but this specific page (${inputPath}) was not discovered during the crawl.`,
            allPages,
          },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          {
            error: `Domain mismatch. The crawled data is for a different domain. Please crawl ${inputDomain} first.`,
            allPages,
          },
          { status: 404 }
        );
      }
    }

    // Use Gemini to analyze the page
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an SEO and web analytics expert. Analyze the following webpage content and provide detailed insights.

Page URL: ${pageUrl}

Markdown Content:
${markdownContent.substring(0, 30000)} 

Please provide a comprehensive analysis including:

1. **SEO Analysis**:
   - Meta tags quality (title, description)
   - Heading structure (H1, H2, etc.)
   - Keyword usage and density
   - Content quality and readability

2. **Technical Issues**:
   - Missing or broken elements
   - Image optimization (alt tags, etc.)
   - Link analysis (internal/external)
   - Page structure issues

3. **Content Insights**:
   - Main topics covered
   - Content length and depth
   - User intent alignment
   - Call-to-action effectiveness

4. **Recommendations**:
   - Top 5 priority improvements
   - Quick wins for better SEO
   - Content enhancement suggestions

Format your response in clear sections with bullet points. Be specific and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    return NextResponse.json({
      success: true,
      pageUrl,
      markdown: markdownContent,
      insights,
      allPages,
      totalPages: allPages.length,
    });
  } catch (error) {
    console.error("Error analyzing page:", error);
    return NextResponse.json(
      { error: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}` },
      { status: 500 }
    );
  }
}

