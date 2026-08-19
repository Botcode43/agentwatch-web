import Link from 'next/link';
import { Activity, List, Users, ArrowRight, ShieldCheck, Zap, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl glass-panel p-8 sm:p-12 overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-gray-900 to-gray-950">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Developer AI Interaction Effectiveness Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Understand how <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">effectively</span> developers use AI agents.
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed">
            AgentWatch observes developer ↔ Antigravity interactions in real time, normalizes session telemetry, and uses Gemini to highlight interaction efficiency, loop thrashing, and missing context.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Activity className="w-5 h-5" />
              <span>Explore Dashboard</span>
            </Link>

            <Link
              href="/sessions/sess_002_retry_loop"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 text-amber-300 font-medium transition-all"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>View Retry-Loop Demo Session</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Core Operational Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Interaction Efficiency</h3>
          <p className="text-sm text-gray-400">
            Evaluates prompt context quality, stack trace presence, and single-pass resolution vs repetitive attempts.
          </p>
        </div>

        <div className="metric-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Potentially Avoidable Usage</h3>
          <p className="text-sm text-gray-400">
            Identifies low-information prompts ("try again", "still broken") and agent loops without claiming absolute waste.
          </p>
        </div>

        <div className="metric-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Gemini Coaching</h3>
          <p className="text-sm text-gray-400">
            Generates actionable coaching recommendations for developers to improve prompt clarity and reduce turnaround time.
          </p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span>Quick Navigation</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard" className="glass-panel p-5 rounded-xl hover:border-indigo-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">Developer Overview</span>
              <Activity className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">View aggregate token usage, efficiency scores, and recent sessions.</p>
          </Link>

          <Link href="/sessions" className="glass-panel p-5 rounded-xl hover:border-indigo-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">Session Explorer</span>
              <List className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Filter and inspect individual Antigravity agent interaction sessions.</p>
          </Link>

          <Link href="/admin" className="glass-panel p-5 rounded-xl hover:border-indigo-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">Admin Rankings</span>
              <Users className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Organization-wide employee efficiency comparison and coaching priority.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
