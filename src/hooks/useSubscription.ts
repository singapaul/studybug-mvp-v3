import { SubscriptionStatus } from '@/types/auth';

export function useSubscription() {
  return {
    status: SubscriptionStatus.ACTIVE,
    isPaid: true,
    isTrial: false,
    isExpired: false,
    trialEndsAt: null,
    subscriptionPeriodEnd: null,
  };
}
