import { Link, useLocation } from 'react-router-dom';
import { Bug, LayoutDashboard, Users, Gamepad2, ClipboardList, CreditCard, Settings, LogOut, Trophy, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tutorNavItems = [
  { title: 'Dashboard', url: '/app/tutor/dashboard', icon: LayoutDashboard },
  { title: 'Classes', url: '/app/tutor/classes', icon: Users },
  { title: 'Games', url: '/app/tutor/games', icon: Gamepad2 },
  { title: 'Assignments', url: '/app/tutor/assignments', icon: ClipboardList },
  { title: 'Billing', url: '/app/tutor/billing', icon: CreditCard },
  { title: 'Settings', url: '/app/tutor/settings', icon: Settings },
];

const studentNavItems = [
  { title: 'Dashboard', url: '/app/student/dashboard', icon: LayoutDashboard },
  { title: 'Assignments', url: '/app/student/assignments', icon: ClipboardList },
  { title: 'My Scores', url: '/app/student/scores', icon: Trophy },
  { title: 'Settings', url: '/app/student/settings', icon: Settings },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const navItems = user?.role === 'tutor' ? tutorNavItems : studentNavItems;

  const isActive = (url: string) => {
    if (url.endsWith('/dashboard')) {
      return location.pathname === url;
    }
    return location.pathname.startsWith(url);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-white">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary shadow-md flex-shrink-0">
            <Bug className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-foreground">
              Study<span className="text-secondary">bug</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* User Profile */}
      <div className={cn("px-4 py-3 border-b border-border", collapsed && "px-2")}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                {user?.role === 'tutor' ? (
                  <>
                    <GraduationCap className="w-3 h-3 text-secondary" />
                    <span className="text-xs text-muted-foreground">Tutor</span>
                  </>
                ) : (
                  <>
                    <Bug className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Student</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      isActive(item.url) 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Log Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
