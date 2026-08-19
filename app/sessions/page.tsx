'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { List, Search, Filter, ArrowUpRight, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { fetchEmployeeSessions } from '@/lib/api';
import { SessionSummary } from '@/types';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadSessions() {
      setLoading(true);
      const data = await fetchEmployeeSessions('emp_001');
      setSessions(data);
      setLoading(false);
    }
    loadSessions();
  }, []);

  const filteredSessions = sessions.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <List className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">Agent Sessions Explorer</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Browse and inspect recorded Antigravity interaction sessions.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-indigo-400 font-mono text-sm">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-3" />
            Loading sessions...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-800/60 text-xs font-mono text-gray-400 uppercase border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Session ID</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Messages</th>
                  <th className="px-6 py-4">Estimated Tokens</th>
                  <th className="px-6 py-4">Avoidable Usage</th>
                  <th className="px-6 py-4">Efficiency</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredSessions.map((s) => {
                  const eff = s.efficiency_score;
                  const effColor =
                    eff >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                    eff >= 60 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                    'text-rose-400 bg-rose-500/10 border-rose-500/30';

                  return (
                    <tr key={s.id} className="hover:bg-gray-800/40 transition-colors group">
                      <td className="px-6 py-4 font-mono font-medium text-white">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-indigo-400" />
                          <span>{s.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-400 uppercase">{s.source}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(s.started_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{s.total_messages} turns</td>
                      <td className="px-6 py-4 font-mono text-gray-300">{s.estimated_tokens.toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono text-amber-400">{s.potentially_avoidable_tokens.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${effColor}`}>
                          {eff}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/sessions/${s.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <span>Analyze</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
