import type { DiffLine } from "@/types";

interface DiffViewerProps {
  diff: DiffLine[];
  filename?: string;
  commitMessage?: string;
  className?: string;
}

export function DiffViewer({ diff, filename, commitMessage, className = "" }: DiffViewerProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-surface ${className}`}>
      {filename && (
        <div className="border-b border-border bg-surface px-5 py-2.5 font-mono text-[11px] text-muted-foreground">
          {filename}
        </div>
      )}
      <pre className="overflow-x-auto bg-terminal p-0 text-[13px] leading-6 font-mono">
        {diff.map((l, i) => {
          const cls =
            l.type === "add"
              ? "bg-success/10 text-success border-l-2 border-success"
              : l.type === "del"
                ? "bg-destructive/10 text-destructive border-l-2 border-destructive"
                : "text-muted-foreground border-l-2 border-transparent";
          const sign = l.type === "add" ? "+" : l.type === "del" ? "−" : " ";
          return (
            <div key={i} className={`flex ${cls}`}>
              <span className="select-none px-3 py-0 text-right w-10 text-muted-foreground/60 border-r border-border tabular-nums">
                {i + 1}
              </span>
              <span className="px-2 select-none">{sign}</span>
              <span className="pr-4 whitespace-pre">{l.text}</span>
            </div>
          );
        })}
      </pre>
      {commitMessage && (
        <div className="flex items-center justify-between border-t border-border bg-surface-elevated px-5 py-2.5 text-xs">
          <span className="font-mono text-muted-foreground">Commit message</span>
          <span className="font-mono truncate max-w-[60%] text-right">{commitMessage}</span>
        </div>
      )}
    </div>
  );
}
