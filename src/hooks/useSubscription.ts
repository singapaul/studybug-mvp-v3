import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

type SubscriptionStatus = 'FREE' | 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

type SubscriptionState = {
  status: SubscriptionStatus | null;
  trialEndsAt: Date | null;
  periodEnd: Date | null;
  role: 'TUTOR' | 'STUDENT' | null;
  isLoading: boolean;
  isActive: boolean;
  daysUntilTrialEnd: number | null;
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function computeDaysUntilTrialEnd(trialEndsAt: Date | null): number | null {
  if (!trialEndsAt) return null;
  const now = new Date();
  const diff = trialEndsAt.getTime() - now.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function useSubscription(): SubscriptionState {
  const { getToken, isSignedIn } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    status: null,
    trialEndsAt: null,
    periodEnd: null,
    role: null,
    isLoading: true,
    isActive: false,
    daysUntilTrialEnd: null,
  });

  useEffect(() => {
    if (!isSignedIn) {
      setState({
        status: null,
        trialEndsAt: null,
        periodEnd: null,
        role: null,
        isLoading: false,
        isActive: false,
        daysUntilTrialEnd: null,
      });
      return;
    }

    let cancelled = false;

    async function fetchStatus() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/api/subscription/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (!cancelled) {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
          return;
        }

        const data = await res.json();
        const trialEndsAt = data.trialEndsAt ? new Date(data.trialEndsAt) : null;
        const periodEnd = data.periodEnd ? new Date(data.periodEnd) : null;
        const isActive = data.status === 'ACTIVE' || data.status === 'TRIALING';
        const daysUntilTrialEnd = computeDaysUntilTrialEnd(trialEndsAt);

        if (!cancelled) {
          setState({
            status: data.status,
            trialEndsAt,
            periodEnd,
            role: data.role,
            isLoading: false,
            isActive,
            daysUntilTrialEnd,
          });
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    }

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, getToken]);

  return state;
}
