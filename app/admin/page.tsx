'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Zap, AlertTriangle, CheckCircle2, Building, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { fetchAdminEmployeeRankings, fetchAdminOrgUsage } from '@/lib/api';
import { AdminEmployeeRanking, AdminOrgUsage } from '@/types';

export default function AdminPage() {
  const [rankings, setRankings] = useState<AdminEmployeeRanking[]>([]);
  const [orgUsage, setOrgUsage] = useState<AdminOrgUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      const [rankData, usageData] = await Promise.all([
        fetchAdminEmployeeRankings(),
        fetchAdminOrgUsage()
      ]);
      setRankings(rankData);
      setOrgUsage(usageData);
      setLoading(false);
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-indigo-400 font-mono text-sm">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading organization analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Admin Employee Intelligence & Rankings</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Organization-wide interaction efficiency comparison and coaching prioritization.
        </p>
      </div>

      {/* Top Organization Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>TOTAL EMPLOYEES</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {orgUsage?.total_employees || 0}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Tracked developer accounts
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>TOTAL TOKENS EXCHANGED</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {orgUsage?.total_estimated_tokens.toLocaleString() || 0}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Across {orgUsage?.total_sessions} sessions
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>POTENTIALLY AVOIDABLE</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">
            {orgUsage?.potentially_avoidable_tokens.toLocaleString() || 0}
          </div>
          <div className="text-xs text-amber-400/80 mt-2 font-mono">
            {orgUsage?.potentially_avoidable_percentage}% of total org usage
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>ORG AVG EFFICIENCY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            {orgUsage?.average_efficiency}%
          </div>
          <div className="text-xs text-emerald-400/80 mt-2">
            Organization benchmark
          </div>
        </div>
      </div>

      {/* Employee Ranking Table */}
      <div className="glass-panel rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Employee Efficiency Leaderboard</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Sorted by efficiency score to highlight developers who benefit most from coaching.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/60 text-xs font-mono text-gray-400 uppercase border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Sessions</th>
                <th className="px-6 py-4">Total Tokens</th>
                <th className="px-6 py-4">Potentially Avoidable</th>
                <th className="px-6 py-4">Avoidable %</th>
                <th className="px-6 py-4">Efficiency Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {rankings.map((emp) => {
                const eff = emp.efficiency_score;
                const effColor =
                  eff >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                  eff >= 60 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                  'text-rose-400 bg-rose-500/10 border-rose-500/30';

                return (
                  <tr key={emp.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-white">{emp.name}</div>
                        <div className="text-xs font-mono text-gray-400">{emp.email} &bull; {emp.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-300">{emp.sessions}</td>
                    <td className="px-6 py-4 font-mono text-gray-300">{emp.total_tokens.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-amber-400">{emp.potentially_avoidable_tokens.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-amber-400">{emp.potentially_avoidable_percentage}%</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${effColor}`}>
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
