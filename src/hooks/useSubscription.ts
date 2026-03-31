import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionStatus } from '@/types/auth';

export function useSubscription() {
  const { session } = useAuth();

  const status =
    session?.tutor?.subscriptionStatus ??
    session?.student?.subscriptionStatus ??
    SubscriptionStatus.FREE;

  const trialEndsAt =
    session?.tutor?.trialEndsAt ?? session?.student?.trialEndsAt ?? null;

  const subscriptionPeriodEnd =
    session?.tutor?.subscriptionPeriodEnd ?? session?.student?.subscriptionPeriodEnd ?? null;

  const isPaid =
    status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.TRIALING;

  const isTrial = status === SubscriptionStatus.TRIALING;

  const isExpired =
    status === SubscriptionStatus.EXPIRED || status === SubscriptionStatus.CANCELLED;

  return {
    status,
    isPaid,
    isTrial,
    isExpired,
    trialEndsAt,
    subscriptionPeriodEnd,
  };
}
