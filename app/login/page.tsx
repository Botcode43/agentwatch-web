'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, ShieldCheck, User, Building, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [selectedEmp, setSelectedEmp] = useState('emp_001');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to AgentWatch</h1>
          <p className="text-xs text-gray-400">AI Coding Agent Usage & Efficiency Intelligence</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800/80 rounded-xl border border-gray-700">
            <button
              type="button"
              onClick={() => setRole('employee')}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === 'employee'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Developer View</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Admin Leaderboard</span>
            </button>
          </div>

          {role === 'employee' && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Select Profile Demo Account</label>
              <select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="emp_001">Alex Chen (Senior Dev - 94% Efficiency)</option>
                <option value="emp_003">Taylor Reed (Junior Dev - 52% Efficiency)</option>
                <option value="emp_002">Jordan Smith (Frontend Dev - 72% Efficiency)</option>
                <option value="emp_004">Morgan Vance (Full Stack Dev - 100% Efficiency)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Enter AgentWatch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Transparent Coaching Engine &bull; Non-surveillance policy</span>
        </div>
      </div>
    </div>
  );
}
