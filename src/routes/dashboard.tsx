import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusPill, type Status } from "@/components/status-pill";
import { Activity, GitBranch, Sparkles, TrendingUp, ArrowRight, GitPullRequest } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard · AutoFix.sh" }] }),
});

const metrics = [
  { label: "Deployment health", value: "98.4%", delta: "+1.2%", icon: Activity, accent: "text-success" },
  { label: "Active repositories", value: "24", delta: "+3", icon: GitBranch, accent: "text-foreground" },
  { label: "AI fixes (24h)", value: "47", delta: "+12", icon: Sparkles, accent: "text-primary" },
  { label: "Mean time to heal", value: "47s", delta: "-8s", icon: TrendingUp, accent: "text-success" },
];

const recent: { repo: string; branch: string; commit: string; status: Status; time: string; msg: string }[] = [
  { repo: "acme-corp/api-gateway", branch: "main", commit: "4f8e2d1", status: "healed", time: "2m ago", msg: "fix: handle undefined user.id in handler" },
  { repo: "acme-corp/web-client", branch: "feat/checkout", commit: "9c1a3b7", status: "running", time: "4m ago", msg: "feat: add stripe checkout flow" },
  { repo: "acme-corp/worker-queue", branch: "main", commit: "2e88f01", status: "success", time: "11m ago", msg: "chore: bump bullmq to 5.4" },
  { repo: "acme-corp/api-gateway", branch: "fix/auth", commit: "77b4cc9", status: "failed", time: "14m ago", msg: "refactor: jwt middleware" },
  { repo: "acme-corp/docs", branch: "main", commit: "1a2d903", status: "success", time: "22m ago", msg: "docs: update install guide" },
  { repo: "acme-corp/ml-pipeline", branch: "main", commit: "ff03e91", status: "healed", time: "31m ago", msg: "fix: missing import torch.nn" },
];

function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Self-healing deployment activity across your workspace.">
        <Link to="/deployments" className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent">All deployments</Link>
      </PageHeader>

      <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <m.icon className={`h-4 w-4 ${m.accent}`} />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold tracking-tight">{m.value}</span>
              <span className="font-mono text-[11px] text-success">{m.delta}</span>
            </div>
            <div className="mt-3 h-8">
              <Sparkline accent={m.accent} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 px-6 pb-6 lg:grid-cols-3">
        {/* Recent deployments */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <h2 className="text-sm font-medium">Recent deployments</h2>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>
            <Link to="/deployments" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recent.map((r, i) => (
              <Link
                key={i}
                to="/deployments/$id"
                params={{ id: r.commit }}
                className="flex items-center gap-4 px-5 py-3 hover:bg-surface-elevated transition-colors"
              >
                <StatusPill status={r.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono truncate">{r.repo}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="font-mono text-xs text-muted-foreground">{r.branch}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">{r.msg}</div>
                </div>
                <div className="hidden md:block font-mono text-[11px] text-muted-foreground">{r.commit}</div>
                <div className="font-mono text-[11px] text-muted-foreground w-16 text-right">{r.time}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI fixes side panel */}
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Recent AI fixes
            </h2>
            <p className="text-xs text-muted-foreground">Patches committed automatically</p>
          </div>
          <div className="divide-y divide-border">
            {[
              { file: "src/handlers/user.ts", pr: "#842", lines: "+2 -1" },
              { file: "lib/auth/jwt.ts", pr: "#840", lines: "+5 -3" },
              { file: "tests/api.spec.ts", pr: "#838", lines: "+1 -1" },
              { file: "src/db/queries.ts", pr: "#837", lines: "+8 -2" },
            ].map((f, i) => (
              <Link key={i} to="/fixes" className="block px-5 py-3 hover:bg-surface-elevated transition-colors">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-3.5 w-3.5 text-success" />
                  <span className="font-mono text-xs">{f.pr}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">{f.lines}</span>
                </div>
                <div className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{f.file}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ accent }: { accent: string }) {
  const points = [4, 8, 6, 10, 7, 12, 9, 14, 11, 16, 13, 18, 15, 20];
  const max = Math.max(...points);
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${30 - (p / max) * 28}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-full w-full">
      <polyline points={path} fill="none" stroke="currentColor" strokeWidth="1.5" className={accent} />
    </svg>
  );
}
