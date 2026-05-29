import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GitBranch,
  Rocket,
  Terminal,
  Sparkles,
  Settings,
  Activity,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Repositories", url: "/repositories", icon: GitBranch },
  { title: "Deployments", url: "/deployments", icon: Rocket },
  { title: "Logs", url: "/logs", icon: Terminal },
  { title: "AI Fixes", url: "/fixes", icon: Sparkles },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border h-14 justify-center">
        <Link to="/" className="flex items-center gap-2 px-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
            <Activity className="h-4 w-4 text-primary" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success pulse-dot" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-mono text-sm font-semibold tracking-tight">
                autofix<span className="text-success">.sh</span>
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">v0.4.2-beta</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-wider">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="group flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
              <span className="text-muted-foreground">Sandbox</span>
              <span className="ml-auto text-success">healthy</span>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground font-mono">
              12 fixes / 24h · 98% pass
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-success pulse-dot" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
