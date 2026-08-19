'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, Zap, AlertTriangle, CheckCircle2, ArrowUpRight, Clock, MessageSquare } from 'lucide-react';
import { fetchEmployeeUsage, fetchEmployeeSessions } from '@/lib/api';
import { EmployeeUsage, SessionSummary } from '@/types';

export default function DashboardPage() {
  const [usage, setUsage] = useState<EmployeeUsage | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [usageData, sessionData] = await Promise.all([
        fetchEmployeeUsage('emp_001'),
        fetchEmployeeSessions('emp_001')
      ]);
      setUsage(usageData);
      setSessions(sessionData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-indigo-400 font-mono text-sm">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading telemetry data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Developer Operational Dashboard</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Overview of AI agent interaction efficiency and potentially avoidable token usage.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>TOTAL SESSIONS</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {usage?.total_sessions || 0}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Antigravity sessions logged
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>ESTIMATED TOKENS</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {usage?.total_estimated_tokens.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Total tokens exchanged
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>POTENTIALLY AVOIDABLE</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">
            {usage?.potentially_avoidable_tokens.toLocaleString() || 0}
          </div>
          <div className="text-xs text-amber-400/80 mt-2 font-mono">
            {usage?.potentially_avoidable_percentage}% of total usage
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>AVG EFFICIENCY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            {usage?.average_efficiency}%
          </div>
          <div className="text-xs text-emerald-400/80 mt-2">
            Interaction score average
          </div>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Recent Agent Sessions</span>
          </h2>
          <Link
            href="/sessions"
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/50 text-xs font-mono text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Session ID</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Messages</th>
                <th className="px-4 py-3">Est. Tokens</th>
                <th className="px-4 py-3">Avoidable</th>
                <th className="px-4 py-3 rounded-r-lg">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {sessions.map((s) => {
                const eff = s.efficiency_score;
                const effColor =
                  eff >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                  eff >= 60 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                  'text-rose-400 bg-rose-500/10 border-rose-500/30';

                return (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors group">
                    <td className="px-4 py-3.5 font-mono font-medium text-white">
                      <Link
                        href={`/sessions/${s.id}`}
                        className="group-hover:text-indigo-400 transition-colors flex items-center space-x-1.5"
                      >
                        <span>{s.id}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 font-mono uppercase">{s.source}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">
                      {new Date(s.started_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">{s.total_messages}</td>
                    <td className="px-4 py-3.5 font-mono text-gray-300">{s.estimated_tokens}</td>
                    <td className="px-4 py-3.5 font-mono text-amber-400">{s.potentially_avoidable_tokens}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${effColor}`}>
                        {eff}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
