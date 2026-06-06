import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ListTodo, CheckSquare, BarChart3, User, Zap, Target, Trophy } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: ListTodo },
  { title: "Mapping", url: "/mapping", icon: CheckSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Missions", url: "/missions", icon: Target },
  { title: "Achievements", url: "/achievements", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="size-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap className="size-4 text-primary" />
          </div>
          <span className="font-display font-semibold text-sidebar-foreground">CT</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
