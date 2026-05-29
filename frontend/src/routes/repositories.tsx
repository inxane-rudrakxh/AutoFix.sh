import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/status-pill";
import { Github, Plus, GitBranch, Star, Loader2 } from "lucide-react";
import { useRepositories } from "@/hooks/useRepositories";

export const Route = createFileRoute("/repositories")({
  component: ReposPage,
  head: () => ({ meta: [{ title: "Repositories · AutoFix.sh" }] }),
});

const langColor: Record<string, string> = {
  TypeScript: "bg-primary",
  JavaScript: "bg-warning",
  Python: "bg-success",
  MDX: "bg-muted-foreground",
  Unknown: "bg-muted",
};

function ReposPage() {
  const { data: repos = [], isLoading } = useRepositories();

  return (
    <div>
      <PageHeader
        title="Repositories"
        subtitle="Connected via GitHub App · webhooks active on all listed repos."
      >
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent">
          <Github className="h-3.5 w-3.5" /> Manage on GitHub
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> Connect repo
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
          {repos.map((r) => (
            <div
              key={r.name}
              className="group rounded-lg border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:bg-surface-elevated"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {r.org}/<span className="font-mono">{r.name}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className={`h-2 w-2 rounded-full ${langColor[r.lang] || langColor.Unknown}`} />
                        {r.lang}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Star className="h-3 w-3" />
                        {r.stars}
                      </span>
                    </div>
                  </div>
                </div>
                <StatusPill status={r.status} />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border border-border bg-background py-2">
                  <div className="font-mono text-lg">{r.openPRs}</div>
                  <div className="text-[10px] text-muted-foreground">open PRs</div>
                </div>
                <div className="rounded-md border border-border bg-background py-2">
                  <div className="font-mono text-lg text-success">{r.passRate}%</div>
                  <div className="text-[10px] text-muted-foreground">pass rate</div>
                </div>
                <div className="rounded-md border border-border bg-background py-2">
                  <div className="font-mono text-xs pt-1">{r.lastFix}</div>
                  <div className="text-[10px] text-muted-foreground">last fix</div>
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-background">
                <div className="h-full bg-success" style={{ width: `${r.passRate}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
