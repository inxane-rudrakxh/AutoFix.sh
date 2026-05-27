import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusPill, type Status } from "@/components/status-pill";
import { Search, Filter } from "lucide-react";

export const Route = createFileRoute("/deployments/")({
  component: DeploymentsPage,
  head: () => ({ meta: [{ title: "Deployments · AutoFix.sh" }] }),
});

const rows: { id: string; repo: string; branch: string; status: Status; author: string; duration: string; time: string }[] = [
  { id: "4f8e2d1", repo: "api-gateway", branch: "main", status: "healed", author: "rudra", duration: "1m 42s", time: "2m ago" },
  { id: "9c1a3b7", repo: "web-client", branch: "feat/checkout", status: "running", author: "aria", duration: "—", time: "4m ago" },
  { id: "2e88f01", repo: "worker-queue", branch: "main", status: "success", author: "ben", duration: "47s", time: "11m ago" },
  { id: "77b4cc9", repo: "api-gateway", branch: "fix/auth", status: "failed", author: "rudra", duration: "1m 12s", time: "14m ago" },
  { id: "1a2d903", repo: "docs", branch: "main", status: "success", author: "kai", duration: "22s", time: "22m ago" },
  { id: "ff03e91", repo: "ml-pipeline", branch: "main", status: "healed", author: "mira", duration: "3m 08s", time: "31m ago" },
  { id: "ab7e221", repo: "billing", branch: "main", status: "success", author: "ben", duration: "1m 02s", time: "44m ago" },
  { id: "c901f8d", repo: "api-gateway", branch: "main", status: "queued", author: "aria", duration: "—", time: "1h ago" },
];

function DeploymentsPage() {
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
              {rows.map((r) => (
                <tr key={r.id} className="group">
                  <td className="px-5 py-3"><StatusPill status={r.status} /></td>
                  <td className="px-5 py-3">
                    <Link to="/deployments/$id" params={{ id: r.id }} className="font-mono text-xs text-primary hover:underline">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">acme-corp/{r.repo}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{r.branch}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground hidden lg:table-cell">{r.author}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden lg:table-cell">{r.duration}</td>
                  <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground text-right">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
