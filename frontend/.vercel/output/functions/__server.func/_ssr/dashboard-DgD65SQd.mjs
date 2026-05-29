import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageHeader, S as StatusPill } from "./status-pill-BQJAPBL0.mjs";
import { a as useDeployments } from "./useDeployments-NYJlDRam.mjs";
import { u as useFixes } from "./useFixes-C9Uj6pNV.mjs";
import { d as dashboardApi } from "./router-OYXG_VES.mjs";
import { A as Activity, G as GitBranch, o as Sparkles, q as TrendingUp, c as ArrowRight, h as GitPullRequest } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
function Sparkline({
  accent,
  points = [4, 8, 6, 10, 7, 12, 9, 14, 11, 16, 13, 18, 15, 20]
}) {
  const max = Math.max(...points);
  const path = points.map((p, i) => `${i / (points.length - 1) * 100},${30 - p / max * 28}`).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 100 30", preserveAspectRatio: "none", className: "h-full w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "polyline",
    {
      points: path,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      className: accent
    }
  ) });
}
const metricDefs = [{
  label: "Deployment health",
  key: "pass_rate",
  suffix: "%",
  delta: "+1.2%",
  icon: Activity,
  accent: "text-success"
}, {
  label: "Active repositories",
  key: "active_deployments",
  suffix: "",
  delta: "+3",
  icon: GitBranch,
  accent: "text-foreground"
}, {
  label: "AI fixes (24h)",
  key: "total_fixes",
  suffix: "",
  delta: "+12",
  icon: Sparkles,
  accent: "text-primary"
}, {
  label: "Mean time to heal",
  key: "mean_time_to_heal",
  suffix: "s",
  delta: "-8s",
  icon: TrendingUp,
  accent: "text-success"
}];
function DashboardPage() {
  const {
    data: deployments = []
  } = useDeployments();
  const {
    data: fixes = []
  } = useFixes();
  const {
    data: metrics
  } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => await dashboardApi.metrics(),
    refetchInterval: 5e3
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Dashboard", subtitle: "Self-healing deployment activity across your workspace.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/deployments", className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent", children: "All deployments" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4", children: metricDefs.map((m) => {
      const raw = metrics?.[m.key] ?? "—";
      const value = m.key === "pass_rate" ? `${raw}%` : m.key === "mean_time_to_heal" ? String(raw) : String(raw);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: m.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: `h-4 w-4 ${m.accent}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-3xl font-semibold tracking-tight", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-success", children: m.delta })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { accent: m.accent }) })
      ] }, m.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 px-6 pb-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-lg border border-border bg-surface overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-medium", children: "Recent deployments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Last 24 hours" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/deployments", className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
            "View all ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: deployments.slice(0, 6).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/deployments/$id", params: {
          id: r.id
        }, className: "flex items-center gap-4 px-5 py-3 hover:bg-surface-elevated transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono truncate", children: [
                r.org,
                "/",
                r.repo
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: r.branch })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: r.commitMessage })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block font-mono text-[11px] text-muted-foreground", children: r.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] text-muted-foreground w-16 text-right", children: r.time })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-surface overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-medium flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
            "Recent AI fixes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Patches committed automatically" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: fixes.slice(0, 4).map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/fixes", className: "block px-5 py-3 hover:bg-surface-elevated transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GitPullRequest, { className: "h-3.5 w-3.5 text-success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: f.pr }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-success", children: [
                "+",
                f.lines.add
              ] }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive", children: [
                "-",
                f.lines.del
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate font-mono text-[11px] text-muted-foreground", children: f.file })
        ] }, i)) })
      ] })
    ] })
  ] });
}
export {
  DashboardPage as component
};
