import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateBlogPost, generateBlogIdeas } from "@/services/gemini-blog";

/**
 * Recursively get all markdown files from a CID folder in Supabase storage
 * Uses the same pattern as /api/insights
 */
async function getAllMarkdownFiles(cid: string, bucket: string): Promise<Array<{ path: string; url: string; content: string }>> {
  const allMarkdownFiles: Array<{ path: string; url: string; content: string }> = [];

  console.log(`Fetching markdown files for CID: ${cid} from bucket: ${bucket}`);

  async function fetchFilesRecursively(prefix: string) {
    const { data: items, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 1000 });

    if (error) {
      console.error(`Error listing ${prefix}:`, error);
      return;
    }

    if (!items || items.length === 0) {
      console.log(`No items found in ${prefix}`);
      return;
    }

    console.log(`Found ${items.length} items in ${prefix}`);

    for (const item of items) {
      const fullPath = `${prefix}/${item.name}`;

      if (item.name.endsWith('.md')) {
        // It's a markdown file - download it
        console.log(`Downloading: ${fullPath}`);
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(fullPath);

        if (downloadError) {
          console.error(`Error downloading ${fullPath}:`, downloadError);
          continue;
        }

        const content = await fileData.text();

        // Extract URL from markdown content
        const urlMatch = content.match(/\*\*URL:\*\*\s*(https?:\/\/[^\s\n]+)/);
        const url = urlMatch ? urlMatch[1] : '';

        allMarkdownFiles.push({
          path: fullPath,
          url,
          content
        });
      } else if (!item.name.includes('.')) {
        // It's a folder - recurse into it
        console.log(`Recursing into folder: ${fullPath}`);
        await fetchFilesRecursively(fullPath);
      }
    }
  }

  await fetchFilesRecursively(cid);

  console.log(`Total markdown files found: ${allMarkdownFiles.length}`);
  return allMarkdownFiles;
}

export async function POST(request: Request) {
  try {
    const { user_id, action, selectedPage, tone, length, keywords } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // Generate CID from user_id (same pattern as insights API)
    const cid = `CID-${user_id.substring(0, 8).toUpperCase()}`;
    const bucket = process.env.SUPABASE_BUCKET!;

    console.log(`Blog Generator - CID: ${cid}, Action: ${action}, Bucket: ${bucket}`);

    // Get all markdown files using the recursive function
    const allMarkdownFiles = await getAllMarkdownFiles(cid, bucket);

    if (allMarkdownFiles.length === 0) {
      return NextResponse.json(
        {
          error: "No crawled data found. Please run a crawl first."
        },
        { status: 404 }
      );
    }

    console.log(`Found ${allMarkdownFiles.length} markdown files`);

    // Just return available pages without generating ideas
    if (action === "pages") {
      return NextResponse.json({
        success: true,
        availablePages: allMarkdownFiles.map(f => ({ url: f.url, path: f.path })),
        totalPages: allMarkdownFiles.length
      });
    }

    if (action === "ideas") {
      // Generate blog ideas from all pages - combine all content
      const allContent = allMarkdownFiles
        .map(file => file.content)
        .join("\n\n");

      const ideas = await generateBlogIdeas(allContent, 10);

      return NextResponse.json({
        success: true,
        ideas,
        availablePages: allMarkdownFiles.map(f => ({ url: f.url, path: f.path })),
        totalPages: allMarkdownFiles.length
      });
    }

    // Generate a blog post from a specific page
    if (!selectedPage) {
      return NextResponse.json(
        { error: "selectedPage is required for generate action" },
        { status: 400 }
      );
    }

    // Find the file for the selected page
    const selectedFile = allMarkdownFiles.find(
      file => file.url === selectedPage || file.path.includes(selectedPage)
    );

    if (!selectedFile) {
      return NextResponse.json(
        { error: "Selected page not found in crawled data" },
        { status: 404 }
      );
    }

    const blogPost = await generateBlogPost({
      markdownContent: selectedFile.content,
      pageUrl: selectedFile.url,
      tone: tone || "professional",
      length: length || "medium",
      focusKeywords: keywords || []
    });

    return NextResponse.json({
      success: true,
      blogPost,
      sourceUrl: selectedFile.url
    });
  } catch (error) {
    console.error("Error generating blog post:", error);
    return NextResponse.json(
      {
        error: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

