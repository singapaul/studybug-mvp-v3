import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { tokenStore } from '@/services/api/token-store';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const MAX_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 1500;

export default function SignupComplete() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get('plan') ?? 'free';
  const billing = searchParams.get('billing') ?? 'monthly';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const attemptCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pollStatus = async () => {
    attemptCountRef.current += 1;

    try {
      const token = await tokenStore.getToken();
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await fetch(`${BASE}/api/subscription/status`, { headers });

      if (res.ok) {
        // User exists in DB — proceed based on plan
        if (plan === 'free') {
          navigate('/dashboard');
          return;
        }

        // Paid plan — create Stripe checkout session
        const planType = plan === 'teacher' ? 'tutor' : 'student';
        const interval = billing === 'annual' ? 'annual' : 'monthly';

        const checkoutRes = await fetch(`${BASE}/api/payments/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({ planType, interval }),
        });

        if (checkoutRes.ok) {
          const data = (await checkoutRes.json()) as { url?: string };
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        }

        setErrorMessage('Failed to create checkout session. Please contact support.');
        return;
      }

      if (res.status === 404 && attemptCountRef.current < MAX_ATTEMPTS) {
        // User not in DB yet — retry after interval
        timerRef.current = setTimeout(pollStatus, POLL_INTERVAL_MS);
        return;
      }

      if (attemptCountRef.current >= MAX_ATTEMPTS) {
        setErrorMessage(
          'Account setup is taking longer than expected. Please refresh or contact support.',
        );
        return;
      }

      // Other error
      setErrorMessage('Something went wrong. Please refresh or contact support.');
    } catch {
      if (attemptCountRef.current < MAX_ATTEMPTS) {
        timerRef.current = setTimeout(pollStatus, POLL_INTERVAL_MS);
      } else {
        setErrorMessage(
          'Account setup is taking longer than expected. Please refresh or contact support.',
        );
      }
    }
  };

  useEffect(() => {
    pollStatus();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-6 bg-card border border-border rounded-2xl text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Setup Taking Longer Than Expected</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Refresh
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6 bg-card border border-border rounded-2xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Setting up your account...</h2>
            <p className="text-muted-foreground text-sm">This will only take a moment.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
