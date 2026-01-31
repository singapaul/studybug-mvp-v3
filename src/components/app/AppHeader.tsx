import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-white px-6">
      <SidebarTrigger className="-ml-2" />
      
      <div className="flex-1" />
      
      {/* Demo Mode Badge */}
      <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-700">
        Demo Mode
      </Badge>
      
      {/* Notifications placeholder */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </Button>
      
      {/* User avatar */}
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-xs font-semibold text-primary">
          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
        </span>
      </div>
    </header>
  );
}
