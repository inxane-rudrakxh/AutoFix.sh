import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function DiffViewer({ diff, filename, commitMessage, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `overflow-hidden rounded-lg border border-border bg-surface ${className}`, children: [
    filename && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-surface px-5 py-2.5 font-mono text-[11px] text-muted-foreground", children: filename }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto bg-terminal p-0 text-[13px] leading-6 font-mono", children: diff.map((l, i) => {
      const cls = l.type === "add" ? "bg-success/10 text-success border-l-2 border-success" : l.type === "del" ? "bg-destructive/10 text-destructive border-l-2 border-destructive" : "text-muted-foreground border-l-2 border-transparent";
      const sign = l.type === "add" ? "+" : l.type === "del" ? "−" : " ";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex ${cls}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "select-none px-3 py-0 text-right w-10 text-muted-foreground/60 border-r border-border tabular-nums", children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 select-none", children: sign }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pr-4 whitespace-pre", children: l.text })
      ] }, i);
    }) }),
    commitMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border bg-surface-elevated px-5 py-2.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground", children: "Commit message" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono truncate max-w-[60%] text-right", children: commitMessage })
    ] })
  ] });
}
export {
  DiffViewer as D
};
