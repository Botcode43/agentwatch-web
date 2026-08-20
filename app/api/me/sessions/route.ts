import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get('employee_id') || 'emp_001';

  const sessions = await prisma.session.findMany({
    where: { employee_id: employeeId },
    orderBy: { started_at: 'desc' },
    select: {
      id: true,
      employee_id: true,
      company_id: true,
      source: true,
      started_at: true,
      total_messages: true,
      estimated_tokens: true,
      potentially_avoidable_tokens: true,
      efficiency_score: true,
    },
  });

  return NextResponse.json(sessions);
}
