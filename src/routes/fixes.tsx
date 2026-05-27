import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/status-pill";
import { Sparkles, GitPullRequest, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/fixes")({
  component: FixesPage,
  head: () => ({ meta: [{ title: "AI Fixes · AutoFix.sh" }] }),
});

const fixes = [
  {
    pr: "#842", repo: "api-gateway", file: "src/handlers/user.ts",
    summary: "Guard undefined user.id in getUser handler",
    lines: { add: 2, del: 1 },
    diff: [
      { type: "del", text: "const user = await db.users.findOne({ id: id });" },
      { type: "add", text: "if (!id) return null;" },
      { type: "add", text: "const user = await db.users.findOne({ id });" },
    ],
  },
  {
    pr: "#840", repo: "api-gateway", file: "lib/auth/jwt.ts",
    summary: "Use strict equality and await token verification",
    lines: { add: 5, del: 3 },
    diff: [
      { type: "del", text: "const user == verifyJwt(token)" },
      { type: "add", text: "const user = await verifyJwt(token);" },
    ],
  },
  {
    pr: "#838", repo: "web-client", file: "tests/api.spec.ts",
    summary: "Fix typo in expected response payload",
    lines: { add: 1, del: 1 },
    diff: [
      { type: "del", text: "expect(res.body).toEqual({ ok: ture });" },
      { type: "add", text: "expect(res.body).toEqual({ ok: true });" },
    ],
  },
];

function FixesPage() {
  return (
    <div>
      <PageHeader title="AI Fixes" subtitle="Every patch generated, validated, and committed by autofix-agent." />

      <div className="px-6 py-6 space-y-4">
        {fixes.map((f, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{f.summary}</div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <span>acme-corp/{f.repo}</span>
                    <span>·</span>
                    <span>{f.file}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[11px] text-muted-foreground">
                  <span className="text-success">+{f.lines.add}</span> <span className="text-destructive">−{f.lines.del}</span>
                </span>
                <StatusPill status="healed" />
                <a href="#" className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] hover:bg-accent">
                  <GitPullRequest className="h-3 w-3" /> {f.pr} <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
            <pre className="bg-terminal text-[12.5px] leading-6 font-mono">
              {f.diff.map((l, j) => {
                const cls = l.type === "add" ? "bg-success/10 text-success border-l-2 border-success" : "bg-destructive/10 text-destructive border-l-2 border-destructive";
                const sign = l.type === "add" ? "+" : "−";
                return (
                  <div key={j} className={`flex ${cls}`}>
                    <span className="select-none px-2">{sign}</span>
                    <span className="pr-4 whitespace-pre">{l.text}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
