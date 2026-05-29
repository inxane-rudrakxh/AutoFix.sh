import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageHeader, S as StatusPill } from "./status-pill-BQJAPBL0.mjs";
import { D as DiffViewer } from "./diff-viewer-DiWwhVom.mjs";
import { L as LogViewer } from "./log-viewer-nm_Pz9TT.mjs";
import { u as useDeployment } from "./useDeployments-NYJlDRam.mjs";
import { R as Route } from "./router-OYXG_VES.mjs";
import { b as ArrowLeft, j as LoaderCircle, o as Sparkles, C as CircleCheck, n as ShieldCheck, d as CircleX, g as GitCommitHorizontal } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
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
const iconMap = {
  GitCommit: GitCommitHorizontal,
  XCircle: CircleX,
  Sparkles,
  ShieldCheck,
  CheckCircle2: CircleCheck,
  Loader2: LoaderCircle
};
function TimelineIcon({
  step
}) {
  const color = step.state === "error" ? "text-destructive bg-destructive/10 border-destructive/40" : step.state === "success" ? "text-success bg-success/10 border-success/40" : step.state === "running" ? "text-primary bg-primary/10 border-primary/30 animate-pulse" : "text-primary bg-primary/10 border-primary/30";
  const Icon = iconMap[step.iconKey];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-2.5 w-2.5 ${step.state === "running" ? "animate-spin" : ""}` }) });
}
function DeploymentDetailPage() {
  const {
    id
  } = Route.useParams();
  const {
    data: deployment,
    isLoading
  } = useDeployment(id);
  if (isLoading || !deployment) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `Deployment ${id}`, subtitle: "Loading…", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/deployments", className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " All deployments"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) })
    ] });
  }
  const fix = deployment.fix;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `Deployment ${id}`, subtitle: `${deployment.org}/${deployment.repo} · ${deployment.branch} · ${deployment.status === "healed" ? "healed by autofix-agent" : deployment.status}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/deployments", className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:bg-accent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
      " All deployments"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 px-6 py-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-medium", children: "Workflow timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Run #",
          deployment.runId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative mt-5 space-y-4 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border", children: deployment.timeline.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineIcon, { step: s }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-muted-foreground", children: s.t })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Tests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-mono text-success", children: fix ? `${fix.testsPassed} passed` : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Patch size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-mono", children: fix ? `+${fix.lines.add} −${fix.lines.del}` : "—" })
          ] })
        ] })
      ] }),
      fix ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 overflow-hidden rounded-lg border border-border bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-medium flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
              " AI diff viewer"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground", children: fix.file })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: "healed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DiffViewer, { diff: fix.diff, commitMessage: fix.commitMessage })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 flex items-center justify-center rounded-lg border border-border bg-surface text-sm text-muted-foreground", children: "No patch generated" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogViewer, { lines: deployment.logs, title: `autofix-agent · ${deployment.org}/${deployment.repo} · run #${deployment.runId}`, live: deployment.status === "running" }) })
    ] })
  ] });
}
export {
  DeploymentDetailPage as component
};
