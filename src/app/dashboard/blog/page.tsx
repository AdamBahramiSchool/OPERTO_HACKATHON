"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

interface BlogPost {
  title: string;
  content: string;
  metaDescription: string;
  suggestedTags: string[];
}

export default function BlogPage() {
  const [userId, setUserId] = useState("");
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");
  const [availablePages, setAvailablePages] = useState<Array<{ url: string; path: string }>>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "friendly" | "luxury">("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [keywords, setKeywords] = useState("");
  const [loadingPages, setLoadingPages] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const generatedCid = `CID-${user.id.substring(0, 8).toUpperCase()}`;
        setCid(generatedCid);
      }
    };

    fetchUser();
  }, []);

  const fetchAvailablePages = async () => {
    if (!userId) return;

    setLoadingPages(true);
    setError("");
    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, action: "pages" }),
      });

      const data = await response.json();

      console.log("Fetch pages response:", data);

      if (response.ok && data.availablePages) {
        setAvailablePages(data.availablePages);
        console.log(`Loaded ${data.availablePages.length} pages`);
      } else {
        setError(data.error || "Failed to load pages");
      }
    } catch (err) {
      console.error("Error fetching pages:", err);
      setError(`Error loading pages: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoadingPages(false);
    }
  };

  // Fetch available pages when user is loaded
  useEffect(() => {
    if (userId) {
      fetchAvailablePages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleGenerateBlog = async () => {
    if (!selectedPage || !userId) return;

    setLoading(true);
    setError("");
    setBlogPost(null);

    try {
      const keywordArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          selectedPage,
          tone,
          length,
          keywords: keywordArray,
          action: "generate",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate blog post");
        return;
      }

      setBlogPost(data.blogPost);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const downloadAsMarkdown = () => {
    if (!blogPost) return;

    const markdown = `# ${blogPost.title}\n\n${blogPost.content}\n\n---\n\n**Meta Description:** ${blogPost.metaDescription}\n\n**Tags:** ${blogPost.suggestedTags.join(", ")}`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${blogPost.title.toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-8 relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            SEO Blog Generator
          </h1>
          <p className="text-slate-400 text-lg">
            Generate SEO-optimized blog posts from your website content to improve search rankings
          </p>
        </div>

        {/* Generation Form */}
        <div className="glass rounded-xl p-8 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create Blog Post</h2>

          <div className="space-y-6">
            {/* CID Display */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Company ID
              </label>
              <input
                type="text"
                value={cid}
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-400 font-mono cursor-not-allowed"
              />
            </div>

            {/* Page Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300 font-medium">
                  Select Source Page
                </label>
                <button
                  onClick={fetchAvailablePages}
                  disabled={loadingPages || !userId}
                  className="px-3 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
                >
                  {loadingPages ? "Loading..." : "🔄 Refresh"}
                </button>
              </div>
              {loadingPages ? (
                <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-400">
                  Loading pages...
                </div>
              ) : availablePages.length > 0 ? (
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="">-- Select a crawled page --</option>
                  {availablePages.map((page, index) => (
                    <option key={index} value={page.url}>
                      {page.url}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-400">
                  No pages found. Please crawl your website first.
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Choose a page from your crawled website to generate a blog post about
              </p>
            </div>

            {/* Tone and Length */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="short">Short (500-800 words)</option>
                  <option value="medium">Medium (1000-1500 words)</option>
                  <option value="long">Long (1800-2500 words)</option>
                </select>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Focus Keywords (optional)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="hotel, luxury, vacation, travel"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
              <p className="text-xs text-slate-500 mt-1">
                Comma-separated keywords to emphasize in the blog post
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateBlog}
              disabled={loading || !selectedPage || !userId}
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 text-lg"
            >
              {loading ? (
                <span className="inline-flex items-center gap-3 justify-center">
                  <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Generating SEO-Optimized Blog Post...
                </span>
              ) : (
                "Generate Blog Post"
              )}
            </button>
          </div>
        </div>

        {/* Generated Blog Post Display */}
        {blogPost && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="glass rounded-xl p-6 border border-emerald-500/20 bg-emerald-500/10">
              <div className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400 mt-0.5 flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <h3 className="text-emerald-400 font-semibold text-lg mb-1">Blog Post Generated Successfully!</h3>
                  <p className="text-sm text-emerald-300">Your SEO-optimized blog post is ready to publish.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(blogPost.content)}
                className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium"
              >
                📋 Copy Content
              </button>
              <button
                onClick={downloadAsMarkdown}
                className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium"
              >
                ⬇️ Download Markdown
              </button>
            </div>

            {/* Title */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-300">Title</h2>
                <button
                  onClick={() => copyToClipboard(blogPost.title)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Copy
                </button>
              </div>
              <h1 className="text-2xl font-bold text-white">{blogPost.title}</h1>
            </div>

            {/* Meta Description */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-300">Meta Description</h2>
                <button
                  onClick={() => copyToClipboard(blogPost.metaDescription)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-slate-300">{blogPost.metaDescription}</p>
              <p className="text-xs text-slate-500 mt-2">
                {blogPost.metaDescription.length} characters
              </p>
            </div>

            {/* Tags */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-slate-300 mb-3">Suggested Tags</h2>
              <div className="flex flex-wrap gap-2">
                {blogPost.suggestedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Blog Content */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-300">Blog Content</h2>
                <button
                  onClick={() => copyToClipboard(blogPost.content)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Copy All
                </button>
              </div>
              <div className="bg-[#0a0f1e] rounded-lg p-8 max-h-[800px] overflow-y-auto">
                <div className="prose prose-invert prose-lg max-w-none">
                  <div
                    className="text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: blogPost.content
                        .replace(/^## /gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-white">')
                        .replace(/\n/g, '</h2>\n')
                        .replace(/^### /gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-200">')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                        .replace(/\n\n/g, '</p><p class="mb-4">')
                        .replace(/^(?!<[h|p])/gm, '<p class="mb-4">')
                        .replace(/<\/p><p class="mb-4"><\/h/g, '</h')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

