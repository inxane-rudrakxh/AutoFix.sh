/**
 * Centralized mock data for AutoFix.sh frontend.
 * Used by hooks as fallback when the backend is not yet available.
 * Once backend is live, hooks will fetch real data and this file
 * is only used in development / demo mode.
 */

import type {
  Deployment,
  DeploymentDetail,
  Repository,
  Fix,
  FixDetail,
  LogLine,
  DashboardMetrics,
} from "@/types";

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const mockMetrics: DashboardMetrics = {
  deploymentHealth: 98.4,
  activeRepositories: 24,
  aiFixesLast24h: 47,
  meanTimeToHeal: 47,
};

// ─── Deployments ───────────────────────────────────────────────────────────

export const mockDeployments: Deployment[] = [
  {
    id: "4f8e2d1",
    org: "acme-corp",
    repo: "api-gateway",
    branch: "main",
    status: "healed",
    author: "rudra",
    duration: "1m 42s",
    time: "2m ago",
    commitMessage: "fix: handle undefined user.id in handler",
  },
  {
    id: "9c1a3b7",
    org: "acme-corp",
    repo: "web-client",
    branch: "feat/checkout",
    status: "running",
    author: "aria",
    duration: "—",
    time: "4m ago",
    commitMessage: "feat: add stripe checkout flow",
  },
  {
    id: "2e88f01",
    org: "acme-corp",
    repo: "worker-queue",
    branch: "main",
    status: "success",
    author: "ben",
    duration: "47s",
    time: "11m ago",
    commitMessage: "chore: bump bullmq to 5.4",
  },
  {
    id: "77b4cc9",
    org: "acme-corp",
    repo: "api-gateway",
    branch: "fix/auth",
    status: "failed",
    author: "rudra",
    duration: "1m 12s",
    time: "14m ago",
    commitMessage: "refactor: jwt middleware",
  },
  {
    id: "1a2d903",
    org: "acme-corp",
    repo: "docs",
    branch: "main",
    status: "success",
    author: "kai",
    duration: "22s",
    time: "22m ago",
    commitMessage: "docs: update install guide",
  },
  {
    id: "ff03e91",
    org: "acme-corp",
    repo: "ml-pipeline",
    branch: "main",
    status: "healed",
    author: "mira",
    duration: "3m 08s",
    time: "31m ago",
    commitMessage: "fix: missing import torch.nn",
  },
  {
    id: "ab7e221",
    org: "acme-corp",
    repo: "billing",
    branch: "main",
    status: "success",
    author: "ben",
    duration: "1m 02s",
    time: "44m ago",
    commitMessage: "chore: upgrade stripe sdk",
  },
  {
    id: "c901f8d",
    org: "acme-corp",
    repo: "api-gateway",
    branch: "main",
    status: "queued",
    author: "aria",
    duration: "—",
    time: "1h ago",
    commitMessage: "feat: add rate limiting middleware",
  },
];

export function mockDeploymentDetail(id: string): DeploymentDetail {
  const base = mockDeployments.find((d) => d.id === id) ?? mockDeployments[0];
  return {
    ...base,
    workflowName: "CI",
    runId: "1247",
    headSha: base.id,
    timeline: [
      { t: "14:02:11", label: "Build started", state: "done", iconKey: "GitCommit" },
      { t: "14:02:14", label: "Tests failed", state: "error", iconKey: "XCircle" },
      { t: "14:02:15", label: "AI analysis started", state: "done", iconKey: "Sparkles" },
      { t: "14:02:18", label: "Patch generated", state: "done", iconKey: "Sparkles" },
      { t: "14:02:22", label: "Sandbox validation", state: "done", iconKey: "ShieldCheck" },
      {
        t: "14:02:43",
        label: "Commit pushed → PR #842",
        state: "success",
        iconKey: "CheckCircle2",
      },
    ],
    logs: mockLogStream,
    fix: mockFixDetails[0],
  };
}

// ─── Repositories ──────────────────────────────────────────────────────────

export const mockRepositories: Repository[] = [
  {
    name: "api-gateway",
    org: "acme-corp",
    lang: "TypeScript",
    stars: 1240,
    openPRs: 7,
    passRate: 98,
    status: "healed",
    lastFix: "2m ago",
    webhookActive: true,
  },
  {
    name: "web-client",
    org: "acme-corp",
    lang: "TypeScript",
    stars: 882,
    openPRs: 4,
    passRate: 96,
    status: "running",
    lastFix: "12m ago",
    webhookActive: true,
  },
  {
    name: "worker-queue",
    org: "acme-corp",
    lang: "JavaScript",
    stars: 311,
    openPRs: 2,
    passRate: 99,
    status: "success",
    lastFix: "1h ago",
    webhookActive: true,
  },
  {
    name: "ml-pipeline",
    org: "acme-corp",
    lang: "Python",
    stars: 540,
    openPRs: 1,
    passRate: 92,
    status: "healed",
    lastFix: "31m ago",
    webhookActive: true,
  },
  {
    name: "billing",
    org: "acme-corp",
    lang: "TypeScript",
    stars: 198,
    openPRs: 3,
    passRate: 100,
    status: "success",
    lastFix: "4h ago",
    webhookActive: true,
  },
  {
    name: "docs",
    org: "acme-corp",
    lang: "MDX",
    stars: 88,
    openPRs: 0,
    passRate: 100,
    status: "success",
    lastFix: "—",
    webhookActive: false,
  },
];

// ─── Fixes ─────────────────────────────────────────────────────────────────

export const mockFixes: Fix[] = [
  {
    id: "fix-842",
    pr: "#842",
    prUrl: "#",
    org: "acme-corp",
    repo: "api-gateway",
    file: "src/handlers/user.ts",
    summary: "Guard undefined user.id in getUser handler",
    lines: { add: 2, del: 1 },
    status: "healed",
    createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "fix-840",
    pr: "#840",
    prUrl: "#",
    org: "acme-corp",
    repo: "api-gateway",
    file: "lib/auth/jwt.ts",
    summary: "Use strict equality and await token verification",
    lines: { add: 5, del: 3 },
    status: "healed",
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: "fix-838",
    pr: "#838",
    prUrl: "#",
    org: "acme-corp",
    repo: "web-client",
    file: "tests/api.spec.ts",
    summary: "Fix typo in expected response payload",
    lines: { add: 1, del: 1 },
    status: "healed",
    createdAt: new Date(Date.now() - 31 * 60_000).toISOString(),
  },
  {
    id: "fix-837",
    pr: "#837",
    prUrl: "#",
    org: "acme-corp",
    repo: "api-gateway",
    file: "src/db/queries.ts",
    summary: "Add missing await in findUser query",
    lines: { add: 8, del: 2 },
    status: "healed",
    createdAt: new Date(Date.now() - 44 * 60_000).toISOString(),
  },
];

export const mockFixDetails: FixDetail[] = [
  {
    ...mockFixes[0],
    diff: [
      { type: "context", text: "  export async function getUser(req: Request) {" },
      { type: "context", text: "    const { id } = req.params;" },
      { type: "del", text: "    const user = await db.users.findOne({ id: id });" },
      { type: "add", text: "    if (!id) return null;" },
      { type: "add", text: "    const user = await db.users.findOne({ id });" },
      { type: "context", text: "    return user;" },
      { type: "context", text: "  }" },
    ],
    sandboxDuration: 19,
    testsPassed: 247,
    commitSha: "4f8e2d1",
    aiConfidence: 0.97,
    commitMessage: "[AutoFix] Guard undefined user.id in getUser · PR #842",
  },
  {
    ...mockFixes[1],
    diff: [
      { type: "del", text: "const user == verifyJwt(token)" },
      { type: "add", text: "const user = await verifyJwt(token);" },
    ],
    sandboxDuration: 22,
    testsPassed: 183,
    commitSha: "9c1a3b7",
    aiConfidence: 0.99,
    commitMessage: "[AutoFix] Await verifyJwt and fix equality operator · PR #840",
  },
  {
    ...mockFixes[2],
    diff: [
      { type: "del", text: "expect(res.body).toEqual({ ok: ture });" },
      { type: "add", text: "expect(res.body).toEqual({ ok: true });" },
    ],
    sandboxDuration: 14,
    testsPassed: 94,
    commitSha: "1a2d903",
    aiConfidence: 1.0,
    commitMessage: "[AutoFix] Fix typo in test assertion · PR #838",
  },
];

// ─── Log Stream ────────────────────────────────────────────────────────────

export const mockLogStream: LogLine[] = [
  { t: "14:02:11.412", lvl: "info", src: "runner", msg: "$ npm ci" },
  { t: "14:02:13.108", lvl: "info", src: "runner", msg: "added 1,247 packages in 1.8s" },
  { t: "14:02:13.420", lvl: "info", src: "runner", msg: "$ npm test" },
  { t: "14:02:14.001", lvl: "err", src: "vitest", msg: "FAIL tests/handlers/user.spec.ts" },
  {
    t: "14:02:14.001",
    lvl: "err",
    src: "vitest",
    msg: "  ✕ getUser › returns 404 when id missing (12ms)",
  },
  {
    t: "14:02:14.002",
    lvl: "err",
    src: "vitest",
    msg: "    TypeError: Cannot read properties of undefined (reading 'id')",
  },
  {
    t: "14:02:14.002",
    lvl: "err",
    src: "vitest",
    msg: "        at getUser (src/handlers/user.ts:12:34)",
  },
  { t: "14:02:14.500", lvl: "warn", src: "ci", msg: "exit code 1 · 4 tests failed" },
  { t: "14:02:15.000", lvl: "ai", src: "autofix", msg: "▸ classifying failure: runtime TypeError" },
  {
    t: "14:02:15.300",
    lvl: "ai",
    src: "autofix",
    msg: "▸ fetching context: src/handlers/user.ts (24 LOC)",
  },
  { t: "14:02:18.110", lvl: "ai", src: "autofix", msg: "▸ patch proposed: guard undefined param" },
  {
    t: "14:02:22.401",
    lvl: "info",
    src: "sandbox",
    msg: "spinning isolated node:20-alpine container",
  },
  { t: "14:02:25.022", lvl: "info", src: "sandbox", msg: "$ npm ci && npm test" },
  { t: "14:02:41.870", lvl: "ok", src: "vitest", msg: "✓ Test Files  18 passed (18)" },
  { t: "14:02:41.871", lvl: "ok", src: "vitest", msg: "✓ Tests       247 passed (247)" },
  { t: "14:02:43.211", lvl: "ok", src: "github", msg: "✓ pushed 4f8e2d1 to fix/auth → PR #842" },
];
