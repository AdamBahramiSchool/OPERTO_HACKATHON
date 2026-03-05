"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

interface Analysis {
  website_url: string;
  overall_rating: {
    score: number;
    category: string;
    grade: string;
  };
  website_scores: {
    nap_consistency: { score: number; max_score: number; percentage: number; issues_found: number };
    schema_implementation: { score: number; max_score: number; percentage: number; issues_found: number };
    content_localization: { score: number; max_score: number; percentage: number; issues_found: number };
    technical_geo_seo: { score: number; max_score: number; percentage: number; issues_found: number };
    keyword_optimization: { score: number; max_score: number; percentage: number; issues_found: number };
    user_experience: { score: number; max_score: number; percentage: number; issues_found: number };
  };
  flawed_pages: Array<{
    page_url: string;
    page_type: string;
    page_rating: { score: number; category: string };
    problems: Array<{
      flaw_code: string;
      severity: string;
      title: string;
      description: string;
    }>;
  }>;
  summary: {
    total_pages_analyzed: number;
    flawed_pages_count: number;
    critical_issues_count: number;
    high_issues_count: number;
    medium_issues_count: number;
    low_issues_count: number;
  };
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError('Please log in to view insights');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to load insights');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setAnalysis(data.analysis);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to load insights');
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="p-8 relative z-10 animate-pulse">
      <div className="mb-8">
        <div className="h-9 bg-white/5 rounded-lg w-96 mb-2"></div>
        <div className="h-5 bg-white/5 rounded-lg w-64"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-xl p-6 border border-white/10">
            <div className="h-10 bg-white/5 rounded-lg mb-4"></div>
            <div className="h-9 bg-white/5 rounded-lg w-20 mb-1"></div>
            <div className="h-4 bg-white/5 rounded-lg w-24"></div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6 border border-white/10 mb-8">
        <div className="h-7 bg-white/5 rounded-lg w-64 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="glass rounded-xl p-6 border border-white/10">
            <div className="h-7 bg-white/5 rounded-lg w-48 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-16 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 relative z-10">
          <div className="glass rounded-xl p-8 border border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h2 className="text-xl font-bold text-red-400">Error Loading Insights</h2>
            </div>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="p-8 relative z-10">
          <div className="glass rounded-xl p-8 border border-white/10 text-center">
            <p className="text-slate-400">No analysis data available</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Extract metrics from analysis
  const metrics = {
    seoScore: analysis.overall_rating.score,
    geoRanking: analysis.summary.total_pages_analyzed,
    organicTraffic: `${analysis.overall_rating.grade}`,
    flawedPages: analysis.summary.flawed_pages_count,
  };

  const seoMetrics = [
    { label: "NAP Consistency", score: analysis.website_scores.nap_consistency.percentage, color: "bg-indigo-500" },
    { label: "Schema Markup", score: analysis.website_scores.schema_implementation.percentage, color: "bg-cyan-500" },
    { label: "Content Localization", score: analysis.website_scores.content_localization.percentage, color: "bg-emerald-500" },
    { label: "Keyword Optimization", score: analysis.website_scores.keyword_optimization.percentage, color: "bg-purple-500" },
  ];

  const flawedPages = analysis.flawed_pages.slice(0, 5).map(page => ({
    url: page.page_url,
    issue: page.problems[0]?.title || 'No issues',
    severity: page.problems[0]?.severity.toLowerCase() || 'low'
  }));

  return (
    <DashboardLayout>
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hotel Intelligence Dashboard</h1>
          <p className="text-slate-400">AI-powered insights for your property</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <span className="text-xs text-emerald-400 font-medium">+6 this week</span>
            </div>
            <div className="text-3xl font-bold text-indigo-400 mb-1">{metrics.seoScore}</div>
            <div className="text-sm text-slate-400">SEO Score</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <span className="text-xs text-emerald-400 font-medium">+5 cities</span>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{metrics.geoRanking}</div>
            <div className="text-sm text-slate-400">Geo Locations</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="text-xs text-emerald-400 font-medium">vs last month</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">{metrics.organicTraffic}</div>
            <div className="text-sm text-slate-400">Organic Traffic</div>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span className="text-xs text-red-400 font-medium">needs attention</span>
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">{metrics.flawedPages}</div>
            <div className="text-sm text-slate-400">Flawed Pages</div>
          </div>
        </div>

        {/* SEO Metrics */}
        <div className="glass rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold mb-6">SEO Performance Metrics</h2>
          <div className="space-y-4">
            {seoMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center gap-4">
                <span className="text-sm text-slate-400 w-32">{metric.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.color}`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
                <span className="text-sm text-slate-300 w-12 text-right">{metric.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Issue Summary */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-6">Issue Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Critical Issues</span>
                </div>
                <span className="text-xl font-bold text-red-400">{analysis.summary.critical_issues_count}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">High Priority</span>
                </div>
                <span className="text-xl font-bold text-orange-400">{analysis.summary.high_issues_count}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Medium Priority</span>
                </div>
                <span className="text-xl font-bold text-yellow-400">{analysis.summary.medium_issues_count}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Low Priority</span>
                </div>
                <span className="text-xl font-bold text-blue-400">{analysis.summary.low_issues_count}</span>
              </div>
            </div>
          </div>

          {/* Flawed Pages */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-6">Pages Needing Attention</h2>
            <div className="space-y-3">
              {flawedPages.map((page) => (
                <div key={page.url} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-mono text-indigo-400">{page.url}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      page.severity === 'high' ? 'bg-red-500/10 text-red-400' :
                      page.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {page.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{page.issue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
