import { useSignup } from '@/context/SignupContext';
import { AccountType } from '@/types/signup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpen, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';

// ---------------------------------------------------------------------------
// Account type options — Student and Teacher only
// ---------------------------------------------------------------------------

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
];

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

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

const verificationSchema = z.object({
  code: z.string().min(1, 'Verification code is required'),
});

// ---------------------------------------------------------------------------
// Clerk error code → field-level message mapping
// ---------------------------------------------------------------------------

export function mapClerkError(code: string, message: string): { field: string; message: string } {
  switch (code) {
    case 'form_identifier_exists':
      return {
        field: 'email',
        message: 'An account with this email already exists. Sign in instead?',
      };
    case 'form_password_pwned':
      return {
        field: 'password',
        message:
          'This password has been found in a data breach. Please choose a different one.',
      };
    case 'form_password_too_short':
      return { field: 'password', message: 'Password must be at least 8 characters.' };
    default:
      return { field: '_general', message };
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AccountDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Shared form fields UI
// ---------------------------------------------------------------------------

interface FormFieldsProps {
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  errors: Record<string, string>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  passwordStrength: number;
  strengthLabel: string;
  strengthColor: string;
}

function AccountDetailsFormFields({
  onBack,
  onSubmit,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordStrength,
  strengthLabel,
  strengthColor,
}: FormFieldsProps) {
  const { formData, updateFormData } = useSignup();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create your account</h2>
        <p className="text-muted-foreground">Tell us a bit about yourself</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 max-w-md mx-auto">
        {errors._general && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{errors._general}</p>
          </div>
        )}

        {/* Account Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">I am a...</Label>
          <div className="grid grid-cols-2 gap-3">
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
          {formData.password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      level <= passwordStrength ? strengthColor : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: <span className="font-medium">{strengthLabel}</span>
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
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
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

// ---------------------------------------------------------------------------
// Clerk sign-up variant
// NOTE: This component is only ever *rendered* when ClerkProvider is present
// (see the AccountDetailsStep dispatcher at the bottom). React hooks are only
// called when a component renders, so useSignUp() never executes in mock mode.
// ---------------------------------------------------------------------------

function ClerkAccountDetailsStep({ onNext, onBack }: AccountDetailsStepProps) {
  const { signUp, setActive } = useSignUp();
  const { formData, setIsProcessing, setProcessingMessage } = useSignup();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

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

  const { label: strengthLabel, color: strengthColor } = useMemo(() => {
    if (passwordStrength <= 1) return { label: 'Weak', color: 'bg-destructive' };
    if (passwordStrength <= 3) return { label: 'Medium', color: 'bg-coral' };
    return { label: 'Strong', color: 'bg-primary' };
  }, [passwordStrength]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!signUp) {
      setErrors({ _general: 'Sign-up is not available. Please reload and try again.' });
      return;
    }

    setErrors({});
    setIsProcessing(true);
    setProcessingMessage('Creating your account...');

    try {
      const role = formData.accountType === 'teacher' ? 'TUTOR' : 'STUDENT';
      const createdSignUp = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          role,
          plan: formData.plan,
          billing: formData.billingCycle,
        },
      });

      if (createdSignUp.status === 'complete') {
        await setActive?.({ session: createdSignUp.createdSessionId });
        navigate(`/signup/complete?plan=${formData.plan}&billing=${formData.billingCycle}`);
      } else if (
        createdSignUp.status === 'missing_requirements' &&
        createdSignUp.unverifiedFields.includes('email_address')
      ) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setShowVerification(true);
      } else {
        setErrors({ _general: 'Something went wrong during sign-up. Please try again.' });
      }
    } catch (err: unknown) {
      const clerkErrors = (err as { errors?: Array<{ code: string; message: string }> }).errors;
      if (clerkErrors && clerkErrors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        clerkErrors.forEach((clerkErr) => {
          const mapped = mapClerkError(clerkErr.code, clerkErr.message);
          fieldErrors[mapped.field] = mapped.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ _general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = verificationSchema.safeParse({ code: verificationCode });
    if (!parsed.success) {
      setVerificationError('Verification code is required.');
      return;
    }

    if (!signUp) return;

    setIsProcessing(true);
    setProcessingMessage('Verifying email...');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
      if (result.status === 'complete') {
        await setActive?.({ session: result.createdSessionId });
        navigate(`/signup/complete?plan=${formData.plan}&billing=${formData.billingCycle}`);
      } else {
        setVerificationError('Verification incomplete. Please try again.');
      }
    } catch (err: unknown) {
      const clerkErrors = (err as { errors?: Array<{ code: string; message: string }> }).errors;
      if (clerkErrors && clerkErrors.length > 0) {
        setVerificationError(clerkErrors[0].message);
      } else {
        setVerificationError('Invalid code. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (showVerification) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Verify your email</h2>
          <p className="text-muted-foreground">
            We sent a verification code to{' '}
            <span className="font-medium">{formData.email}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <Label htmlFor="code">Verification code *</Label>
            <Input
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className={verificationError ? 'border-destructive' : ''}
              autoComplete="one-time-code"
            />
            {verificationError && (
              <p className="text-xs text-destructive">{verificationError}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowVerification(false)}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90">
              Verify Email
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <AccountDetailsFormFields
      onBack={onBack}
      onSubmit={handleSubmit}
      errors={errors}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      passwordStrength={passwordStrength}
      strengthLabel={strengthLabel}
      strengthColor={strengthColor}
    />
  );
}

// ---------------------------------------------------------------------------
// Mock sign-up variant — no Clerk, just advances the step
// ---------------------------------------------------------------------------

function MockAccountDetailsStep({ onNext, onBack }: AccountDetailsStepProps) {
  const { formData, setIsProcessing, setProcessingMessage } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const { label: strengthLabel, color: strengthColor } = useMemo(() => {
    if (passwordStrength <= 1) return { label: 'Weak', color: 'bg-destructive' };
    if (passwordStrength <= 3) return { label: 'Medium', color: 'bg-coral' };
    return { label: 'Strong', color: 'bg-primary' };
  }, [passwordStrength]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);
    setProcessingMessage('Creating your account...');

    try {
      onNext();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AccountDetailsFormFields
      onBack={onBack}
      onSubmit={handleSubmit}
      errors={errors}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      passwordStrength={passwordStrength}
      strengthLabel={strengthLabel}
      strengthColor={strengthColor}
    />
  );
}

// ---------------------------------------------------------------------------
// Public export — dispatches to the right variant based on whether Clerk
// is configured. This is a module-level constant so it's determined at build
// time. ClerkAccountDetailsStep (which calls useSignUp) is only ever rendered
// inside a ClerkProvider, so the hook never executes in mock mode.
// ---------------------------------------------------------------------------

const hasClerkKey = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export function AccountDetailsStep(props: AccountDetailsStepProps) {
  if (hasClerkKey) {
    return <ClerkAccountDetailsStep {...props} />;
  }
  return <MockAccountDetailsStep {...props} />;
}
