import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/status-pill";
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, ShieldCheck, GitCommit, Terminal } from "lucide-react";

export const Route = createFileRoute("/deployments/$id")({
  component: DeploymentDetailPage,
  head: () => ({ meta: [{ title: "Deployment · AutoFix.sh" }] }),
});

const timeline = [
  { t: "14:02:11", label: "Build started", state: "done", icon: GitCommit },
  { t: "14:02:14", label: "Tests failed", state: "error", icon: XCircle },
  { t: "14:02:15", label: "AI analysis started", state: "done", icon: Sparkles },
  { t: "14:02:18", label: "Patch generated", state: "done", icon: Sparkles },
  { t: "14:02:22", label: "Sandbox validation", state: "done", icon: ShieldCheck },
  { t: "14:02:43", label: "Commit pushed → PR #842", state: "success", icon: CheckCircle2 },
];

const diff = [
  { type: "context", text: "  export async function getUser(req: Request) {" },
  { type: "context", text: "    const { id } = req.params;" },
  { type: "del", text: "    const user = await db.users.findOne({ id: id });" },
  { type: "add", text: "    if (!id) return null;" },
  { type: "add", text: "    const user = await db.users.findOne({ id });" },
  { type: "context", text: "    return user;" },
  { type: "context", text: "  }" },
];

const logs = [
  { lvl: "info", t: "14:02:11", msg: "$ npm ci" },
  { lvl: "info", t: "14:02:13", msg: "added 1,247 packages in 1.8s" },
  { lvl: "info", t: "14:02:14", msg: "$ npm test" },
  { lvl: "err",  t: "14:02:14", msg: "FAIL tests/handlers/user.spec.ts" },
  { lvl: "err",  t: "14:02:14", msg: "  ✕ getUser › returns 404 when id missing" },
  { lvl: "err",  t: "14:02:14", msg: "    TypeError: Cannot read properties of undefined (reading 'id')" },
  { lvl: "err",  t: "14:02:14", msg: "        at getUser (src/handlers/user.ts:12:34)" },
  { lvl: "ai",   t: "14:02:15", msg: "→ autofix: analyzing stack trace…" },
  { lvl: "ai",   t: "14:02:18", msg: "→ autofix: guard nullable param, restructure destructure" },
  { lvl: "ok",   t: "14:02:41", msg: "✓ 247 passed (sandbox)" },
  { lvl: "ok",   t: "14:02:43", msg: "✓ committed 4f8e2d1 → PR #842" },
];

function DeploymentDetailPage() {
  const { id } = Route.useParams();
  return (
    <div>
      <PageHeader title={`Deployment ${id}`} subtitle="acme-corp/api-gateway · main · healed by autofix-agent">
        <Link to="/deployments" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent">
          <ArrowLeft className="h-3 w-3" /> All deployments
        </Link>
      </PageHeader>

      <div className="grid gap-4 px-6 py-6 lg:grid-cols-3">
        {/* Timeline */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Workflow timeline</h2>
          <p className="text-xs text-muted-foreground">End-to-end: 32 seconds</p>
          <ol className="relative mt-5 space-y-4 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
            {timeline.map((s, i) => {
              const color =
                s.state === "error" ? "text-destructive bg-destructive/10 border-destructive/40" :
                s.state === "success" ? "text-success bg-success/10 border-success/40" :
                "text-primary bg-primary/10 border-primary/30";
              return (
                <li key={i} className="relative">
                  <span className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${color}`}>
                    <s.icon className="h-2.5 w-2.5" />
                  </span>
                  <div className="text-sm">{s.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{s.t}</div>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-border bg-background p-3">
              <div className="text-muted-foreground">Tests</div>
              <div className="mt-1 font-mono text-success">247 passed</div>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <div className="text-muted-foreground">Patch size</div>
              <div className="mt-1 font-mono">+2 −1</div>
            </div>
          </div>
        </div>

        {/* Diff */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <h2 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> AI diff viewer
              </h2>
              <p className="font-mono text-[11px] text-muted-foreground">src/handlers/user.ts</p>
            </div>
            <StatusPill status="healed" />
          </div>
          <pre className="overflow-x-auto bg-terminal p-0 text-[13px] leading-6 font-mono">
            {diff.map((l, i) => {
              const cls =
                l.type === "add" ? "bg-success/10 text-success border-l-2 border-success" :
                l.type === "del" ? "bg-destructive/10 text-destructive border-l-2 border-destructive" :
                "text-muted-foreground border-l-2 border-transparent";
              const sign = l.type === "add" ? "+" : l.type === "del" ? "−" : " ";
              return (
                <div key={i} className={`flex ${cls}`}>
                  <span className="select-none px-3 py-0 text-right w-10 text-muted-foreground/60 border-r border-border">{i + 1}</span>
                  <span className="px-2 select-none">{sign}</span>
                  <span className="pr-4 whitespace-pre">{l.text}</span>
                </div>
              );
            })}
          </pre>
          <div className="flex items-center justify-between border-t border-border bg-surface-elevated px-5 py-2.5 text-xs">
            <span className="font-mono text-muted-foreground">Commit message</span>
            <span className="font-mono">fix(handlers): guard undefined user.id in getUser</span>
          </div>
        </div>

        {/* Logs */}
        <div className="lg:col-span-3 rounded-lg border border-border bg-terminal overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-success" /> Build logs
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">live · streaming</span>
          </div>
          <pre className="overflow-x-auto p-5 text-[12.5px] leading-6 font-mono">
            {logs.map((l, i) => {
              const c = l.lvl === "err" ? "text-destructive" : l.lvl === "ai" ? "text-primary" : l.lvl === "ok" ? "text-success" : "text-foreground/80";
              return (
                <div key={i} className="flex gap-3">
                  <span className="text-muted-foreground/60 select-none">[{l.t}]</span>
                  <span className={c}>{l.msg}</span>
                </div>
              );
            })}
            <span className="text-success caret"> </span>
          </pre>
        </div>
      </div>
    </div>
  );
}
