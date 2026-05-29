import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/status-pill";
import { DiffViewer } from "@/components/diff-viewer";
import { LogViewer } from "@/components/log-viewer";
import { useDeployment } from "@/hooks/useDeployments";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  GitCommit,
  Loader2,
} from "lucide-react";
import type { DeploymentTimelineStep } from "@/types";

export const Route = createFileRoute("/deployments/$id")({
  component: DeploymentDetailPage,
  head: () => ({ meta: [{ title: "Deployment · AutoFix.sh" }] }),
});

const iconMap = {
  GitCommit,
  XCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} as const;

function TimelineIcon({ step }: { step: DeploymentTimelineStep }) {
  const color =
    step.state === "error"
      ? "text-destructive bg-destructive/10 border-destructive/40"
      : step.state === "success"
        ? "text-success bg-success/10 border-success/40"
        : step.state === "running"
          ? "text-primary bg-primary/10 border-primary/30 animate-pulse"
          : "text-primary bg-primary/10 border-primary/30";

  const Icon = iconMap[step.iconKey];
  return (
    <span
      className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${color}`}
    >
      <Icon className={`h-2.5 w-2.5 ${step.state === "running" ? "animate-spin" : ""}`} />
    </span>
  );
}

function DeploymentDetailPage() {
  const { id } = Route.useParams();
  const { data: deployment, isLoading } = useDeployment(id);

  if (isLoading || !deployment) {
    return (
      <div>
        <PageHeader title={`Deployment ${id}`} subtitle="Loading…">
          <Link
            to="/deployments"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent"
          >
            <ArrowLeft className="h-3 w-3" /> All deployments
          </Link>
        </PageHeader>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const fix = deployment.fix;

  return (
    <div>
      <PageHeader
        title={`Deployment ${id}`}
        subtitle={`${deployment.org}/${deployment.repo} · ${deployment.branch} · ${deployment.status === "healed" ? "healed by autofix-agent" : deployment.status}`}
      >
        <Link
          to="/deployments"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent"
        >
          <ArrowLeft className="h-3 w-3" /> All deployments
        </Link>
      </PageHeader>

      <div className="grid gap-4 px-6 py-6 lg:grid-cols-3">
        {/* Timeline */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Workflow timeline</h2>
          <p className="text-xs text-muted-foreground">Run #{deployment.runId}</p>
          <ol className="relative mt-5 space-y-4 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
            {deployment.timeline.map((s, i) => (
              <li key={i} className="relative">
                <TimelineIcon step={s} />
                <div className="text-sm">{s.label}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{s.t}</div>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-border bg-background p-3">
              <div className="text-muted-foreground">Tests</div>
              <div className="mt-1 font-mono text-success">
                {fix ? `${fix.testsPassed} passed` : "—"}
              </div>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <div className="text-muted-foreground">Patch size</div>
              <div className="mt-1 font-mono">
                {fix ? `+${fix.lines.add} −${fix.lines.del}` : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* AI Diff Viewer */}
        {fix ? (
          <div className="lg:col-span-2 overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> AI diff viewer
                </h2>
                <p className="font-mono text-[11px] text-muted-foreground">{fix.file}</p>
              </div>
              <StatusPill status="healed" />
            </div>
            <DiffViewer diff={fix.diff} commitMessage={fix.commitMessage} />
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center rounded-lg border border-border bg-surface text-sm text-muted-foreground">
            No patch generated
          </div>
        )}

        {/* Build Logs */}
        <div className="lg:col-span-3">
          <LogViewer
            lines={deployment.logs}
            title={`autofix-agent · ${deployment.org}/${deployment.repo} · run #${deployment.runId}`}
            live={deployment.status === "running"}
          />
        </div>
      </div>
    </div>
  );
}
