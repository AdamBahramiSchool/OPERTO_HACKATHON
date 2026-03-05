"use client";

import Link from "next/link";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const features = [
  {
    title: "SEO Health Audit",
    description:
      "Crawl every page of your hotel site. Identify missing meta tags, broken links, duplicate content, and slow-loading assets dragging your rankings down.",
    iconBg: "bg-indigo-500/10 border border-indigo-500/20",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-indigo-400">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Geo Targeting Intelligence",
    description:
      "See exactly which cities and regions are finding you — and which aren't. Uncover geo gaps where competitors are capturing demand you're missing.",
    iconBg: "bg-purple-500/10 border border-purple-500/20",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-purple-400">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "Traffic Analytics",
    description:
      "Track organic, direct, and referral traffic trends over time. Spot seasonality patterns and benchmark performance against market averages.",
    iconBg: "bg-cyan-500/10 border border-cyan-500/20",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
        <path d="M3 17L9 11 13 15 21 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Competitor Gap Analysis",
    description:
      "Know which keywords your top rivals rank for that you don't. Prioritize content and technical fixes with the highest booking impact.",
    iconBg: "bg-rose-500/10 border border-rose-500/20",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-rose-400">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <path d="M17.5 14v6M14.5 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Site Speed & Core Web Vitals",
    description:
      "Google ranks fast sites higher. We surface your LCP, FID, and CLS scores alongside actionable fixes you can hand directly to your dev team.",
    iconBg: "bg-amber-500/10 border border-amber-500/20",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-amber-400">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 12h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automated Weekly Reports",
    description:
      "Receive a clear, branded PDF every Monday with your top wins, regressions, and the three most impactful actions for the coming week.",
    iconBg: "bg-emerald-500/10 border border-emerald-500/20",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
        <path d="M9 12h6M9 16h4M6 20h12a2 2 0 002-2V8l-5-5H6a2 2 0 00-2 2v13a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Connect your property",
    description:
      "Add your hotel website URL. We verify ownership in seconds and begin a full technical crawl immediately — no plugins, no code.",
  },
  {
    title: "Get your baseline score",
    description:
      "Within minutes you'll see your SEO health score, geo reach map, and a prioritised list of issues sorted by revenue impact.",
  },
  {
    title: "Track growth over time",
    description:
      "Monitor weekly progress, validate fixes, and watch your rankings climb. Share live dashboards with your marketing team or agency.",
  },
];

const stats = [
  { value: "2,400+", label: "Hotels analyzed" },
  { value: "47%",    label: "Average traffic increase" },
  { value: "3 min",  label: "Time to first insight" },
  { value: "98/100", label: "Average final SEO score" },
];

/* ─── Dashboard Mockup ──────────────────────────────────────────────────── */

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* Glow behind card */}
      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl blur-2xl" />

      {/* Card */}
      <div className="relative glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
          <span className="w-3 h-3 rounded-full bg-rose-500/70" />
          <span className="w-3 h-3 rounded-full bg-amber-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs text-slate-500 font-medium">Operto Insights — Grand Pacific Hotel</span>
        </div>

        <div className="p-5 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "SEO Score", value: "94", sub: "+6 this week", color: "text-indigo-400" },
              { label: "Organic Traffic", value: "+32%", sub: "vs. last month", color: "text-emerald-400" },
              { label: "Geo Reach", value: "47", sub: "cities found", color: "text-purple-400" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-slate-500 mb-1">{kpi.label}</div>
                <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Area chart */}
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-slate-400 font-medium">Traffic Overview — Last 30 days</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+32%</span>
            </div>
            <svg viewBox="0 0 300 80" className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d="M0,70 C20,68 35,62 55,58 C75,54 85,60 105,50 C125,40 140,30 160,24 C180,18 200,14 220,10 C240,6 265,5 300,4 L300,80 L0,80 Z"
                fill="url(#areaGrad)"
              />
              {/* Line */}
              <path
                d="M0,70 C20,68 35,62 55,58 C75,54 85,60 105,50 C125,40 140,30 160,24 C180,18 200,14 220,10 C240,6 265,5 300,4"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* End dot */}
              <circle cx="300" cy="4" r="3" fill="#6366f1" />
            </svg>
          </div>

          {/* Score bars */}
          <div className="space-y-2.5">
            {[
              { label: "SEO Health", score: 94, color: "bg-indigo-500" },
              { label: "Page Speed", score: 88, color: "bg-cyan-500" },
              { label: "Geo Coverage", score: 61, color: "bg-purple-500" },
            ].map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 w-24 shrink-0">{bar.label}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.color}`}
                    style={{ width: `${bar.score}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 w-8 text-right">{bar.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating accent cards */}
      <div
        className="absolute -right-6 top-12 glass rounded-xl px-4 py-3 border border-white/10 text-sm font-semibold text-emerald-400"
        style={{ animation: "float 5s ease-in-out infinite", animationDelay: "1s" }}
      >
        <div className="text-[10px] text-slate-500 font-normal mb-0.5">This week</div>
        +18 keyword ranks
      </div>

      <div
        className="absolute -left-6 bottom-20 glass rounded-xl px-4 py-3 border border-white/10 text-sm font-semibold text-indigo-400"
        style={{ animation: "float 6s ease-in-out infinite", animationDelay: "2.5s" }}
      >
        <div className="text-[10px] text-slate-500 font-normal mb-0.5">Alert fixed</div>
        3 broken links
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* ── Background atmosphere ── */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Orbs */}
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse-orb"
        />
        <div
          className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[110px] animate-pulse-orb"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[90px] animate-pulse-orb"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="8" width="3" height="7" rx="1" fill="white" fillOpacity="0.8" />
                <rect x="6" y="4" width="3" height="11" rx="1" fill="white" />
                <rect x="11" y="1" width="3" height="14" rx="1" fill="white" fillOpacity="0.8" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">
              Operto<span className="text-indigo-400">Insights</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features"     className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it works</a>
            <a href="#stats"        className="text-sm text-slate-400 hover:text-white transition-colors">Results</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link href="/login"  className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Start Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                AI-Powered Hotel Intelligence
              </div>

              <h1 className="text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Turn your hotel into a{" "}
                <span
                  className="text-transparent bg-clip-text animate-gradient-x"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #818cf8, #a78bfa, #67e8f9, #818cf8)",
                  }}
                >
                  search magnet
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
                We analyze your hotel's SEO health, geo visibility, traffic patterns, and competitor gaps — then show you exactly how to dominate your market and drive more direct bookings.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 font-semibold text-white transition-all duration-200 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                >
                  Start Now — It&apos;s Free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 hover:border-white/20 font-medium text-slate-300 hover:text-white transition-all duration-200"
                >
                  See how it works
                </a>
              </div>

              {/* Inline stats */}
              <div className="flex items-center gap-6 mt-10 flex-wrap">
                {[
                  { value: "2,400+", label: "Hotels analyzed" },
                  { value: "47%",    label: "Avg traffic lift" },
                  { value: "3 min",  label: "To first insight" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-6">
                    {i > 0 && <div className="w-px h-8 bg-white/10" />}
                    <div>
                      <div className="text-2xl font-bold text-white">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup */}
            <div className="animate-float hidden lg:block">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
              Everything you need
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Complete hotel intelligence,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                one dashboard
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-[15px] leading-relaxed">
              Stop guessing why competitors outrank you. Get clear, actionable insights across every channel that drives hotel bookings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06] cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA inside features */}
          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              Analyze my hotel now
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl border border-white/5 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div
                    className="text-4xl font-bold text-transparent bg-clip-text mb-2"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
              Simple setup
            </div>
            <h2 className="text-4xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-slate-400">No plugins. No code. No technical knowledge required.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-11 left-[62%] right-0 h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="glass rounded-2xl p-8 border border-white/5 hover:border-white/15 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm mb-6">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-white mb-3 text-[15px]">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass rounded-3xl border border-white/10 p-16 lg:p-20 overflow-hidden text-center">
            {/* BG gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10" />
            {/* Glow orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-indigo-600/10 blur-[60px] rounded-full" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Ready when you are
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Ready to fill more rooms?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of hotels using Operto Insights to outrank competitors, fix site issues, and drive more direct bookings — starting today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 font-semibold text-white text-lg transition-all duration-200 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl glass border border-white/10 hover:border-white/20 font-medium text-slate-300 hover:text-white transition-all duration-200"
                >
                  Already have an account?
                </Link>
              </div>
              <p className="text-xs text-slate-600 mt-6">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="8" width="3" height="7" rx="1" fill="white" fillOpacity="0.8" />
                <rect x="6" y="4" width="3" height="11" rx="1" fill="white" />
                <rect x="11" y="1" width="3" height="14" rx="1" fill="white" fillOpacity="0.8" />
              </svg>
            </div>
            <span className="font-semibold text-sm">Operto<span className="text-indigo-400">Insights</span></span>
          </Link>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} OpertoInsights. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login"  className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Log in</Link>
            <Link href="/signup" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
