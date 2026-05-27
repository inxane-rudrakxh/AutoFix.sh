import { Link } from "@tanstack/react-router";
import {
  Activity,
  GitBranch,
  Sparkles,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Github,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowDown,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
            <Activity className="h-4 w-4 text-primary" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success pulse-dot" />
          </div>
          <span className="font-mono text-sm font-semibold">autofix<span className="text-success">.sh</span></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
          <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
          <a href="https://github.com" className="hover:text-foreground transition-colors">Docs</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="https://github.com" className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-3.5 w-3.5" /> 4.2k
          </a>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Open dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur animate-fade-up">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
          Live · 12,847 builds healed this week
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl animate-fade-up" style={{ animationDelay: "60ms" }}>
          AI-powered <span className="text-foreground/60">self-healing</span><br />
          deployment agent.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-up" style={{ animationDelay: "120ms" }}>
          AutoFix.sh watches your GitHub Actions, diagnoses failures with AI, validates patches inside isolated sandboxes, and commits the fix straight to your PR.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all glow-primary">
            Try the dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a href="#workflow" className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm hover:bg-accent transition-colors">
            <Terminal className="h-4 w-4" /> See it work
          </a>
        </div>

        {/* Terminal preview */}
        <div className="relative mx-auto mt-16 max-w-4xl animate-fade-up" style={{ animationDelay: "260ms" }}>
          <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-primary/30 to-transparent opacity-40 blur-xl" />
          <div className="relative overflow-hidden rounded-xl border border-border bg-terminal shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              </div>
              <span className="ml-2 font-mono text-xs text-muted-foreground">autofix-agent · acme-corp/api-gateway</span>
              <span className="ml-auto rounded bg-success/10 px-2 py-0.5 text-[10px] font-mono text-success border border-success/30">healed</span>
            </div>
            <pre className="overflow-x-auto px-5 py-5 text-left font-mono text-[13px] leading-6">
{`> `}<span className="text-success">autofix watch --repo acme-corp/api-gateway</span>
<span className="text-muted-foreground">[14:02:11]</span> <span className="text-destructive">✕ build failed</span> · TypeError: Cannot read 'id' of undefined
<span className="text-muted-foreground">[14:02:13]</span> <span className="text-primary">→ analyzing stderr (24 lines)…</span>
<span className="text-muted-foreground">[14:02:18]</span> <span className="text-primary">→ patch generated</span> · src/handlers/user.ts <span className="text-muted-foreground">(+2 -1)</span>
<span className="text-muted-foreground">[14:02:22]</span> <span className="text-primary">→ sandbox: npm test</span>
<span className="text-muted-foreground">[14:02:41]</span> <span className="text-success">✓ 247 tests passed</span>
<span className="text-muted-foreground">[14:02:43]</span> <span className="text-success">✓ committed</span> 4f8e2d1 → PR #842<span className="caret" />
            </pre>
          </div>
        </div>

        {/* Logos */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs font-mono text-muted-foreground/60">
          <span>NODE.JS</span><span>·</span>
          <span>TYPESCRIPT</span><span>·</span>
          <span>GITHUB ACTIONS</span><span>·</span>
          <span>DOCKER</span><span>·</span>
          <span>VITEST</span><span>·</span>
          <span>JEST</span>
        </div>
      </section>

      {/* Problem */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs text-primary uppercase tracking-wider">The problem</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">CI failures are a tax on velocity.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every red build costs context switches: open logs, read traces, debug locally, push again, wait. AutoFix.sh removes the loop.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Syntax errors", value: "32%" },
              { label: "Failed tests", value: "41%" },
              { label: "Missing imports", value: "14%" },
              { label: "Type issues", value: "13%" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
                <div className="font-mono text-2xl font-semibold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border">
        <div className="text-center">
          <p className="font-mono text-xs text-primary uppercase tracking-wider">Workflow</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">From red to green, automatically.</h2>
        </div>
        <div className="mx-auto mt-12 max-w-2xl space-y-3">
          {[
            { icon: XCircle, color: "text-destructive", title: "GitHub Action fails", sub: "Webhook fires within ms of red status" },
            { icon: Terminal, color: "text-primary", title: "Logs captured", sub: "stderr + context streamed to the agent" },
            { icon: Sparkles, color: "text-primary", title: "AI generates patch", sub: "Minimal diff, formatting preserved" },
            { icon: ShieldCheck, color: "text-warning", title: "Sandbox validates", sub: "npm install · npm test in isolated Docker" },
            { icon: CheckCircle2, color: "text-success", title: "Commit pushed", sub: "AI-authored message, attached to PR" },
          ].map((step, i) => (
            <div key={i} className="group relative">
              <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background border border-border ${step.color}`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{step.sub}</div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">0{i + 1}</span>
              </div>
              {i < 4 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-3 w-3 text-muted-foreground/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border">
        <div className="text-center">
          <p className="font-mono text-xs text-primary uppercase tracking-wider">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Engineered for trust.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Github, title: "GitHub native", desc: "OAuth, webhooks, PR automation. Drop in, no config." },
            { icon: Sparkles, title: "Minimal patches", desc: "AI generates the smallest possible diff. Your style preserved." },
            { icon: ShieldCheck, title: "Sandbox validation", desc: "Every patch tested in isolated Docker before commit." },
            { icon: Zap, title: "Sub-minute heals", desc: "Median time-to-green: 47 seconds across MVP stack." },
            { icon: Terminal, title: "Full traceability", desc: "Every fix logged with reasoning, diff, and test output." },
            { icon: Activity, title: "Health metrics", desc: "Repo-level dashboards for pass rate, MTTR, savings." },
          ].map((f) => (
            <div key={f.title} className="group rounded-lg border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:bg-surface-elevated">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Stop debugging CI. Start shipping.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Install the GitHub app and let AutoFix.sh handle every red build automatically.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 glow-primary">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://github.com" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm hover:bg-accent">
                <Github className="h-4 w-4" /> Install GitHub App
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground">
          <div className="font-mono">© 2026 autofix.sh — built for the broken build.</div>
          <div className="flex items-center gap-4 font-mono">
            <a href="#" className="hover:text-foreground">privacy</a>
            <a href="#" className="hover:text-foreground">status</a>
            <a href="#" className="hover:text-foreground">changelog</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
