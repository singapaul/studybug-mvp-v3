import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, BookOpen, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function Login() {
  const { login, isAuthenticated, session } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      const redirectPath = session.user.role === Role.TUTOR
        ? '/tutor/dashboard'
        : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, session, navigate]);

  const handleRoleSelection = (role: Role) => {
    login(role);
    const path = role === Role.TUTOR ? '/tutor/dashboard' : '/student/dashboard';
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">StudyBug</span>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome to StudyBug</h1>
            <p className="text-xl text-muted-foreground">
              Choose your role to get started
            </p>
            {import.meta.env.DEV && (
              <p className="text-sm text-amber-600 dark:text-amber-500 font-medium">
                Development Mode: Select your role to continue
              </p>
            )}
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tutor Card */}
            <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">I'm a Tutor</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Create engaging games, manage groups, and track student progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Create interactive learning games
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Organize students into groups
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Assign activities and set deadlines
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Monitor performance and progress
                  </li>
                </ul>
                <Button
                  onClick={() => handleRoleSelection(Role.TUTOR)}
                  className="w-full"
                  size="lg"
                >
                  Continue as Tutor
                </Button>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-secondary/50 group-hover:bg-secondary/70 transition-colors">
                    <User className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl">I'm a Student</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Join groups, play learning games, and track your achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Join groups with a code
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Play fun educational games
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Complete assignments and challenges
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    See your progress and scores
                  </li>
                </ul>
                <Button
                  onClick={() => handleRoleSelection(Role.STUDENT)}
                  className="w-full"
                  size="lg"
                  variant="secondary"
                >
                  Continue as Student
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-muted-foreground">
            Educational platform designed for interactive learning
          </p>
        </div>
      </div>
    </div>
  );
}
