import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, StatusPill } from "@/components/status-pill";
import { Sparkline } from "@/components/sparkline";
import { useDeployments } from "@/hooks/useDeployments";
import { useFixes } from "@/hooks/useFixes";
import { dashboardApi } from "@/services/api";
import {
  Activity,
  GitBranch,
  Sparkles,
  TrendingUp,
  ArrowRight,
  GitPullRequest,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard · AutoFix.sh" }] }),
});

const metricDefs = [
  {
    label: "Deployment health",
    key: "pass_rate" as const,
    suffix: "%",
    delta: "+1.2%",
    icon: Activity,
    accent: "text-success",
  },
  {
    label: "Active repositories",
    key: "active_deployments" as const,
    suffix: "",
    delta: "+3",
    icon: GitBranch,
    accent: "text-foreground",
  },
  {
    label: "AI fixes (24h)",
    key: "total_fixes" as const,
    suffix: "",
    delta: "+12",
    icon: Sparkles,
    accent: "text-primary",
  },
  {
    label: "Mean time to heal",
    key: "mean_time_to_heal" as const,
    suffix: "s",
    delta: "-8s",
    icon: TrendingUp,
    accent: "text-success",
  },
];

function DashboardPage() {
  const { data: deployments = [] } = useDeployments();
  const { data: fixes = [] } = useFixes();
  const { data: metrics } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => await dashboardApi.metrics(),
    refetchInterval: 5000,
  });

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Self-healing deployment activity across your workspace."
      >
        <Link
          to="/deployments"
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent"
        >
          All deployments
        </Link>
      </PageHeader>

      {/* Metric cards */}
      <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricDefs.map((m) => {
          const raw = metrics?.[m.key as keyof typeof metrics] ?? "—";
          const value =
            m.key === "pass_rate"
              ? `${raw}%`
              : m.key === "mean_time_to_heal"
                ? String(raw)
                : String(raw);
          return (
            <div key={m.label} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{m.label}</span>
                <m.icon className={`h-4 w-4 ${m.accent}`} />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold tracking-tight">{value}</span>
                <span className="font-mono text-[11px] text-success">{m.delta}</span>
              </div>
              <div className="mt-3 h-8">
                <Sparkline accent={m.accent} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 px-6 pb-6 lg:grid-cols-3">
        {/* Recent deployments */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <h2 className="text-sm font-medium">Recent deployments</h2>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>
            <Link
              to="/deployments"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {deployments.slice(0, 6).map((r, i) => (
              <Link
                key={i}
                to="/deployments/$id"
                params={{ id: r.id }}
                className="flex items-center gap-4 px-5 py-3 hover:bg-surface-elevated transition-colors"
              >
                <StatusPill status={r.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono truncate">
                      {r.org}/{r.repo}
                    </span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="font-mono text-xs text-muted-foreground">{r.branch}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {r.commitMessage}
                  </div>
                </div>
                <div className="hidden md:block font-mono text-[11px] text-muted-foreground">
                  {r.id}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground w-16 text-right">
                  {r.time}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent AI fixes */}
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Recent AI fixes
            </h2>
            <p className="text-xs text-muted-foreground">Patches committed automatically</p>
          </div>
          <div className="divide-y divide-border">
            {fixes.slice(0, 4).map((f, i) => (
              <Link
                key={i}
                to="/fixes"
                className="block px-5 py-3 hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-3.5 w-3.5 text-success" />
                  <span className="font-mono text-xs">{f.pr}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    <span className="text-success">+{f.lines.add}</span>{" "}
                    <span className="text-destructive">-{f.lines.del}</span>
                  </span>
                </div>
                <div className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                  {f.file}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
