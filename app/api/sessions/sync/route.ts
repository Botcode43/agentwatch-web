import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { analyzeSession } from '@/lib/gemini';
import { estimateTokens, estimateSessionTokens, estimatePotentiallyAvoidableTokens } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

const EventSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.string().optional(),
});

const SyncPayloadSchema = z.object({
  session_id: z.string(),
  source: z.string().default('antigravity'),
  employee_id: z.string(),
  company_id: z.string().default('comp_001'),
  events: z.array(EventSchema),
});

export async function POST(req: NextRequest) {
  // Optional: validate collector token
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const expectedToken = process.env.COLLECTOR_API_TOKEN;
  if (expectedToken && token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = SyncPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const { session_id, source, employee_id, company_id, events } = parsed.data;

  // Ensure employee exists
  let employee = await prisma.employee.findUnique({ where: { id: employee_id } });
  if (!employee) {
    employee = await prisma.employee.create({
      data: {
        id: employee_id,
        company_id,
        name: employee_id,
        email: `${employee_id}@agentwatch.local`,
      },
    });
  }

  // Compute token estimates
  const messages = events.map((e) => ({ role: e.role, content: e.content }));
  const estimatedTokens = estimateSessionTokens(messages);

  // Run Gemini analysis
  const analysis = await analyzeSession(messages, estimatedTokens);
  const potentiallyAvoidable = estimatePotentiallyAvoidableTokens(estimatedTokens, analysis.efficiency_score);

  // Upsert session
  const session = await prisma.session.upsert({
    where: { id: session_id },
    update: {
      total_messages: events.length,
      estimated_tokens: estimatedTokens,
      potentially_avoidable_tokens: potentiallyAvoidable,
      efficiency_score: analysis.efficiency_score,
    },
    create: {
      id: session_id,
      employee_id,
      company_id,
      source,
      started_at: events[0]?.timestamp ? new Date(events[0].timestamp) : new Date(),
      total_messages: events.length,
      estimated_tokens: estimatedTokens,
      potentially_avoidable_tokens: potentiallyAvoidable,
      efficiency_score: analysis.efficiency_score,
    },
  });

  // Delete old messages and re-insert
  await prisma.message.deleteMany({ where: { session_id } });
  await prisma.message.createMany({
    data: events.map((e) => ({
      session_id,
      role: e.role,
      content: e.content,
      timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
      estimated_tokens: estimateTokens(e.content),
    })),
  });

  // Upsert analysis
  await prisma.analysis.upsert({
    where: { session_id },
    update: {
      efficiency_score: analysis.efficiency_score,
      waste_score: analysis.waste_score,
      issues: JSON.parse(JSON.stringify(analysis.issues)),
      recommendations: JSON.parse(JSON.stringify(analysis.recommendations)),
    },
    create: {
      session_id,
      efficiency_score: analysis.efficiency_score,
      waste_score: analysis.waste_score,
      issues: JSON.parse(JSON.stringify(analysis.issues)),
      recommendations: JSON.parse(JSON.stringify(analysis.recommendations)),
    },
  });

  return NextResponse.json({ ok: true, session_id, efficiency_score: analysis.efficiency_score }, { status: 201 });
}
