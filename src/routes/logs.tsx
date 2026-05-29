import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/status-pill";
import { LogViewer } from "@/components/log-viewer";
import { useLogs } from "@/hooks/useLogs";
import { Filter } from "lucide-react";

export const Route = createFileRoute("/logs")({
  component: LogsPage,
  head: () => ({ meta: [{ title: "Logs · AutoFix.sh" }] }),
});

function LogsPage() {
  const { data: lines = [] } = useLogs();

  return (
    <div>
      <PageHeader
        title="Logs"
        subtitle="Live structured logs from runners, sandboxes, and the autofix agent."
      >
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent">
          <Filter className="h-3.5 w-3.5" /> All sources
        </button>
      </PageHeader>

      <div className="px-6 py-6">
        <LogViewer lines={lines} title="autofix-agent · acme-corp/api-gateway · run #1247" live />
      </div>
    </div>
  );
}
