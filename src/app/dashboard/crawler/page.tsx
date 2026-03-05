"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

interface CrawlResult {
  url: string;
  title?: string;
  error?: string;
  index: number;
  queued?: number;
}

export default function CrawlerPage() {
  const [url, setUrl] = useState("");
  const [cid, setCid] = useState("");
  const [userId, setUserId] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [results, setResults] = useState<CrawlResult[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Generate CID from user ID (first 8 characters)
        const generatedCid = `CID-${user.id.substring(0, 8).toUpperCase()}`;
        setCid(generatedCid);
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const handleCrawl = async () => {
    if (!url || !userId) return;

    setCrawling(true);
    setResults([]);
    setTotalPages(0);

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed_url: url, user_id: userId }),
        credentials: "include", // Ensure cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Crawl API error:", errorData);
        alert(`Error: ${errorData.error}\n${errorData.details || ''}\n${errorData.hint || ''}`);
        setCrawling(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            
            if (data.done) {
              setTotalPages(data.total);
              setCrawling(false);
            } else {
              setResults((prev) => [...prev, data]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Crawl error:", error);
      setCrawling(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Website Crawler</h1>
          <p className="text-slate-400">Crawl your hotel website to discover all pages and analyze SEO health</p>
        </div>

        {/* Crawler Input */}
        <div className="glass rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              placeholder="https://yourhotel.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={crawling}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
            />
            <button
              onClick={handleCrawl}
              disabled={crawling || !url}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              {crawling ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Crawling...
                </span>
              ) : (
                "Start Crawl"
              )}
            </button>
          </div>

          {crawling && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>Discovered {results.length} pages so far...</span>
            </div>
          )}

          {!crawling && totalPages > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Crawl complete! Found {totalPages} pages.</span>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="glass rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-6">Crawl Results</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.error ? "bg-red-500/10 border border-red-500/20" : "bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">#{result.index}</span>
                        <span className="text-sm font-mono text-indigo-400 truncate">{result.url}</span>
                      </div>
                      {result.title && (
                        <p className="text-sm text-slate-300">{result.title}</p>
                      )}
                      {result.error && (
                        <p className="text-sm text-red-400">{result.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

