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

export default function BlogGeneratorPage() {
  const [userId, setUserId] = useState("");
  const [cid, setCid] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "friendly" | "luxury">("professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [focusKeywords, setFocusKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [availablePages, setAvailablePages] = useState<Array<{ url: string; path: string }>>([]);

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

  const handleGenerateIdeas = async () => {
    if (!userId) return;

    setLoadingIdeas(true);
    setError("");

    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, action: "ideas" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate ideas");
        setLoadingIdeas(false);
        return;
      }

      setIdeas(data.ideas || []);
      // Update available pages from the response
      if (data.availablePages) {
        setAvailablePages(data.availablePages);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const handleGenerate = async () => {
    if (!pageUrl || !userId) return;

    setLoading(true);
    setError("");
    setBlogPost(null);

    try {
      const keywords = focusKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          selectedPage: pageUrl,
          tone,
          length,
          keywords,
          action: "generate",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred while generating the blog post");
        setLoading(false);
        return;
      }

      setBlogPost(data.blogPost);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Blog Post Generator</h1>
          <p className="text-slate-400">
            Generate SEO-optimized blog posts from your website content using AI
          </p>
        </div>

        {/* Blog Ideas Section */}
        <div className="glass rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Get Blog Post Ideas</h2>
              <p className="text-sm text-slate-400">
                Generate blog post ideas based on your crawled content
              </p>
            </div>
            <button
              onClick={handleGenerateIdeas}
              disabled={loadingIdeas || !userId}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg"
            >
              {loadingIdeas ? "Generating..." : "Generate Ideas"}
            </button>
          </div>

          {ideas.length > 0 && (
            <div className="mt-4 space-y-2">
              {ideas.map((idea, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setPageUrl(idea)}
                >
                  <p className="text-sm text-slate-300">{idea}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blog Generation Form */}
        <div className="glass rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold mb-4">Generate Blog Post</h2>

          <div className="space-y-4">
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

            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Source Page URL
              </label>
              <input
                type="text"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter the URL of a page from your crawled website
              </p>

              {/* Available Pages Dropdown */}
              {availablePages.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-2">Or select from crawled pages ({availablePages.length} available):</p>
                  <select
                    onChange={(e) => setPageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="">-- Select a page --</option>
                    {availablePages.map((page, index) => (
                      <option key={index} value={page.url}>
                        {page.url}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

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
                  <option value="short">Short (400-600 words)</option>
                  <option value="medium">Medium (800-1200 words)</option>
                  <option value="long">Long (1500-2000 words)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Focus Keywords (optional)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="hotel, luxury accommodation, vacation"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
              <p className="text-xs text-slate-500 mt-1">
                Comma-separated keywords to focus on
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !pageUrl || !userId}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Generating Blog Post...
                </span>
              ) : (
                "Generate Blog Post"
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="glass rounded-xl p-6 border border-red-500/20 bg-red-500/10 mb-8">
            <div className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Generated Blog Post */}
        {blogPost && (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6 border border-emerald-500/20 bg-emerald-500/10">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400 mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-1">Blog Post Generated!</h3>
                  <p className="text-sm text-emerald-300">Your AI-generated blog post is ready.</p>
                </div>
              </div>
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
              <p className="text-2xl font-bold text-white">{blogPost.title}</p>
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
            </div>

            {/* Tags */}
            {blogPost.suggestedTags.length > 0 && (
              <div className="glass rounded-xl p-6 border border-white/10">
                <h2 className="text-lg font-bold text-slate-300 mb-3">Suggested Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {blogPost.suggestedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
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
              <div className="bg-[#0a0f1e] rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <div className="prose prose-invert prose-indigo max-w-none">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {blogPost.content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

