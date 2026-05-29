import { Terminal as TerminalIcon } from "lucide-react";
import type { LogLine, LogLevel } from "@/types";

function logColor(lvl: LogLevel): string {
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

interface LogViewerProps {
  lines: LogLine[];
  title?: string;
  subtitle?: string;
  live?: boolean;
  className?: string;
}

export function LogViewer({
  lines,
  title = "Build logs",
  subtitle,
  live = false,
  className = "",
}: LogViewerProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-terminal ${className}`}>
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-success" />
          <span className="font-mono text-xs text-muted-foreground">{title}</span>
          {subtitle && (
            <span className="font-mono text-[10px] text-muted-foreground/60 hidden md:inline">
              · {subtitle}
            </span>
          )}
        </div>
        {live && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
            live
          </span>
        )}
      </div>

      <pre className="overflow-x-auto p-5 text-[12.5px] leading-6 font-mono">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3 hover:bg-surface/40 px-0">
            <span className="text-muted-foreground/60 select-none w-32 shrink-0">{l.t}</span>
            <span className="select-none w-16 shrink-0 text-muted-foreground/80">[{l.src}]</span>
            <span
              className={`select-none w-10 uppercase text-[10px] pt-[3px] shrink-0 ${logColor(l.lvl)}`}
            >
              {l.lvl}
            </span>
            <span className={`flex-1 ${logColor(l.lvl)}`}>{l.msg}</span>
          </div>
        ))}
        <div className="flex gap-3 text-success mt-1">
          <span className="caret" />
        </div>
      </pre>
    </div>
  );
}
