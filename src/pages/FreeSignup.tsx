import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FreeSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="container max-w-lg text-center">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              {/* Success Animation */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center animate-bounce">
                <Check className="w-10 h-10 text-success" />
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                Your free account is ready! 🎉
              </h1>
              <p className="text-muted-foreground mb-8">
                Start exploring Studybug with our free features.
              </p>

              <div className="space-y-3">
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                  onClick={() => toast({ title: "Demo Mode", description: "App dashboard coming soon!" })}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Exploring
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                >
                  View Upgrade Options
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Free Forever
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Create your free account
              </h1>
              <p className="text-muted-foreground">
                Get started with 3 game modes and 10 subjects
              </p>
            </div>

            {/* Demo Notice */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20 mb-6">
              <AlertCircle className="w-5 h-5 text-accent-foreground flex-shrink-0" />
              <p className="text-sm text-accent-foreground">
                Demo mode - validation disabled
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="First"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
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

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Free Account'}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Want more features?{' '}
              <a href="/pricing" className="text-primary font-medium hover:underline">
                View paid plans
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
