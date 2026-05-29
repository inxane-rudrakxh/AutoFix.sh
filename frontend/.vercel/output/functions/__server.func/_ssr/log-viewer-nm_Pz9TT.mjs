import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Terminal } from "../_libs/lucide-react.mjs";
function logColor(lvl) {
  switch (lvl) {
    case "err":
      return "text-destructive";
    case "ai":
      return "text-primary";
    case "ok":
      return "text-success";
    case "warn":
      return "text-warning";
    default:
      return "text-foreground/80";
  }
}
function LogViewer({
  lines,
  title = "Build logs",
  subtitle,
  live = false,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `overflow-hidden rounded-lg border border-border bg-terminal ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border bg-surface px-4 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-3.5 w-3.5 text-success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground/60 hidden md:inline", children: [
          "· ",
          subtitle
        ] })
      ] }),
      live && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-success pulse-dot" }),
        "live"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("pre", { className: "overflow-x-auto p-5 text-[12.5px] leading-6 font-mono", children: [
      lines.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 hover:bg-surface/40 px-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 select-none w-32 shrink-0", children: l.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "select-none w-16 shrink-0 text-muted-foreground/80", children: [
          "[",
          l.src,
          "]"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `select-none w-10 uppercase text-[10px] pt-[3px] shrink-0 ${logColor(l.lvl)}`,
            children: l.lvl
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-1 ${logColor(l.lvl)}`, children: l.msg })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 text-success mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caret" }) })
    ] })
  ] });
}
export {
  LogViewer as L
};
