export interface Message {
  id: number;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  estimated_tokens: number;
}

export interface Issue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface Analysis {
  id: number;
  session_id: string;
  efficiency_score: number;
  waste_score: number;
  issues: Issue[];
  recommendations: string[];
  created_at: string;
}

export interface SessionSummary {
  id: string;
  employee_id: string;
  company_id: string;
  source: string;
  started_at: string;
  total_messages: number;
  estimated_tokens: number;
  potentially_avoidable_tokens: number;
  efficiency_score: number;
}

export interface SessionDetail extends SessionSummary {
  ended_at: string;
  messages: Message[];
}

export interface EmployeeUsage {
  employee_id: string;
  total_sessions: number;
  total_estimated_tokens: number;
  potentially_avoidable_tokens: number;
  potentially_avoidable_percentage: number;
  average_efficiency: number;
}

export interface AdminEmployeeRanking {
  id: string;
  name: string;
  email: string;
  company_id: string;
  sessions: number;
  total_tokens: number;
  potentially_avoidable_tokens: number;
  potentially_avoidable_percentage: number;
  efficiency_score: number;
}

export interface AdminOrgUsage {
  total_employees: number;
  total_sessions: number;
  total_estimated_tokens: number;
  potentially_avoidable_tokens: number;
  potentially_avoidable_percentage: number;
  average_efficiency: number;
}
