import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, BookOpen, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

type AuthMode = 'role-select' | 'signin' | 'signup';
type SignUpStep = 'role-select' | 'form';

// Feature flag to use mock users instead of real authentication
const MOCK_USER_MODE = import.meta.env.VITE_MOCK_USER_MODE === 'true';

export default function Login() {
  const { login, isAuthenticated, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('role-select');
  const [signUpStep, setSignUpStep] = useState<SignUpStep>('role-select');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      const redirectPath = session.user.role === Role.TUTOR
        ? '/tutor/dashboard'
        : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, session, navigate]);

  // Mock mode: Handle role selection for quick login
  const handleMockRoleSelection = (role: Role) => {
    if (MOCK_USER_MODE) {
      login(role);
      const path = role === Role.TUTOR ? '/tutor/dashboard' : '/student/dashboard';
      navigate(path);
    }
  };

  // Handle role selection for sign up
  const handleSignUpRoleSelection = (role: Role) => {
    setSelectedRole(role);
    setSignUpStep('form');
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    // Navigation will be handled by the useEffect above
  };

  // Toggle between sign in and sign up
  const toggleAuthMode = () => {
    if (authMode === 'signin') {
      setAuthMode('signup');
      setSignUpStep('role-select');
      setSelectedRole(null);
    } else {
      setAuthMode('signin');
    }
  };

  // Show loading state
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

  // Render role selection cards
  const renderRoleSelection = (isSignUp: boolean = false) => (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {isSignUp ? 'Choose your role' : 'Welcome to StudyBug'}
        </h1>
        <p className="text-xl text-muted-foreground">
          {isSignUp ? 'Select how you want to use StudyBug' : 'Choose your role to get started'}
        </p>
        {MOCK_USER_MODE && !isSignUp && (
          <p className="text-sm text-amber-600 dark:text-amber-500 font-medium">
            Mock User Mode: Select your role to continue (no authentication required)
          </p>
        )}
      </div>

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
              onClick={() => isSignUp ? handleSignUpRoleSelection(Role.TUTOR) : handleMockRoleSelection(Role.TUTOR)}
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
              onClick={() => isSignUp ? handleSignUpRoleSelection(Role.STUDENT) : handleMockRoleSelection(Role.STUDENT)}
              className="w-full"
              size="lg"
              variant="secondary"
            >
              Continue as Student
            </Button>
          </CardContent>
        </Card>
      </div>

      {isSignUp && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => {
              setAuthMode('role-select');
              setSignUpStep('role-select');
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      )}
    </>
  );

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
          {/* Mock User Mode: Show role selection directly */}
          {MOCK_USER_MODE && authMode === 'role-select' && renderRoleSelection(false)}

          {/* Real Auth Mode: Initial choice between sign in and sign up */}
          {!MOCK_USER_MODE && authMode === 'role-select' && (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome to StudyBug</h1>
                <p className="text-xl text-muted-foreground">
                  Get started with your account
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <Button
                      onClick={() => setAuthMode('signin')}
                      className="w-full"
                      size="lg"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => setAuthMode('signup')}
                      className="w-full"
                      size="lg"
                      variant="outline"
                    >
                      Create Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Sign In Form */}
          {authMode === 'signin' && (
            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <SignInForm
                    onSuccess={handleAuthSuccess}
                    onToggleMode={toggleAuthMode}
                  />
                </CardContent>
              </Card>
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setAuthMode('role-select')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Sign Up Flow */}
          {authMode === 'signup' && signUpStep === 'role-select' && renderRoleSelection(true)}

          {authMode === 'signup' && signUpStep === 'form' && selectedRole && (
            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <SignUpForm
                    role={selectedRole}
                    onSuccess={handleAuthSuccess}
                    onToggleMode={toggleAuthMode}
                  />
                </CardContent>
              </Card>
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSignUpStep('role-select');
                    setSelectedRole(null);
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <p className="text-center text-sm text-muted-foreground">
            Educational platform designed for interactive learning
          </p>
        </div>
      </div>
    </div>
  );
}
