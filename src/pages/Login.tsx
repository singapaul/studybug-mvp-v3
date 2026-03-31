import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';

const MOCK_USER_MODE = import.meta.env.VITE_MOCK_USER_MODE === 'true';

export default function Login() {
  const { login, isAuthenticated, session, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      const redirectPath =
        session.user.role === Role.TUTOR ? '/tutor/dashboard' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, session, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
        <div className="max-w-md w-full space-y-4">
          <Card>
            <CardContent className="pt-6">
              <SignInForm onSuccess={() => {}} onToggleMode={() => navigate('/signup')} />
            </CardContent>
          </Card>

          {/* Mock mode dev tools */}
          {MOCK_USER_MODE && (
            <div className="p-4 border border-dashed rounded-lg text-center space-y-2">
              <p className="text-xs text-muted-foreground">Dev Tools</p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={() => login(Role.TUTOR)}>
                  Login as Tutor
                </Button>
                <Button size="sm" variant="outline" onClick={() => login(Role.STUDENT)}>
                  Login as Student
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Educational platform designed for interactive learning
          </p>
        </div>
      </div>
    </div>
  );
}
