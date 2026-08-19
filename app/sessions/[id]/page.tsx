'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Cpu, Zap, AlertTriangle, CheckCircle2, Lightbulb, 
  MessageSquare, User, Bot, Clock, AlertCircle, RefreshCw 
} from 'lucide-react';
import { fetchSessionDetail, fetchSessionAnalysis } from '@/lib/api';
import { SessionDetail, Analysis } from '@/types';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    async function loadSessionData() {
      setLoading(true);
      const [sessData, anaData] = await Promise.all([
        fetchSessionDetail(sessionId),
        fetchSessionAnalysis(sessionId)
      ]);
      setSession(sessData);
      setAnalysis(anaData);
      setLoading(false);
    }
    if (sessionId) {
      loadSessionData();
    }
  }, [sessionId]);

  const handleReanalyze = async () => {
    setAnalyzing(true);
    const anaData = await fetchSessionAnalysis(sessionId);
    setAnalysis(anaData);
    setAnalyzing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-indigo-400 font-mono text-sm">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing session timeline...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Session Not Found</h2>
        <p className="text-sm text-gray-400">The requested session ID `{sessionId}` could not be located.</p>
        <Link href="/sessions" className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Session Explorer</span>
        </Link>
      </div>
    );
  }

  const effScore = analysis?.efficiency_score ?? session.efficiency_score;
  const effBadgeColor =
    effScore >= 80 ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
    effScore >= 60 ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' :
    'border-rose-500/40 text-rose-400 bg-rose-500/10';

  return (
    <div className="space-y-8">
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <Link
          href="/sessions"
          className="inline-flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Session List</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-white font-mono">{session.id}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 uppercase">
                {session.source}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
              <span>Employee: <strong className="text-gray-200">{session.employee_id}</strong></span>
              <span>&bull;</span>
              <span>Recorded: {new Date(session.started_at).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleReanalyze}
            disabled={analyzing}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-medium text-gray-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Analyzing with Gemini...' : 'Re-run Gemini Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Interaction Efficiency Gauge */}
        <div className={`metric-card border ${effBadgeColor}`}>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
            <span>Interaction Efficiency</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2 mt-3">
            <span className="text-4xl font-black">{effScore}%</span>
            <span className="text-xs font-mono opacity-80">/ 100 max</span>
          </div>
          <p className="text-xs opacity-80 mt-2">
            {effScore >= 80 ? 'High quality prompt & context clarity.' :
             effScore >= 60 ? 'Moderate interaction efficiency.' :
             'Low interaction efficiency — potential agent loop.'}
          </p>
        </div>

        {/* Total Estimated Tokens */}
        <div className="metric-card">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>TOTAL ESTIMATED TOKENS</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">
            {session.estimated_tokens.toLocaleString()}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Calculated across {session.messages?.length || session.total_messages} conversation turns
          </p>
        </div>

        {/* Potentially Avoidable Tokens */}
        <div className="metric-card border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
            <span>POTENTIALLY AVOIDABLE</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-3">
            {session.potentially_avoidable_tokens.toLocaleString()}
          </div>
          <p className="text-xs text-amber-400/80 mt-2 font-mono">
            Estimated overhead usage due to missing context or retries
          </p>
        </div>
      </div>

      {/* Analysis Grid (Issues & Recommendations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flagged Operational Issues */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Flagged Issues</h2>
          </div>

          {!analysis?.issues || analysis.issues.length === 0 ? (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>No major operational inefficiencies flagged in this session.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {analysis.issues.map((issue, idx) => {
                const sevBadge =
                  issue.severity === 'high' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                  issue.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  'bg-blue-500/20 text-blue-300 border-blue-500/40';

                return (
                  <div key={idx} className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white font-mono">{issue.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold border ${sevBadge}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{issue.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Gemini Coaching Recommendations */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Gemini Coaching Recommendations</h2>
          </div>

          {!analysis?.recommendations || analysis.recommendations.length === 0 ? (
            <div className="text-xs text-gray-400 italic">No recommendations available.</div>
          ) : (
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Conversation Timeline */}
      <div className="glass-panel rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Conversation Interaction Timeline</h2>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {session.messages?.length || 0} Turns Recorded
          </span>
        </div>

        <div className="space-y-6">
          {session.messages?.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`p-5 rounded-xl border transition-all ${
                  isUser
                    ? 'bg-indigo-950/20 border-indigo-500/30 ml-0 sm:mr-8'
                    : 'bg-gray-800/40 border-gray-700/60 ml-0 sm:ml-8'
                }`}
              >
                <div className="flex items-center justify-between mb-3 text-xs font-mono border-b border-gray-800/60 pb-2">
                  <div className="flex items-center space-x-2">
                    {isUser ? (
                      <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className={`font-bold uppercase ${isUser ? 'text-indigo-300' : 'text-emerald-400'}`}>
                      {isUser ? 'Developer Prompt' : 'Antigravity Response'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="text-gray-300 font-bold">{msg.estimated_tokens} est. tokens</span>
                  </div>
                </div>

                <div className="text-sm text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
