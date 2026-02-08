/**
 * EXAMPLE: Signup Form using Supabase Auth with automatic User/Tutor/Student creation
 *
 * This is a reference implementation showing how to use the new auth helpers.
 * Copy and adapt this code to your existing signup components.
 */

import { useState } from 'react';
import { signUp } from '@/lib/supabase-auth-helpers';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SignupExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await signUp(email, password, role);

      if (!result.success) {
        setError(result.error || 'Signup failed');
        return;
      }

      setSuccess(true);
      console.log('User created with ID:', result.userId);

      // The database trigger has now automatically created:
      // 1. A User record with id = result.userId
      // 2. A Tutor or Student record (depending on role)

      // Redirect or show success message
      // Example: navigate to dashboard based on role
      // if (role === Role.TUTOR) {
      //   navigate('/tutor/dashboard');
      // } else {
      //   navigate('/student/dashboard');
      // }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div>
              <Label>I am a:</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={Role.STUDENT}
                    checked={role === Role.STUDENT}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="mr-2"
                  />
                  Student
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value={Role.TUTOR}
                    checked={role === Role.TUTOR}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="mr-2"
                  />
                  Tutor
                </label>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>
                  Account created successfully! Check your email to verify your account.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * USAGE NOTES:
 *
 * 1. When user submits form, signUp() is called with email, password, and role
 *
 * 2. Supabase Auth creates the auth user with metadata: { role: 'TUTOR' or 'STUDENT' }
 *
 * 3. Database trigger fires automatically and:
 *    - Creates User record with same ID as auth user
 *    - Creates Tutor record (if role=TUTOR) with user_id pointing to User
 *    - Creates Student record (if role=STUDENT) with user_id pointing to User
 *
 * 4. All this happens in a single transaction, so it's atomic
 *
 * 5. User receives verification email (if configured in Supabase)
 *
 * 6. When user clicks verification link, another trigger updates User.email_verified
 *
 * 7. You can now query for the user's profile:
 *    const profile = await getUserProfile(userId);
 *    // Returns Tutor or Student record with role
 */

/**
 * INTEGRATION CHECKLIST:
 *
 * [ ] Run supabase-schema.sql in Supabase SQL Editor
 * [ ] Verify triggers are created (check Database > Functions in Supabase dashboard)
 * [ ] Update your existing signup forms to use signUp() from auth helpers
 * [ ] Update login forms to use signIn() from auth helpers
 * [ ] Test creating a tutor account
 * [ ] Test creating a student account
 * [ ] Verify User, Tutor, and Student records are created automatically
 * [ ] Test email verification flow
 * [ ] Update your auth context to use Supabase Auth instead of mock data
 */
