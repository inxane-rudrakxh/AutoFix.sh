import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/status-pill";
import { Github, Key, Bell, Container, ExternalLink } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings · AutoFix.sh" }] }),
});

function Card({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: any;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
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

function Row({
  label,
  value,
  action,
  href,
  onClick,
}: {
  label: string;
  value: string;
  action: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-mono text-sm">{value}</div>
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1 text-xs hover:bg-accent text-primary"
        >
          {action} <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <button
          onClick={onClick}
          className="rounded-md border border-border bg-surface px-3 py-1 text-xs hover:bg-accent"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function Toggle({ label, on }: { label: string; on?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 cursor-pointer">
      <span className="text-sm">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${on ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </label>
  );
}

function SettingsPage() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  const githubAppName = settings?.github_app_name || "autofix-sh";
  const isInstalled = !!settings?.github_org;

  const handleUpdate = (field: string, promptText: string, currentVal?: string) => {
    const val = window.prompt(promptText, currentVal || "");
    if (val !== null) {
      const payload: any = {};
      if (field === "github_installation_id") {
        payload[field] = parseInt(val, 10) || 0;
      } else if (field === "sandbox_timeout_seconds") {
        payload[field] = parseInt(val, 10) || 180;
      } else {
        payload[field] = val;
      }
      updateSettings.mutate(payload);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Workspace, integrations, and agent behavior." />

      <div className="grid gap-4 px-6 py-6 lg:grid-cols-2">
        <Card
          icon={Github}
          title="GitHub integration"
          desc="OAuth + webhook configuration for autofix-agent."
        >
          <div className="space-y-2">
            <Row
              label="Organization (Installation ID)"
              value={settings?.github_org ? `Org connected (ID: ${settings?.github_org})` : "Not connected"}
              action={isInstalled ? "Manage" : "Connect"}
              href={`https://github.com/apps/${githubAppName}/installations/new`}
            />
            <Row
              label="Installation ID Override"
              value={String(settings?.github_installation_id || "—")}
              action="Configure"
              onClick={() => handleUpdate("github_installation_id", "Enter GitHub Installation ID:", String(settings?.github_installation_id || ""))}
            />
            <Row
              label="App ID"
              value={settings?.github_app_name || "—"}
              action="Configure"
              onClick={() => handleUpdate("github_app_id", "Enter GitHub App ID:", settings?.github_app_name || "")}
            />
          </div>
        </Card>

        <Card
          icon={Container}
          title="Sandbox runtime"
          desc="Docker image used to validate generated patches."
        >
          <div className="space-y-2">
            <Row
              label="Base image"
              value={settings?.sandbox_image || "node:20-alpine"}
              action="Change"
              onClick={() => handleUpdate("sandbox_image", "Enter Docker Sandbox Image:", settings?.sandbox_image || "")}
            />
            <Row
              label="Timeout"
              value={`${settings?.sandbox_timeout || 180}s`}
              action="Edit"
              onClick={() => handleUpdate("sandbox_timeout_seconds", "Enter Timeout in seconds:", String(settings?.sandbox_timeout || ""))}
            />
          </div>
        </Card>

        <Card icon={Key} title="Secrets" desc="Stored encrypted at rest, scoped per repository.">
          <div className="space-y-2">
            <Row
              label="OPENAI_API_KEY"
              value={settings?.has_openai_key ? "sk-***** ****abc1" : "Not configured"}
              action={settings?.has_openai_key ? "Rotate" : "Add"}
              onClick={() => handleUpdate("openai_api_key", "Enter OpenAI API Key:")}
            />
            <Row
              label="WEBHOOK_SECRET"
              value={settings?.has_webhook_secret ? "whsec_*****" : "Not configured"}
              action={settings?.has_webhook_secret ? "Rotate" : "Add"}
              onClick={() => handleUpdate("github_webhook_secret", "Enter GitHub Webhook Secret:")}
            />
          </div>
        </Card>

        <Card
          icon={Bell}
          title="Notifications"
          desc="Agent will broadcast healing events to these channels."
        >
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
