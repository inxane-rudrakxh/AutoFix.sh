import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/status-pill";
import { Terminal as TerminalIcon, Filter } from "lucide-react";

export const Route = createFileRoute("/logs")({
  component: LogsPage,
  head: () => ({ meta: [{ title: "Logs · AutoFix.sh" }] }),
});

type Line = { t: string; lvl: "info" | "ok" | "err" | "ai" | "warn"; src: string; msg: string };

const stream: Line[] = [
  { t: "14:02:11.412", lvl: "info", src: "runner", msg: "$ npm ci" },
  { t: "14:02:13.108", lvl: "info", src: "runner", msg: "added 1,247 packages in 1.8s" },
  { t: "14:02:13.420", lvl: "info", src: "runner", msg: "$ npm test" },
  { t: "14:02:14.001", lvl: "err",  src: "vitest", msg: "FAIL tests/handlers/user.spec.ts" },
  { t: "14:02:14.001", lvl: "err",  src: "vitest", msg: "  ✕ getUser › returns 404 when id missing (12ms)" },
  { t: "14:02:14.002", lvl: "err",  src: "vitest", msg: "    TypeError: Cannot read properties of undefined (reading 'id')" },
  { t: "14:02:14.002", lvl: "err",  src: "vitest", msg: "        at getUser (src/handlers/user.ts:12:34)" },
  { t: "14:02:14.500", lvl: "warn", src: "ci",     msg: "exit code 1 · 4 tests failed" },
  { t: "14:02:15.000", lvl: "ai",   src: "autofix",msg: "▸ classifying failure: runtime TypeError" },
  { t: "14:02:15.300", lvl: "ai",   src: "autofix",msg: "▸ fetching context: src/handlers/user.ts (24 LOC)" },
  { t: "14:02:18.110", lvl: "ai",   src: "autofix",msg: "▸ patch proposed: guard undefined param" },
  { t: "14:02:22.401", lvl: "info", src: "sandbox",msg: "spinning isolated node:20-alpine container" },
  { t: "14:02:25.022", lvl: "info", src: "sandbox",msg: "$ npm ci && npm test" },
  { t: "14:02:41.870", lvl: "ok",   src: "vitest", msg: "✓ Test Files  18 passed (18)" },
  { t: "14:02:41.871", lvl: "ok",   src: "vitest", msg: "✓ Tests       247 passed (247)" },
  { t: "14:02:43.211", lvl: "ok",   src: "github", msg: "✓ pushed 4f8e2d1 to fix/auth → PR #842" },
];

const color = (l: Line["lvl"]) =>
  l === "err" ? "text-destructive" :
  l === "ai" ? "text-primary" :
  l === "ok" ? "text-success" :
  l === "warn" ? "text-warning" :
  "text-foreground/80";

function LogsPage() {
  return (
    <div>
      <PageHeader title="Logs" subtitle="Live structured logs from runners, sandboxes, and the autofix agent.">
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent">
          <Filter className="h-3.5 w-3.5" /> All sources
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-3 py-1.5 font-mono text-[11px] text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> live
        </span>
      </PageHeader>

      <div className="px-6 py-6">
        <div className="overflow-hidden rounded-lg border border-border bg-terminal">
          <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
            <TerminalIcon className="h-3.5 w-3.5 text-success" />
            <span className="font-mono text-xs text-muted-foreground">autofix-agent · acme-corp/api-gateway · run #1247</span>
          </div>
          <pre className="overflow-x-auto p-5 text-[12.5px] leading-6 font-mono">
            {stream.map((l, i) => (
              <div key={i} className="flex gap-3 hover:bg-surface/60">
                <span className="text-muted-foreground/60 select-none w-28">{l.t}</span>
                <span className="select-none w-16 text-muted-foreground/80">[{l.src}]</span>
                <span className={`select-none w-10 uppercase text-[10px] pt-1 ${color(l.lvl)}`}>{l.lvl}</span>
                <span className={`flex-1 ${color(l.lvl)}`}>{l.msg}</span>
              </div>
            ))}
            <div className="flex gap-3 text-success"><span className="caret"> </span></div>
          </pre>
        </div>
      </div>
    </div>
  );
}
