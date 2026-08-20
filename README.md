# AgentWatch Web — Full-Stack AI Coding Agent Intelligence Platform

AgentWatch Web is the full-stack Next.js application for the AgentWatch platform. 

It acts as both the **cloud backend API** (ingesting session telemetry, executing Gemini-powered efficiency evaluations, and storing metrics via Prisma + Neon PostgreSQL) and the **engineering operations dashboard UI** (visualizing interaction scores, flagging retry loops/insufficient context, and providing developer coaching recommendations).

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions & API Routes)
- **Language**: TypeScript
- **Database / ORM**: Prisma 5 ORM with Neon PostgreSQL (or SQLite for local dev)
- **AI Analysis Engine**: Google Gemini API (`@google/generative-ai`) with heuristic fallback
- **Styling**: Tailwind CSS (Dark engineering design system)
- **Icons & Charts**: Lucide Icons & Recharts

---

## 🚀 Quick Start & Setup

### 1. Installation

```bash
cd agentwatch-web
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set your configuration in `.env.local`:
```env
# Database Connection (Neon PostgreSQL or SQLite connection string)
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/agentwatch?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@ep-xyz.neon.tech/agentwatch?sslmode=require"

# Gemini API Key — https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here

# Collector Shared Auth Token
COLLECTOR_API_TOKEN=agentwatch-collector-token-dev
```

> **Note**: If `GEMINI_API_KEY` is omitted, the API automatically uses an in-memory heuristic analyzer so the platform runs seamlessly offline or without paid credits.

### 3. Database Setup & Demo Data Seeding

Generate Prisma client and seed realistic demo data (4 employee profiles & 3 session scenarios):

```bash
# Push schema to database
npm run db:push

# Seed demo data
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Next.js Full-Stack API Surface

The API endpoints are served directly by Next.js Server-Side API Routes under `/api/`:

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/sessions/sync` | Collector ingestion endpoint — validates payload, saves session, runs Gemini analysis |
| `GET` | `/api/sessions/[id]` | Fetches full session details with turn-by-turn conversation messages |
| `GET` | `/api/analysis/[id]` | Fetches cached Gemini analysis for a session |
| `POST` | `/api/analysis/[id]` | Re-triggers Gemini AI analysis for a session |
| `GET` | `/api/me/sessions` | Lists sessions for a specific employee |
| `GET` | `/api/me/usage` | Aggregates token usage, avoidable token counts, and efficiency score for an employee |
| `GET` | `/api/admin/employees` | Returns organization leaderboard ranked by interaction efficiency score |
| `GET` | `/api/admin/usage` | Returns organization-wide usage and efficiency aggregate metrics |

---

## 🖥️ Application Features & Views

1. **Role Login & Profile Selector (`/login` & `/`)**
   - Switch between Developer View and Admin View.
   - Test predefined demo scenarios (e.g. Retry-Loop Thrashing Session).

2. **Developer Dashboard (`/dashboard`)**
   - Overview metrics: Total Sessions, Estimated Tokens, Potentially Avoidable Tokens & %, Average Efficiency Score.
   - List of recent interaction sessions.

3. **Session Explorer (`/sessions`)**
   - Searchable table of developer ↔ AI agent interaction sessions with real-time status badges.

4. **Session Detail & Gemini Analysis (`/sessions/[id]`) — Key Screen**
   - **Interaction Efficiency Gauge** (0–100%).
   - **Flagged Operational Issues**: Severity breakdown (`high`, `medium`, `low`) for `repeated_attempts`, `insufficient_context`, `agent_loop`.
   - **Gemini Coaching Recommendations**: Actionable advice to improve prompt clarity and reduce turnaround time.
   - **Turn-by-Turn Timeline**: Conversation log with token estimation per prompt/response.

5. **Admin Employee Leaderboard (`/admin`)**
   - Organization leaderboard sorted by efficiency score to help engineering leaders prioritize coaching.

---

## 🔒 Privacy & Coaching Philosophy

- **Coaching Over Surveillance**: Designed to help developers improve prompt clarity rather than punish usage.
- **Accurate Terminology**: Uses **"potentially avoidable tokens"** and **"interaction efficiency"** throughout the UI rather than definitive labels like "wasted tokens".

---

## 📂 Directory Structure

```
agentwatch-web/
├── app/
│   ├── page.tsx               # Landing & Hero view
│   ├── login/                 # Role Login & Profile selector
│   ├── dashboard/             # Developer Operational Overview
│   ├── sessions/
│   │   ├── page.tsx           # Session Explorer table
│   │   └── [id]/page.tsx      # Session Detail & Gemini Coaching timeline
│   ├── admin/
│   │   ├── page.tsx           # Admin Leaderboard & Org metrics
│   │   └── employees/[id]/    # Employee Detail view
│   ├── api/                   # Next.js Server API Routes
│   │   ├── sessions/          # Sync & session endpoints
│   │   ├── analysis/          # Gemini analysis endpoints
│   │   ├── me/                # Employee usage endpoints
│   │   └── admin/             # Leaderboard endpoints
│   ├── globals.css            # Tailwind & dark theme styling
│   └── layout.tsx             # Root layout with navbar
├── components/
│   └── Navbar.tsx             # Top navigation header
├── lib/
│   ├── db.ts                  # Prisma client singleton
│   ├── gemini.ts              # Gemini AI analysis engine + fallback evaluator
│   ├── analytics.ts           # Token estimation utilities
│   └── api.ts                 # Client-side API fetch wrapper
├── prisma/
│   └── schema.prisma          # Database schema (Employee, Session, Message, Analysis)
├── scripts/
│   └── seed.ts                # Database seed script for 4 employees & demo sessions
├── types/
│   └── index.ts               # Shared TypeScript interfaces
├── package.json               # Package dependencies & scripts
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md
```
