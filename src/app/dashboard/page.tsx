"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  // Mock AI-generated data
  const metrics = {
    seoScore: 87,
    geoRanking: 42,
    organicTraffic: "+34%",
    flawedPages: 12,
  };

  const geoLocations = [
    { city: "San Francisco", rank: 3, change: "+2" },
    { city: "Los Angeles", rank: 7, change: "+1" },
    { city: "New York", rank: 12, change: "-1" },
    { city: "Chicago", rank: 15, change: "0" },
    { city: "Miami", rank: 18, change: "+3" },
  ];

  const flawedPages = [
    { url: "/rooms/deluxe-suite", issue: "Missing meta description", severity: "high" },
    { url: "/amenities", issue: "Slow page load (4.2s)", severity: "high" },
    { url: "/contact", issue: "Broken image links (3)", severity: "medium" },
    { url: "/gallery", issue: "Duplicate title tag", severity: "medium" },
    { url: "/about", issue: "Missing alt text (5 images)", severity: "low" },
  ];

  const seoMetrics = [
    { label: "SEO Health", score: 87, color: "bg-indigo-500" },
    { label: "Page Speed", score: 72, color: "bg-cyan-500" },
    { label: "Mobile Friendly", score: 94, color: "bg-emerald-500" },
    { label: "Geo Coverage", score: 65, color: "bg-purple-500" },
  ];

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
          {/* Geo Rankings */}
          <div className="glass rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-6">Top Geo Rankings</h2>
            <div className="space-y-3">
              {geoLocations.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-sm font-bold text-indigo-400">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{location.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">Rank #{location.rank}</span>
                    <span className={`text-xs font-medium ${location.change.startsWith('+') ? 'text-emerald-400' : location.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                      {location.change !== "0" && location.change}
                    </span>
                  </div>
                </div>
              ))}
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
