import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyzeSession } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const analysis = await prisma.analysis.findUnique({
    where: { session_id: params.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
  }

  return NextResponse.json(analysis);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await prisma.session.findUnique({
    where: { id: params.id },
    include: { messages: { orderBy: { timestamp: 'asc' } } },
  });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const messages = session.messages.map((m) => ({ role: m.role, content: m.content }));
  const result = await analyzeSession(messages, session.estimated_tokens);

  const analysis = await prisma.analysis.upsert({
    where: { session_id: params.id },
    update: {
      efficiency_score: result.efficiency_score,
      waste_score: result.waste_score,
      issues: JSON.parse(JSON.stringify(result.issues)),
      recommendations: JSON.parse(JSON.stringify(result.recommendations)),
    },
    create: {
      session_id: params.id,
      efficiency_score: result.efficiency_score,
      waste_score: result.waste_score,
      issues: JSON.parse(JSON.stringify(result.issues)),
      recommendations: JSON.parse(JSON.stringify(result.recommendations)),
    },
  });

  // Update session efficiency score too
  await prisma.session.update({
    where: { id: params.id },
    data: { efficiency_score: result.efficiency_score },
  });

  return NextResponse.json(analysis);
}
