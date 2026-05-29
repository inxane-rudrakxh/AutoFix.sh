// ─── Status ────────────────────────────────────────────────────────────────

export type Status = "success" | "failed" | "running" | "queued" | "healed";

// ─── Log ───────────────────────────────────────────────────────────────────

export type LogLevel = "info" | "ok" | "err" | "ai" | "warn";

export interface LogLine {
  t: string;
  lvl: LogLevel;
  src: string;
  msg: string;
}

// ─── Diff ──────────────────────────────────────────────────────────────────

export type DiffLineType = "add" | "del" | "context";

export interface DiffLine {
  type: DiffLineType;
  text: string;
}

// ─── Timeline ──────────────────────────────────────────────────────────────

export type TimelineState = "done" | "error" | "success" | "running";

export interface TimelineStep {
  t: string;
  label: string;
  state: TimelineState;
  icon: string; // lucide icon name — resolved at render
}

// ─── Deployment ────────────────────────────────────────────────────────────

export interface Deployment {
  id: string; // commit SHA (short)
  repo: string; // e.g. "api-gateway"
  org: string; // e.g. "acme-corp"
  branch: string;
  status: Status;
  author: string;
  duration: string; // human-readable, e.g. "1m 42s"
  time: string; // relative, e.g. "2m ago"
  commitMessage: string;
}

export interface DeploymentDetail extends Deployment {
  workflowName: string;
  runId: string;
  headSha: string;
  timeline: DeploymentTimelineStep[];
  logs: LogLine[];
  fix?: FixDetail;
}

export interface DeploymentTimelineStep {
  t: string;
  label: string;
  state: TimelineState;
  iconKey: "GitCommit" | "XCircle" | "Sparkles" | "ShieldCheck" | "CheckCircle2" | "Loader2";
}

// ─── Repository ────────────────────────────────────────────────────────────

export interface Repository {
  name: string; // e.g. "api-gateway"
  org: string; // e.g. "acme-corp"
  lang: string;
  stars: number;
  openPRs: number;
  passRate: number; // 0–100
  status: Status;
  lastFix: string; // relative time
  webhookActive: boolean;
}

// ─── Fix ───────────────────────────────────────────────────────────────────

export interface Fix {
  id: string;
  pr: string; // e.g. "#842"
  prUrl: string;
  repo: string;
  org: string;
  file: string;
  summary: string;
  lines: { add: number; del: number };
  status: Status;
  createdAt: string; // ISO timestamp
}

export interface FixDetail extends Fix {
  diff: DiffLine[];
  sandboxDuration: number; // seconds
  testsPassed: number;
  commitSha: string;
  aiConfidence: number; // 0–1
  commitMessage: string;
}

// ─── Dashboard Metrics ─────────────────────────────────────────────────────

export interface DashboardMetrics {
  deploymentHealth: number; // percent
  activeRepositories: number;
  aiFixesLast24h: number;
  meanTimeToHeal: number; // seconds
}

// ─── API Response wrappers ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  ok: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Webhook / Events ──────────────────────────────────────────────────────

export type AgentEventType =
  | "deployment.detected"
  | "analysis.started"
  | "patch.generated"
  | "sandbox.started"
  | "sandbox.result"
  | "commit.pushed"
  | "deployment.healed"
  | "deployment.failed";

export interface AgentEvent {
  type: AgentEventType;
  deploymentId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
