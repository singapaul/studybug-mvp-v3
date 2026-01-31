import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Bug, GraduationCap, ArrowRight, ArrowLeft, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/app';

type Step = 'role' | 'account' | 'complete';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  const { toast } = useToast();
  
  const initialRole = searchParams.get('role') as UserRole | null;
  
  const [step, setStep] = useState<Step>(initialRole ? 'account' : 'role');
  const [role, setRole] = useState<UserRole | null>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Billing preference for tutors
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('account');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.terms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !role) return;
    
    setIsLoading(true);
    
    const result = await signup(formData.name, formData.email, formData.password, role);
    
    if (result.success) {
      setStep('complete');
    } else {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: result.error,
      });
    }
    
    setIsLoading(false);
  };

  const handleComplete = () => {
    const redirectPath = role === 'tutor' ? '/app/tutor/dashboard' : '/app/student/dashboard';
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-xl">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {['role', 'account', 'complete'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s ? "bg-primary text-white" :
                    ['role', 'account', 'complete'].indexOf(step) > i ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {['role', 'account', 'complete'].indexOf(step) > i ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 2 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-2",
                      ['role', 'account', 'complete'].indexOf(step) > i ? "bg-primary/20" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground mb-2">Join Studybug</h1>
                  <p className="text-muted-foreground">Choose how you'll use Studybug</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Tutor Card */}
                  <Card 
                    className="cursor-pointer border-2 hover:border-secondary transition-colors group"
                    onClick={() => handleRoleSelect('tutor')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                        <GraduationCap className="w-8 h-8 text-secondary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">I'm a Tutor</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create games, manage classes, track student progress
                      </p>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                        Continue as Tutor
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Student Card */}
                  <Card 
                    className="cursor-pointer border-2 hover:border-primary transition-colors group"
                    onClick={() => handleRoleSelect('student')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <Bug className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">I'm a Student</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Join classes, play games, improve your scores
                      </p>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Continue as Student
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setStep('role'); setRole(null); }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div>
                        <h1 className="text-xl font-bold text-foreground">Create your account</h1>
                        <p className="text-sm text-muted-foreground">
                          {role === 'tutor' ? 'Start your 7-day free trial' : 'Join Studybug for free'}
                        </p>
                      </div>
                    </div>

                    {/* Demo Notice */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-6">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p className="text-sm text-amber-700">
                        Demo mode - accounts stored locally only
                      </p>
                    </div>

                    <form onSubmit={handleAccountSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={cn("pr-10", errors.password ? 'border-destructive' : '')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className={errors.confirmPassword ? 'border-destructive' : ''}
                        />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                          I agree to the{' '}
                          <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                        </Label>
                      </div>
                      {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}

                      <Button
                        type="submit"
                        className="w-full bg-primary text-white hover:bg-primary/90"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    
                    {role === 'tutor' ? (
                      <>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                          Account created!
                        </h1>
                        <p className="text-muted-foreground mb-6">
                          Start your 7-day free trial
                        </p>

                        {/* Billing toggle */}
                        <div className="bg-muted/50 rounded-xl p-4 mb-6">
                          <div className="flex justify-center gap-2 mb-4">
                            <button
                              onClick={() => setBillingCycle('monthly')}
                              className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                billingCycle === 'monthly' 
                                  ? "bg-white shadow text-foreground" 
                                  : "text-muted-foreground"
                              )}
                            >
                              Monthly
                            </button>
                            <button
                              onClick={() => setBillingCycle('annual')}
                              className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                billingCycle === 'annual' 
                                  ? "bg-white shadow text-foreground" 
                                  : "text-muted-foreground"
                              )}
                            >
                              Annual
                              <span className="ml-1 text-xs text-primary">Save £44</span>
                            </button>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">
                              £{billingCycle === 'monthly' ? '12' : '100'}
                              <span className="text-base font-normal text-muted-foreground">
                                /{billingCycle === 'monthly' ? 'month' : 'year'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              after your 7-day trial
                            </p>
                          </div>
                        </div>

                        <Button 
                          onClick={handleComplete}
                          className="w-full bg-primary text-white hover:bg-primary/90"
                          size="lg"
                        >
                          Start Free Trial
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        
                        <p className="text-xs text-muted-foreground mt-4">
                          No credit card required. Cancel anytime during trial.
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                          Welcome to Studybug!
                        </h1>
                        <p className="text-muted-foreground mb-6">
                          Your free student account is ready
                        </p>

                        <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            <span>Join unlimited classes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            <span>Play all assigned games</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            <span>Track your progress</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            <span>View your score history</span>
                          </div>
                        </div>

                        <Button 
                          onClick={handleComplete}
                          className="w-full bg-primary text-white hover:bg-primary/90"
                          size="lg"
                        >
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
