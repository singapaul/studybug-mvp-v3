import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      // Check the email to determine redirect
      if (email.toLowerCase() === 'demo@studybug.io') {
        navigate('/app/tutor/dashboard');
      } else if (email.toLowerCase() === 'student@studybug.io') {
        navigate('/app/student/dashboard');
      } else {
        // For signup accounts, check stored role
        const stored = localStorage.getItem('studybug_user');
        if (stored) {
          const user = JSON.parse(stored);
          navigate(user.role === 'tutor' ? '/app/tutor/dashboard' : '/app/student/dashboard');
        }
      }
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = (type: 'tutor' | 'student') => {
    if (type === 'tutor') {
      setEmail('demo@studybug.io');
      setPassword('demo123');
    } else {
      setEmail('student@studybug.io');
      setPassword('demo123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your Studybug account
              </p>
            </div>

            {/* Demo Credentials Card */}
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Demo Credentials</p>
                  <p className="text-xs text-muted-foreground">Click to auto-fill</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('tutor')}
                  className="text-left px-3 py-2 rounded-lg bg-white border border-border hover:border-secondary transition-colors"
                >
                  <p className="text-xs font-medium text-secondary">Tutor</p>
                  <p className="text-xs text-muted-foreground">demo@studybug.io</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('student')}
                  className="text-left px-3 py-2 rounded-lg bg-white border border-border hover:border-primary transition-colors"
                >
                  <p className="text-xs font-medium text-primary">Student</p>
                  <p className="text-xs text-muted-foreground">student@studybug.io</p>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Log In'}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
