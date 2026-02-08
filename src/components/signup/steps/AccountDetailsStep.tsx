import { useSignup } from '@/context/SignupContext';
import { AccountType } from '@/types/signup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpen, Users, ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { z } from 'zod';

const accountTypes = [
  {
    id: 'student' as AccountType,
    label: 'Student',
    emoji: '🎓',
    description: "I'm learning for myself",
    icon: GraduationCap,
  },
  {
    id: 'teacher' as AccountType,
    label: 'Teacher',
    emoji: '👨‍🏫',
    description: "I'm an educator or tutor",
    icon: BookOpen,
  },
  {
    id: 'parent' as AccountType,
    label: 'Parent',
    emoji: '👪',
    description: "I'm paying for my child",
    icon: Users,
  },
];

const accountSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

interface AccountDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function AccountDetailsStep({ onNext, onBack }: AccountDetailsStepProps) {
  const { formData, updateFormData } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, [formData.password]);

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return { label: 'Weak', color: 'bg-destructive' };
    if (passwordStrength <= 3) return { label: 'Medium', color: 'bg-coral' };
    return { label: 'Strong', color: 'bg-primary' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = accountSchema.safeParse({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create your account</h2>
        <p className="text-muted-foreground">Tell us a bit about yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {/* Account Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">I am a...</Label>
          <div className="grid grid-cols-3 gap-3">
            {accountTypes.map((type) => {
              const isSelected = formData.accountType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => updateFormData({ accountType: type.id })}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl mb-1">{type.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              placeholder="John"
              className={errors.firstName ? 'border-destructive' : ''}
            />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              placeholder="Doe"
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
          </div>
        </div>

        {/* Child's Name (for parents) */}
        {formData.accountType === 'parent' && (
          <div className="space-y-2">
            <Label htmlFor="childName">Child's name (optional)</Label>
            <Input
              id="childName"
              value={formData.childName}
              onChange={(e) => updateFormData({ childName: e.target.value })}
              placeholder="Your child's name"
            />
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="john@example.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              placeholder="••••••••"
              className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      level <= passwordStrength ? strengthInfo.color : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: <span className="font-medium">{strengthInfo.label}</span>
              </p>
            </div>
          )}
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              placeholder="••••••••"
              className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="text-xs text-success flex items-center gap-1">
              <Check className="w-3 h-3" /> Passwords match
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
