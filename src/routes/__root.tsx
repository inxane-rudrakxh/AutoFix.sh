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

import appCss from "../styles.css?url";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, GitBranch } from "lucide-react";

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
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AutoFix.sh — AI-powered self-healing deployment agent" },
      { name: "description", content: "AutoFix.sh detects failed GitHub Actions, generates AI fixes, validates them in sandboxes, and commits patches automatically." },
      { property: "og:title", content: "AutoFix.sh" },
      { property: "og:description", content: "AI-powered self-healing deployment agent." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" },
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
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      {isLanding ? (
        <Outlet />
      ) : (
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
                  <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-mono text-success border border-success/30">main</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground w-64">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search deployments…</span>
                    <kbd className="ml-auto font-mono text-[10px] text-muted-foreground/70">⌘K</kbd>
                  </div>
                  <button className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-surface">
                    <Bell className="h-4 w-4" />
                  </button>
                </div>
              </header>
              <main className="flex-1 min-w-0"><Outlet /></main>
            </div>
          </div>
        </SidebarProvider>
      )}
    </QueryClientProvider>
  );
}
