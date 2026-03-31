import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';

interface SubscriptionGateProps {
  children: ReactNode;
  /** Custom locked state — defaults to an upgrade prompt card */
  fallback?: ReactNode;
  /** Short label shown in the upgrade prompt, e.g. "custom deck creation" */
  featureLabel?: string;
}

function DefaultUpgradePrompt({ featureLabel }: { featureLabel?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Lock className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">
          {featureLabel ? `${featureLabel} is a premium feature` : 'Premium feature'}
        </p>
        <p className="text-sm text-muted-foreground">
          Upgrade to unlock this and all other premium features.
        </p>
      </div>
      <Button
        size="sm"
        className="bg-primary text-white hover:bg-primary/90"
        onClick={() => navigate('/signup')}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Upgrade your plan
      </Button>
    </div>
  );
}

export function SubscriptionGate({ children, fallback, featureLabel }: SubscriptionGateProps) {
  const { isPaid } = useSubscription();

  if (!isPaid) {
    return <>{fallback ?? <DefaultUpgradePrompt featureLabel={featureLabel} />}</>;
  }

  return <>{children}</>;
}
