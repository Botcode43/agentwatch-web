'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Activity, Zap, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { fetchEmployeeUsage, fetchEmployeeSessions } from '@/lib/api';
import { EmployeeUsage, SessionSummary } from '@/types';

export default function AdminEmployeeDetailPage() {
  const params = useParams();
  const empId = params.id as string;

  const [usage, setUsage] = useState<EmployeeUsage | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [uData, sData] = await Promise.all([
        fetchEmployeeUsage(empId),
        fetchEmployeeSessions(empId)
      ]);
      setUsage(uData);
      setSessions(sData);
      setLoading(false);
    }
    if (empId) {
      loadData();
    }
  }, [empId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-indigo-400 font-mono text-sm">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading employee record...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Rankings</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">{empId}</h1>
            <p className="text-xs text-gray-400">Employee Interaction Record & Coaching History</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="metric-card">
          <div className="text-xs text-gray-400 font-mono">TOTAL SESSIONS</div>
          <div className="text-3xl font-extrabold text-white mt-2">{usage?.total_sessions || 0}</div>
        </div>

        <div className="metric-card">
          <div className="text-xs text-gray-400 font-mono">ESTIMATED TOKENS</div>
          <div className="text-3xl font-extrabold text-white mt-2">{usage?.total_estimated_tokens.toLocaleString() || 0}</div>
        </div>

        <div className="metric-card">
          <div className="text-xs text-gray-400 font-mono">POTENTIALLY AVOIDABLE</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">{usage?.potentially_avoidable_tokens.toLocaleString() || 0}</div>
          <div className="text-xs text-amber-400/80 mt-1 font-mono">{usage?.potentially_avoidable_percentage}% of usage</div>
        </div>

        <div className="metric-card">
          <div className="text-xs text-gray-400 font-mono">EFFICIENCY SCORE</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{usage?.average_efficiency}%</div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Employee Session History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/60 text-xs font-mono text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3">Session ID</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Est Tokens</th>
                <th className="px-4 py-3">Avoidable</th>
                <th className="px-4 py-3">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-800/40">
                  <td className="px-4 py-3 font-mono font-medium text-white">
                    <Link href={`/sessions/${s.id}`} className="hover:text-indigo-400 flex items-center space-x-1">
                      <span>{s.id}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-400 uppercase">{s.source}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(s.started_at).toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">{s.estimated_tokens}</td>
                  <td className="px-4 py-3 font-mono text-amber-400">{s.potentially_avoidable_tokens}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                      {s.efficiency_score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
