import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  Link,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState } from "react";

import appCss from "../styles.css?url";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, GitBranch, LogOut, ExternalLink, Loader2, Activity } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AutoFix.sh — AI-powered self-healing deployment agent" },
      {
        name: "description",
        content:
          "AutoFix.sh detects failed GitHub Actions, generates AI fixes, validates them in sandboxes, and commits patches automatically.",
      },
      { property: "og:title", content: "AutoFix.sh — AI-powered self-healing deployment agent" },
      {
        property: "og:description",
        content:
          "AutoFix.sh detects failed GitHub Actions, generates AI fixes, validates them in sandboxes, and commits patches automatically.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "AutoFix.sh — AI-powered self-healing deployment agent" },
      {
        name: "twitter:description",
        content:
          "AutoFix.sh detects failed GitHub Actions, generates AI fixes, validates them in sandboxes, and commits patches automatically.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs text-success">$ status --code 404</p>
        <h1 className="mt-3 text-6xl font-semibold tracking-tight">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This route is not registered in the deployment graph.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs text-destructive">$ build --failed</p>
        <h1 className="mt-3 text-2xl font-semibold">Something broke the pipeline</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("autofix_authenticated", "true");
    onLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid p-4">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-2xl relative">
        <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-lg pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
              <Activity className="h-4 w-4 text-primary" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success pulse-dot" />
            </div>
            <span className="font-mono text-sm font-semibold">
              autofix<span className="text-success">.sh</span>
            </span>
          </div>

          <h2 className="text-xl font-medium text-center">Sign in to console</h2>
          <p className="mt-1 text-xs text-muted-foreground text-center">
            Access your self-healing deployment logs and metrics.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@autofix.sh"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors mt-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <button
              onClick={() => {
                localStorage.setItem("autofix_authenticated", "true");
                onLogin();
              }}
              className="inline-flex items-center justify-center gap-2 w-full rounded-md border border-border bg-background py-2 text-sm hover:bg-accent transition-colors"
            >
              <span className="font-medium">Demo Access (Bypass)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingView() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  
  const [appId, setAppId] = useState("");
  const [installId, setInstallId] = useState("");
  
  const githubAppName = settings?.github_app_name || "autofix-sh";

  const handleSaveAppId = () => {
    if (appId.trim()) {
      updateSettings.mutate({ github_app_id: appId.trim() });
    }
  };

  const handleSaveInstallId = () => {
    if (installId.trim()) {
      updateSettings.mutate({ github_installation_id: parseInt(installId.trim(), 10) || 0 });
    }
  };

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          🚀 Welcome to AutoFix.sh Onboarding
        </h1>
        <p className="text-sm text-muted-foreground">
          Let's connect your GitHub workspace so the self-healing agent can parse failed logs and open PRs.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Step 1 */}
        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-mono font-bold text-primary">
              1
            </span>
            <h2 className="text-sm font-medium">Configure GitHub App ID</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your GitHub App ID to identify this integration client.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder={settings?.github_app_name || "App ID (e.g. 1047248)"}
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSaveAppId}
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-mono font-bold text-primary">
              2
            </span>
            <h2 className="text-sm font-medium">Install App on GitHub Organization</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Install the app onto your target GitHub organization to authorize access to repositories.
          </p>
          <div>
            <a
              href={`https://github.com/apps/${githubAppName}/installations/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-accent text-primary"
            >
              Install App on GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-mono font-bold text-primary">
              3
            </span>
            <h2 className="text-sm font-medium">Verify Installation ID</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            After installing, GitHub redirects you or sends an installation webhook. Paste the Installation ID below to activate connection.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={installId}
              onChange={(e) => setInstallId(e.target.value)}
              placeholder="Installation ID (e.g. 5837284)"
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSaveInstallId}
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Verify & Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("autofix_authenticated") === "true";
    }
    return false;
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("autofix_authenticated");
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {isLanding ? (
        <Outlet />
      ) : !isAuthenticated ? (
        <LoginView onLogin={handleLogin} />
      ) : (
        <InnerComponent handleLogout={handleLogout} pathname={pathname} />
      )}
    </QueryClientProvider>
  );
}

function InnerComponent({ handleLogout, pathname }: { handleLogout: () => void; pathname: string }) {
  const { data: settings, isLoading } = useSettings();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isSettingsRoute = pathname === "/settings";
  const hasInstallation = !!settings?.github_installation_id;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2 text-sm">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-muted-foreground">acme-corp</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-mono">api-gateway</span>
              <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-mono text-success border border-success/30">
                main
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground w-64">
                <Search className="h-3.5 w-3.5" />
                <span>Search deployments…</span>
                <kbd className="ml-auto font-mono text-[10px] text-muted-foreground/70">⌘K</kbd>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>
          <main className="flex-1 min-w-0">
            {!hasInstallation && !isSettingsRoute ? <OnboardingView /> : <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
