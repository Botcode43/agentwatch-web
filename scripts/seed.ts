/**
 * Seed script — populates the DB with 4 employees and 3 demo sessions.
 * Run with: npx ts-node scripts/seed.ts
 * Or: npx tsx scripts/seed.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AgentWatch database...');

  // Employees
  const employees = [
    { id: 'emp_001', company_id: 'comp_001', name: 'Alex Chen', email: 'alex.chen@acme.io' },
    { id: 'emp_002', company_id: 'comp_001', name: 'Jordan Smith', email: 'jordan.smith@acme.io' },
    { id: 'emp_003', company_id: 'comp_001', name: 'Taylor Reed', email: 'taylor.reed@acme.io' },
    { id: 'emp_004', company_id: 'comp_001', name: 'Morgan Vance', email: 'morgan.vance@acme.io' },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { id: emp.id },
      update: emp,
      create: emp,
    });
    console.log(`  Employee: ${emp.name}`);
  }

  // Session 1 — Efficient (Alex Chen)
  await prisma.session.upsert({
    where: { id: 'sess_001_efficient' },
    update: {},
    create: {
      id: 'sess_001_efficient',
      employee_id: 'emp_001',
      company_id: 'comp_001',
      source: 'antigravity',
      started_at: new Date(Date.now() - 3600000 * 3),
      total_messages: 2,
      estimated_tokens: 185,
      potentially_avoidable_tokens: 9,
      efficiency_score: 94,
    },
  });
  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { session_id: 'sess_001_efficient', role: 'user', content: "TypeError in auth_middleware.py line 34: 'NoneType' object is not subscriptable.\nCode:\n```python\nuser = get_user(token)\nreturn user['roles']\n```\nExpected: fallback to [] if user is None.", estimated_tokens: 62 },
      { session_id: 'sess_001_efficient', role: 'assistant', content: 'I updated `auth_middleware.py` to safely check `if user is not None` before accessing `roles`. Added fallback `return user.get(\'roles\', []) if user else []`.', estimated_tokens: 45 },
    ],
  });
  await prisma.analysis.upsert({
    where: { session_id: 'sess_001_efficient' },
    update: {},
    create: {
      session_id: 'sess_001_efficient',
      efficiency_score: 94,
      waste_score: 6,
      issues: [],
      recommendations: ['Excellent interaction quality — clear context and precise error information provided upfront.'],
    },
  });

  // Session 2 — Retry loop (Taylor Reed)
  await prisma.session.upsert({
    where: { id: 'sess_002_retry_loop' },
    update: {},
    create: {
      id: 'sess_002_retry_loop',
      employee_id: 'emp_003',
      company_id: 'comp_001',
      source: 'antigravity',
      started_at: new Date(Date.now() - 3600000 * 5),
      total_messages: 6,
      estimated_tokens: 420,
      potentially_avoidable_tokens: 201,
      efficiency_score: 52,
    },
  });
  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { session_id: 'sess_002_retry_loop', role: 'user', content: 'Fix error in checkout.py', estimated_tokens: 20 },
      { session_id: 'sess_002_retry_loop', role: 'assistant', content: 'I edited the checkout.py logic to handle the edge case.', estimated_tokens: 55 },
      { session_id: 'sess_002_retry_loop', role: 'user', content: 'Try again.', estimated_tokens: 8 },
      { session_id: 'sess_002_retry_loop', role: 'assistant', content: 'I modified the checkout.py function signature and updated the error handling block.', estimated_tokens: 62 },
      { session_id: 'sess_002_retry_loop', role: 'user', content: 'Still broken. Try again.', estimated_tokens: 12 },
      { session_id: 'sess_002_retry_loop', role: 'assistant', content: 'I rewrote the checkout validation. The issue was in the discount calculation path.', estimated_tokens: 71 },
    ],
  });
  await prisma.analysis.upsert({
    where: { session_id: 'sess_002_retry_loop' },
    update: {},
    create: {
      session_id: 'sess_002_retry_loop',
      efficiency_score: 52,
      waste_score: 48,
      issues: [
        { type: 'repeated_attempts', severity: 'high', description: 'Multiple "try again" prompts were sent without providing new diagnostic information such as the error message or stack trace.' },
        { type: 'insufficient_context', severity: 'high', description: 'The initial prompt "Fix error in checkout.py" did not include the error message, line number, or expected behavior.' },
        { type: 'agent_loop', severity: 'medium', description: 'The agent produced 3 different fix attempts without the developer validating or providing feedback between turns.' },
      ],
      recommendations: [
        'Always include the full error message and stack trace in your first prompt.',
        'After each agent fix, test and report specifically what changed and what is still broken.',
        'Describe the expected and actual behavior so the agent can narrow the problem space.',
      ],
    },
  });

  // Session 3 — Poor context (Jordan Smith)
  await prisma.session.upsert({
    where: { id: 'sess_003_poor_context' },
    update: {},
    create: {
      id: 'sess_003_poor_context',
      employee_id: 'emp_002',
      company_id: 'comp_001',
      source: 'antigravity',
      started_at: new Date(Date.now() - 3600000 * 1.5),
      total_messages: 4,
      estimated_tokens: 310,
      potentially_avoidable_tokens: 86,
      efficiency_score: 72,
    },
  });
  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { session_id: 'sess_003_poor_context', role: 'user', content: 'My API is slow. Help.', estimated_tokens: 15 },
      { session_id: 'sess_003_poor_context', role: 'assistant', content: 'To diagnose API slowness, I need more information. What endpoint is slow? What is the average response time vs expected? Are you seeing database query issues or network latency?', estimated_tokens: 78 },
      { session_id: 'sess_003_poor_context', role: 'user', content: 'The /users endpoint is taking 3-4 seconds. The query is doing a full table scan on 100k records with no index.', estimated_tokens: 52 },
      { session_id: 'sess_003_poor_context', role: 'assistant', content: 'I added a composite index on (company_id, created_at) in your migration. This should reduce query time from O(n) to O(log n) on that dataset.', estimated_tokens: 68 },
    ],
  });
  await prisma.analysis.upsert({
    where: { session_id: 'sess_003_poor_context' },
    update: {},
    create: {
      session_id: 'sess_003_poor_context',
      efficiency_score: 72,
      waste_score: 28,
      issues: [
        { type: 'insufficient_context', severity: 'medium', description: 'Initial prompt lacked specifics — the agent needed a follow-up question before it could help. Starting with endpoint name and observed behavior would have saved one round-trip.' },
      ],
      recommendations: [
        'Lead with specifics: endpoint name, observed response time, and what you already tried.',
        'Include relevant code snippets or query plans when reporting performance issues.',
      ],
    },
  });

  console.log('\nSeeding complete!');
  console.log('  3 sessions created (efficient, retry-loop, poor-context)');
  console.log('  4 employees created');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
