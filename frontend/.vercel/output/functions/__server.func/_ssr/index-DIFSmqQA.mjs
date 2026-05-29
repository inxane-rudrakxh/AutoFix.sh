import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as Activity, i as Github, c as ArrowRight, T as Terminal, d as CircleX, o as Sparkles, n as ShieldCheck, C as CircleCheck, a as ArrowDown, Z as Zap } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function LandingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success pulse-dot" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold", children: [
          "autofix",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success", children: ".sh" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-7 text-sm text-muted-foreground md:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", className: "hover:text-foreground transition-colors", children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#workflow", className: "hover:text-foreground transition-colors", children: "Workflow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#demo", className: "hover:text-foreground transition-colors", children: "Demo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com", className: "hover:text-foreground transition-colors", children: "Docs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "https://github.com",
            className: "hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-3.5 w-3.5" }),
              " 4.2k"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/dashboard",
            className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors",
            children: [
              "Open dashboard ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur animate-fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-success pulse-dot" }),
        "Live · 12,847 builds healed this week"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "h1",
        {
          className: "mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl animate-fade-up",
          style: { animationDelay: "60ms" },
          children: [
            "AI-powered ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/60", children: "self-healing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "deployment agent."
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-up",
          style: { animationDelay: "120ms" },
          children: "AutoFix.sh watches your GitHub Actions, diagnoses failures with AI, validates patches inside isolated sandboxes, and commits the fix straight to your PR."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up",
          style: { animationDelay: "180ms" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/dashboard",
                className: "group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all glow-primary",
                children: [
                  "Try the dashboard",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-0.5 transition-transform" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "#workflow",
                className: "inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm hover:bg-accent transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-4 w-4" }),
                  " See it work"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative mx-auto mt-16 max-w-4xl animate-fade-up",
          style: { animationDelay: "260ms" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-px rounded-xl bg-gradient-to-b from-primary/30 to-transparent opacity-40 blur-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border border-border bg-terminal shadow-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-destructive/70" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-warning/70" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-success/70" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 font-mono text-xs text-muted-foreground", children: "autofix-agent · acme-corp/api-gateway" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto rounded bg-success/10 px-2 py-0.5 text-[10px] font-mono text-success border border-success/30", children: "healed" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("pre", { className: "overflow-x-auto px-5 py-5 text-left font-mono text-[13px] leading-6", children: [
                `> `,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success", children: "autofix watch --repo acme-corp/api-gateway" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "[14:02:11]" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "✕ build failed" }),
                " · TypeError: Cannot read 'id' of undefined",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "[14:02:13]" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "→ analyzing stderr (24 lines)…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "[14:02:18]" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "→ patch generated" }),
                " · src/handlers/user.ts",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(+2 -1)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "[14:02:22]" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "→ sandbox: npm test" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "[14:02:41]" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success", children: "✓ 247 tests passed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "[14:02:43]" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success", children: "✓ committed" }),
                " 4f8e2d1 → PR #842",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caret" })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs font-mono text-muted-foreground/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "NODE.JS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TYPESCRIPT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GITHUB ACTIONS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "DOCKER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "VITEST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "JEST" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 md:grid-cols-2 md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-primary uppercase tracking-wider", children: "The problem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-semibold tracking-tight md:text-4xl", children: "CI failures are a tax on velocity." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground leading-relaxed", children: "Every red build costs context switches: open logs, read traces, debug locally, push again, wait. AutoFix.sh removes the loop." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
        { label: "Syntax errors", value: "32%" },
        { label: "Failed tests", value: "41%" },
        { label: "Missing imports", value: "14%" },
        { label: "Type issues", value: "13%" }
      ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-semibold text-foreground", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: s.label })
      ] }, s.label)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "workflow",
        className: "relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-primary uppercase tracking-wider", children: "Workflow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-semibold tracking-tight md:text-4xl", children: "From red to green, automatically." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-12 max-w-2xl space-y-3", children: [
            {
              icon: CircleX,
              color: "text-destructive",
              title: "GitHub Action fails",
              sub: "Webhook fires within ms of red status"
            },
            {
              icon: Terminal,
              color: "text-primary",
              title: "Logs captured",
              sub: "stderr + context streamed to the agent"
            },
            {
              icon: Sparkles,
              color: "text-primary",
              title: "AI generates patch",
              sub: "Minimal diff, formatting preserved"
            },
            {
              icon: ShieldCheck,
              color: "text-warning",
              title: "Sandbox validates",
              sub: "npm install · npm test in isolated Docker"
            },
            {
              icon: CircleCheck,
              color: "text-success",
              title: "Commit pushed",
              sub: "AI-authored message, attached to PR"
            }
          ].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background border border-border ${step.color}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(step.icon, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: step.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] text-muted-foreground", children: step.sub })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                "0",
                i + 1
              ] })
            ] }),
            i < 4 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3 w-3 text-muted-foreground/50" }) })
          ] }, i)) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "features",
        className: "relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-primary uppercase tracking-wider", children: "Features" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-semibold tracking-tight md:text-4xl", children: "Engineered for trust." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [
            {
              icon: Github,
              title: "GitHub native",
              desc: "OAuth, webhooks, PR automation. Drop in, no config."
            },
            {
              icon: Sparkles,
              title: "Minimal patches",
              desc: "AI generates the smallest possible diff. Your style preserved."
            },
            {
              icon: ShieldCheck,
              title: "Sandbox validation",
              desc: "Every patch tested in isolated Docker before commit."
            },
            {
              icon: Zap,
              title: "Sub-minute heals",
              desc: "Median time-to-green: 47 seconds across MVP stack."
            },
            {
              icon: Terminal,
              title: "Full traceability",
              desc: "Every fix logged with reasoning, diff, and test output."
            },
            {
              icon: Activity,
              title: "Health metrics",
              desc: "Repo-level dashboards for pass rate, MTTR, savings."
            }
          ].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "group rounded-lg border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:bg-surface-elevated",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-4 w-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-sm font-medium", children: f.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground leading-relaxed", children: f.desc })
              ]
            },
            f.title
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "demo",
        className: "relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-border",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border bg-surface p-10 text-center md:p-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-grid opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold tracking-tight md:text-4xl", children: "Stop debugging CI. Start shipping." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-xl text-muted-foreground", children: "Install the GitHub app and let AutoFix.sh handle every red build automatically." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center justify-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/dashboard",
                  className: "inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 glow-primary",
                  children: [
                    "Open dashboard ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://github.com",
                  className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm hover:bg-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-4 w-4" }),
                    " Install GitHub App"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative z-10 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono", children: "© 2026 autofix.sh — built for the broken build." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground", children: "privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground", children: "status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground", children: "changelog" })
      ] })
    ] }) })
  ] });
}
const SplitComponent = LandingPage;
export {
  SplitComponent as component
};
