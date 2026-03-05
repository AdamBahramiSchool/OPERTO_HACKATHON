import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/25">
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="8" width="3" height="7" rx="1" fill="white" fillOpacity="0.8" />
            <rect x="6" y="4" width="3" height="11" rx="1" fill="white" />
            <rect x="11" y="1" width="3" height="14" rx="1" fill="white" fillOpacity="0.8" />
          </svg>
        </div>

        <div className="glass rounded-2xl p-10 border border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Dashboard coming soon
          </div>
          <h1 className="text-3xl font-bold mb-3">You&apos;re in!</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            Your hotel intelligence dashboard is being built. Check back soon — your insights will be ready here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
