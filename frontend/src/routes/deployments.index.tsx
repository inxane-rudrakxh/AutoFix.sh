import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/status-pill";
import { useDeployments } from "@/hooks/useDeployments";
import { Search, Filter } from "lucide-react";

export const Route = createFileRoute("/deployments/")({
  component: DeploymentsPage,
  head: () => ({ meta: [{ title: "Deployments · AutoFix.sh" }] }),
});

function DeploymentsPage() {
  const { data: rows = [], isLoading } = useDeployments();

  return (
    <div>
      <PageHeader title="Deployments" subtitle="Every build, every fix, fully traceable.">
        <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground w-64">
          <Search className="h-3.5 w-3.5" />
          <span>Filter by repo, commit…</span>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent">
          <Filter className="h-3.5 w-3.5" /> Status
        </button>
      </PageHeader>

      <div className="px-6 py-6">
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated">
              <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Commit</th>
                <th className="px-5 py-3">Repository</th>
                <th className="px-5 py-3 hidden md:table-cell">Branch</th>
                <th className="px-5 py-3 hidden lg:table-cell">Author</th>
                <th className="px-5 py-3 hidden lg:table-cell">Duration</th>
                <th className="px-5 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-xs text-muted-foreground font-mono"
                  >
                    Loading deployments…
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="group hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-5 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        to="/deployments/$id"
                        params={{ id: r.id }}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {r.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {r.org}/{r.repo}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                      {r.branch}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {r.author}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden lg:table-cell">
                      {r.duration}
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground text-right">
                      {r.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
