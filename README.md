# AgentWatch Web — AI Coding Agent Usage Operations Dashboard

AgentWatch Web is the Next.js frontend application for the AgentWatch platform.

It provides engineering leaders and developers with real-time operational intelligence on AI coding-agent (Antigravity) usage, evaluating interaction effectiveness, flagging operational issues (retry-loop thrashing, missing context, agent loops), and providing Gemini coaching recommendations.

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom dark engineering theme & glassmorphism)
- **Icons**: Lucide Icons
- **Charts**: Recharts

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

Set the backend API endpoint:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server

Ensure `agentwatch-agent` (FastAPI backend) is running at `http://localhost:8000`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 🖥️ Screen & Feature Overview

1. **Role Login & Profile Selector (`/login` & `/`)**
   - Allows switching between Developer View and Admin View.
   - Quick launch buttons to test specific demo scenarios (e.g. Retry-Loop Thrashing Session).

2. **Developer Operational Dashboard (`/dashboard`)**
   - Displays aggregate metrics: Total Sessions, Total Estimated Tokens, Potentially Avoidable Tokens & %, and Average Efficiency Score.
   - Lists recent Antigravity interaction sessions.

3. **Session Explorer (`/sessions`)**
   - Searchable table of recorded developer ↔ AI agent interaction sessions with efficiency badges and token counts.

4. **Session Detail Page (`/sessions/[id]`) — Key Demo Screen**
   - **Interaction Efficiency Score Gauge** (0–100%).
   - **Flagged Operational Issues**: Categorized by severity (`high`, `medium`, `low`) for patterns like `repeated_attempts`, `insufficient_context`, and `agent_loop`.
   - **Gemini Coaching Recommendations**: Actionable advice to improve prompt clarity and reduce turnaround time.
   - **Conversation Interaction Timeline**: Full turn-by-turn developer prompts and AI agent responses with estimated token breakdown.

5. **Admin Employee Leaderboard (`/admin`)**
   - Organization-wide employee ranking table sorted by efficiency score to help engineering managers prioritize coaching.

---

## 🔒 Privacy & Operational Philosophy

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
│   │   └── [id]/page.tsx      # Session Detail & Gemini Coaching timeline (Key screen)
│   ├── admin/
│   │   ├── page.tsx           # Admin Leaderboard & Org metrics
│   │   └── employees/[id]/    # Employee Detail view
│   ├── globals.css            # Tailwind & glassmorphism styles
│   -[# layout.tsx             # Root layout with top navigation
├── components/
│   └── Navbar.tsx             # Top navigation header
├── lib/
│   └── api.ts                 # Backend API client with automatic fallback data
├── types/
│   └── index.ts               # TypeScript interfaces
├── package.json               # Node.js dependencies
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md
```
