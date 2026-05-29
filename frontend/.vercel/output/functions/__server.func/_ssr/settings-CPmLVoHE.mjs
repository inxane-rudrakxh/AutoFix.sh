import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./status-pill-BQJAPBL0.mjs";
import { u as useSettings, c as useUpdateSettings } from "./router-OYXG_VES.mjs";
import { i as Github, f as Container, K as Key, B as Bell, E as ExternalLink } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function Card({
  icon: Icon,
  title,
  desc,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-surface p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children })
    ] })
  ] }) });
}
function Row({
  label,
  value,
  action,
  href,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm", children: value })
    ] }),
    href ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1 text-xs hover:bg-accent text-primary", children: [
      action,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: "rounded-md border border-border bg-surface px-3 py-1 text-xs hover:bg-accent", children: action })
  ] });
}
function Toggle({
  label,
  on
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 cursor-pointer", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${on ? "left-[18px]" : "left-0.5"}` }) })
  ] });
}
function SettingsPage() {
  const {
    data: settings
  } = useSettings();
  const updateSettings = useUpdateSettings();
  const githubAppName = settings?.github_app_name || "autofix-sh";
  const isInstalled = !!settings?.github_org;
  const handleUpdate = (field, promptText, currentVal) => {
    const val = window.prompt(promptText, currentVal || "");
    if (val !== null) {
      const payload = {};
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Settings", subtitle: "Workspace, integrations, and agent behavior." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 px-6 py-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { icon: Github, title: "GitHub integration", desc: "OAuth + webhook configuration for autofix-agent.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Organization (Installation ID)", value: settings?.github_org ? `Org connected (ID: ${settings?.github_org})` : "Not connected", action: isInstalled ? "Manage" : "Connect", href: `https://github.com/apps/${githubAppName}/installations/new` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Installation ID Override", value: String(settings?.github_installation_id || "—"), action: "Configure", onClick: () => handleUpdate("github_installation_id", "Enter GitHub Installation ID:", String(settings?.github_installation_id || "")) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "App ID", value: settings?.github_app_name || "—", action: "Configure", onClick: () => handleUpdate("github_app_id", "Enter GitHub App ID:", settings?.github_app_name || "") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { icon: Container, title: "Sandbox runtime", desc: "Docker image used to validate generated patches.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Base image", value: settings?.sandbox_image || "node:20-alpine", action: "Change", onClick: () => handleUpdate("sandbox_image", "Enter Docker Sandbox Image:", settings?.sandbox_image || "") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Timeout", value: `${settings?.sandbox_timeout || 180}s`, action: "Edit", onClick: () => handleUpdate("sandbox_timeout_seconds", "Enter Timeout in seconds:", String(settings?.sandbox_timeout || "")) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { icon: Key, title: "Secrets", desc: "Stored encrypted at rest, scoped per repository.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "OPENAI_API_KEY", value: settings?.has_openai_key ? "sk-***** ****abc1" : "Not configured", action: settings?.has_openai_key ? "Rotate" : "Add", onClick: () => handleUpdate("openai_api_key", "Enter OpenAI API Key:") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "WEBHOOK_SECRET", value: settings?.has_webhook_secret ? "whsec_*****" : "Not configured", action: settings?.has_webhook_secret ? "Rotate" : "Add", onClick: () => handleUpdate("github_webhook_secret", "Enter GitHub Webhook Secret:") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { icon: Bell, title: "Notifications", desc: "Agent will broadcast healing events to these channels.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Slack · #ci-incidents", on: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Email digest (daily)", on: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Open commit comment on PR", on: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Auto-merge healed PRs" })
      ] }) })
    ] })
  ] });
}
export {
  SettingsPage as component
};
