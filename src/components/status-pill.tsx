import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

export type Status = "success" | "failed" | "running" | "queued" | "healed";

export function StatusPill({ status, label }: { status: Status; label?: string }) {
  const map = {
    success: {
      icon: CheckCircle2,
      cls: "bg-success/10 text-success border-success/30",
      text: "success",
    },
    healed: {
      icon: CheckCircle2,
      cls: "bg-success/10 text-success border-success/30",
      text: "healed",
    },
    failed: {
      icon: XCircle,
      cls: "bg-destructive/10 text-destructive border-destructive/30",
      text: "failed",
    },
    running: {
      icon: Loader2,
      cls: "bg-primary/10 text-primary border-primary/30",
      text: "running",
    },
    queued: { icon: Clock, cls: "bg-muted text-muted-foreground border-border", text: "queued" },
  } as const;
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${m.cls}`}
    >
      <m.icon className={`h-3 w-3 ${status === "running" ? "animate-spin" : ""}`} />
      {label ?? m.text}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
