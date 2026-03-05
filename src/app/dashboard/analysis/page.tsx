"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import type { SEOAnalysisResponse, PageData } from "@/types/seo-analysis";

export default function AnalysisPage() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysisResponse | null>(null);
  const [error, setError] = useState("");
  const [crawledPages, setCrawledPages] = useState<PageData[]>([]);
  const [crawlProgress, setCrawlProgress] = useState({ current: 0, total: 0 });

  const handleAnalyze = async () => {
    if (!url) return;

    setError("");
    setCrawling(true);
    setCrawledPages([]);
    setAnalysis(null);
    setCrawlProgress({ current: 0, total: 0 });

    try {
      // Step 1: Crawl the website
      const crawlResponse = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed_url: url }),
      });

      const reader = crawlResponse.body?.getReader();
      const decoder = new TextDecoder();
      const pages: PageData[] = [];

      if (!reader) {
        throw new Error("Failed to start crawling");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.done) {
              setCrawlProgress({ current: data.total, total: data.total });
              setCrawling(false);
            } else if (data.url && data.content) {
              pages.push({ url: data.url, content: data.content });
              setCrawlProgress({ current: data.index, total: data.queued + data.index });
            }
          }
        }
      }

      setCrawledPages(pages);

      // Step 2: Analyze with Gemini
      if (pages.length === 0) {
        setError("No pages were crawled successfully");
        return;
      }

      setAnalyzing(true);

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const analysisData: SEOAnalysisResponse = await analysisResponse.json();
      setAnalysis(analysisData);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCrawling(false);
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-400";
      case "high":
        return "bg-orange-500/10 text-orange-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400";
      default:
        return "bg-blue-500/10 text-blue-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SEO Analysis</h1>
          <p className="text-slate-400">
            Analyze your hotel website with AI-powered SEO insights
          </p>
        </div>

        {/* Input Section */}
        <div className="glass rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              placeholder="https://your-hotel-website.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              disabled={crawling || analyzing}
            />
            <button
              onClick={handleAnalyze}
              disabled={!url || crawling || analyzing}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              {crawling ? "Crawling..." : analyzing ? "Analyzing..." : "Analyze Website"}
            </button>
          </div>

          {/* Progress */}
          {(crawling || analyzing) && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span>
                  {crawling
                    ? `Crawling pages... ${crawlProgress.current}/${crawlProgress.total || "?"}`
                    : "Analyzing with AI..."}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                  style={{
                    width: crawling
                      ? `${(crawlProgress.current / (crawlProgress.total || 1)) * 100}%`
                      : "50%",
                  }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Overall Score */}
            <div className="glass rounded-xl p-8 border border-white/10 text-center">
              <div className="mb-4">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </div>
                <div className="text-slate-400 mt-2">Overall SEO Score</div>
              </div>
              <p className="text-slate-300 max-w-2xl mx-auto">{analysis.summary}</p>
              <div className="text-xs text-slate-500 mt-4">
                Analyzed {analysis.analyzedPages} pages • {new Date(analysis.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(analysis.metrics).map(([key, value]) => (
                <div key={key} className="glass rounded-xl p-6 border border-white/10">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(value)}`}>
                    {value}
                  </div>
                  <div className="text-sm text-slate-400 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>
              ))}
            </div>

            {/* Issues and Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Issues */}
              <div className="glass rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-6">Issues Found ({analysis.issues.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysis.issues.length === 0 ? (
                    <p className="text-slate-400 text-sm">No issues found! 🎉</p>
                  ) : (
                    analysis.issues.map((issue, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-mono text-indigo-400 break-all">
                            {issue.url}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ml-2 whitespace-nowrap ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{issue.issue}</p>
                        <span className="text-xs text-slate-500 mt-1 inline-block">
                          {issue.category}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-6">Suggestions ({analysis.suggestions.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysis.suggestions.length === 0 ? (
                    <p className="text-slate-400 text-sm">No suggestions available</p>
                  ) : (
                    analysis.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-semibold text-white">{suggestion.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ml-2 whitespace-nowrap ${getSeverityColor(suggestion.priority)}`}>
                            {suggestion.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{suggestion.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{suggestion.category}</span>
                          <span className="text-emerald-400">{suggestion.estimatedImpact}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

