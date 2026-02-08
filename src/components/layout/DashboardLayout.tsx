import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Role } from '@/types/auth';
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Gamepad2,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTutor = session?.user.role === Role.TUTOR;
  const RoleIcon = isTutor ? Layers : User;
  const roleName = isTutor ? 'Tutor' : 'Student';
  const roleColor = isTutor ? 'text-purple-600' : 'text-blue-600';

  // Navigation links
  const tutorLinks = [
    { name: 'Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
    { name: 'Groups', path: '/tutor/groups', icon: Users },
    { name: 'Games', path: '/tutor/games', icon: Gamepad2 },
    { name: 'Settings', path: '/tutor/settings', icon: Settings },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Scores', path: '/student/scores', icon: BarChart3 },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const navLinks = isTutor ? tutorLinks : studentLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ link, onClick }: { link: (typeof navLinks)[0]; onClick?: () => void }) => {
    const Icon = link.icon;
    return (
      <button
        onClick={() => {
          navigate(link.path);
          onClick?.();
        }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium',
          isActive(link.path)
            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        <Icon className="h-4 w-4" />
        {link.name}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and App Name */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(isTutor ? '/tutor/dashboard' : '/student/dashboard')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl hidden sm:inline">StudyBug</span>
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                  <NavLink key={link.path} link={link} />
                ))}
              </nav>
            </div>

            {/* Right Side: Role Indicator & User Menu */}
            <div className="flex items-center gap-4">
              {/* Role Indicator */}
              <div
                className={cn(
                  'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted',
                  roleColor
                )}
              >
                {RoleIcon && <RoleIcon className="h-4 w-4" />}
                <span className="text-sm font-medium">{roleName}</span>
              </div>

              {/* User Menu Dropdown - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button variant="ghost" className="gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {session?.user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-sm">
                      {session?.user.email.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session?.user.email.split('@')[0]}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col gap-6 mt-6">
                    {/* User Info */}
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {session?.user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{session?.user.email.split('@')[0]}</p>
                        <p className="text-xs text-muted-foreground">{roleName}</p>
                      </div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <NavLink
                          key={link.path}
                          link={link}
                          onClick={() => setMobileMenuOpen(false)}
                        />
                      ))}
                    </nav>

                    <div className="border-t pt-4 space-y-2">
                      <Button variant="ghost" className="w-full justify-start" disabled>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
