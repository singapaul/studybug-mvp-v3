import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCog, GraduationCap, User } from 'lucide-react';

/**
 * Development-only component for switching between roles
 * Only renders in development mode
 */
export function RoleSwitcher() {
  const { session, switchRole, logout, isTutor, isStudent } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!session) {
    return null;
  }

  const currentRole = session.user.role;
  const roleLabel = currentRole === Role.TUTOR ? 'Tutor' : 'Student';
  const RoleIcon = currentRole === Role.TUTOR ? GraduationCap : User;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-2"
          >
            <UserCog className="h-4 w-4" />
            <span className="font-semibold">{roleLabel}</span>
            <Badge variant={isTutor ? 'default' : 'secondary'} className="ml-1">
              DEV
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Development Role Switcher</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => switchRole(Role.TUTOR)}
            disabled={isTutor}
            className="cursor-pointer"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Switch to Tutor</span>
            {isTutor && (
              <Badge variant="outline" className="ml-auto">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => switchRole(Role.STUDENT)}
            disabled={isStudent}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Switch to Student</span>
            {isStudent && (
              <Badge variant="outline" className="ml-auto">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
