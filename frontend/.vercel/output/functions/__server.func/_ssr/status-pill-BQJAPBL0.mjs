import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as Clock, j as LoaderCircle, d as CircleX, C as CircleCheck } from "../_libs/lucide-react.mjs";
function StatusPill({ status, label }) {
  const map = {
    success: {
      icon: CircleCheck,
      cls: "bg-success/10 text-success border-success/30",
      text: "success"
    },
    healed: {
      icon: CircleCheck,
      cls: "bg-success/10 text-success border-success/30",
      text: "healed"
    },
    failed: {
      icon: CircleX,
      cls: "bg-destructive/10 text-destructive border-destructive/30",
      text: "failed"
    },
    running: {
      icon: LoaderCircle,
      cls: "bg-primary/10 text-primary border-primary/30",
      text: "running"
    },
    queued: { icon: Clock, cls: "bg-muted text-muted-foreground border-border", text: "queued" }
  };
  const m = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${m.cls}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: `h-3 w-3 ${status === "running" ? "animate-spin" : ""}` }),
        label ?? m.text
      ]
    }
  );
}
function PageHeader({
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 border-b border-border px-6 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: subtitle })
    ] }),
    children && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children })
  ] });
}
export {
  PageHeader as P,
  StatusPill as S
};
