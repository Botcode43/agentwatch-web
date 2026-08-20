import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const employees = await prisma.employee.findMany({
    include: { sessions: true },
  });

  const rankings = employees.map((emp) => {
    const sessions = emp.sessions;
    const total_tokens = sessions.reduce((s: number, x) => s + x.estimated_tokens, 0);
    const potentially_avoidable_tokens = sessions.reduce((s: number, x) => s + x.potentially_avoidable_tokens, 0);
    const potentially_avoidable_percentage =
      total_tokens > 0
        ? Math.round((potentially_avoidable_tokens / total_tokens) * 1000) / 10
        : 0;
    const efficiency_score =
      sessions.length > 0
        ? Math.round(sessions.reduce((s: number, x) => s + x.efficiency_score, 0) / sessions.length * 10) / 10
        : 100;

    return {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      company_id: emp.company_id,
      sessions: sessions.length,
      total_tokens,
      potentially_avoidable_tokens,
      potentially_avoidable_percentage,
      efficiency_score,
    };
  });

  // Sort ascending by efficiency_score (lowest first = needs coaching most)
  rankings.sort((a, b) => a.efficiency_score - b.efficiency_score);

  return NextResponse.json(rankings);
}
