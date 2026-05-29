import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/status-pill";
import { DiffViewer } from "@/components/diff-viewer";
import { useFixes } from "@/hooks/useFixes";
import { Sparkles, GitPullRequest, ExternalLink, Loader2 } from "lucide-react";

export const Route = createFileRoute("/fixes")({
  component: FixesPage,
  head: () => ({ meta: [{ title: "AI Fixes · AutoFix.sh" }] }),
});

function FixesPage() {
  const { data: fixes = [], isLoading } = useFixes();

  return (
    <div>
      <PageHeader
        title="AI Fixes"
        subtitle="Every patch generated, validated, and committed by autofix-agent."
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="px-6 py-6 space-y-4">
          {fixes.map((f, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 border border-primary/20 shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{f.summary}</div>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                      <span>
                        {f.org}/{f.repo}
                      </span>
                      <span>·</span>
                      <span className="truncate max-w-[200px]">{f.file}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    <span className="text-success">+{f.lines.add}</span>{" "}
                    <span className="text-destructive">−{f.lines.del}</span>
                  </span>
                  <StatusPill status="healed" />
                  {f.prUrl && f.prUrl !== "#" ? (
                    <a
                      href={f.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] hover:bg-accent text-primary"
                    >
                      <GitPullRequest className="h-3 w-3" />
                      {f.pr}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                      <GitPullRequest className="h-3 w-3" />
                      {f.pr || "PR Pending"}
                    </div>
                  )}
                </div>
              </div>

              {/* Diff */}
              {f.diff && f.diff.length > 0 ? (
                <DiffViewer diff={f.diff} />
              ) : (
                <div className="p-4 text-xs text-muted-foreground font-mono">
                  No diff details available.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
