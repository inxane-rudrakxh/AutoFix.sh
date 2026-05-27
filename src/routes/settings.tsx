import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/status-pill";
import { Github, Key, Bell, Container } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings · AutoFix.sh" }] }),
});

function Card({ icon: Icon, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, action }: { label: string; value: string; action: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-mono text-sm">{value}</div>
      </div>
      <button className="rounded-md border border-border bg-surface px-3 py-1 text-xs hover:bg-accent">{action}</button>
    </div>
  );
}

function Toggle({ label, on }: { label: string; on?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 cursor-pointer">
      <span className="text-sm">{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </label>
  );
}

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Workspace, integrations, and agent behavior." />

      <div className="grid gap-4 px-6 py-6 lg:grid-cols-2">
        <Card icon={Github} title="GitHub integration" desc="OAuth + webhook configuration for autofix-agent.">
          <div className="space-y-2">
            <Row label="Organization" value="acme-corp" action="Switch" />
            <Row label="Installation" value="github.com/apps/autofix-sh" action="Manage" />
          </div>
        </Card>

        <Card icon={Container} title="Sandbox runtime" desc="Docker image used to validate generated patches.">
          <div className="space-y-2">
            <Row label="Base image" value="node:20-alpine" action="Change" />
            <Row label="Test command" value="npm test" action="Edit" />
            <Row label="Timeout" value="180s" action="Edit" />
          </div>
        </Card>

        <Card icon={Key} title="Secrets" desc="Stored encrypted at rest, scoped per repository.">
          <div className="space-y-2">
            <Row label="OPENAI_API_KEY" value="sk-***** ****abc1" action="Rotate" />
            <Row label="WEBHOOK_SECRET" value="whsec_*****" action="Rotate" />
          </div>
        </Card>

        <Card icon={Bell} title="Notifications" desc="Agent will broadcast healing events to these channels.">
          <div className="space-y-2">
            <Toggle label="Slack · #ci-incidents" on />
            <Toggle label="Email digest (daily)" on />
            <Toggle label="Open commit comment on PR" on />
            <Toggle label="Auto-merge healed PRs" />
          </div>
        </Card>
      </div>
    </div>
  );
}
