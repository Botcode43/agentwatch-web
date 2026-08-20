import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get('employee_id') || 'emp_001';

  const sessions = await prisma.session.findMany({
    where: { employee_id: employeeId },
  });

  const total_sessions = sessions.length;
  const total_estimated_tokens = sessions.reduce((s: number, x) => s + x.estimated_tokens, 0);
  const potentially_avoidable_tokens = sessions.reduce((s: number, x) => s + x.potentially_avoidable_tokens, 0);
  const potentially_avoidable_percentage =
    total_estimated_tokens > 0
      ? Math.round((potentially_avoidable_tokens / total_estimated_tokens) * 1000) / 10
      : 0;
  const average_efficiency =
    total_sessions > 0
      ? Math.round(sessions.reduce((s: number, x) => s + x.efficiency_score, 0) / total_sessions * 10) / 10
      : 0;

  return NextResponse.json({
    employee_id: employeeId,
    total_sessions,
    total_estimated_tokens,
    potentially_avoidable_tokens,
    potentially_avoidable_percentage,
    average_efficiency,
  });
}
