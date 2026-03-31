import { useState } from 'react';
import { useSignup } from '@/context/SignupContext';
import { PLANS } from '@/types/signup';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Calendar, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PaymentStep({ onNext: _onNext, onBack }: PaymentStepProps) {
  const { formData, setIsProcessing, setProcessingMessage } = useSignup();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === formData.plan);
  const price =
    formData.billingCycle === 'monthly' ? selectedPlan?.monthlyPrice : selectedPlan?.annualPrice;
  const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const handleCheckout = async () => {
    setError(null);
    setIsRedirecting(true);
    setIsProcessing(true);
    setProcessingMessage('Redirecting to payment...');

    const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
      body: { plan: formData.plan, billingCycle: formData.billingCycle },
    });

    if (fnError || !data?.url) {
      setIsProcessing(false);
      setIsRedirecting(false);
      setError('Could not start checkout. Please try again.');
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Start your free trial</h2>
        <p className="text-muted-foreground">
          You won't be charged until your 14-day trial ends
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Plan summary */}
        <div className="p-5 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground capitalize">
              {selectedPlan?.name} plan
            </span>
            <span className="text-sm text-muted-foreground capitalize">
              {formData.billingCycle}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Due today</span>
            <span className="font-semibold text-success">£0.00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              After trial ends ({trialEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})
            </span>
            <span className="font-medium">£{price}</span>
          </div>
        </div>

        {/* Trial info */}
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">14-day free trial</p>
            <p className="text-sm text-muted-foreground">
              Cancel anytime before {trialEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} and you won't be charged.
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> Secured by Stripe
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> PCI compliant
          </span>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isRedirecting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="button"
            className="flex-1 bg-primary text-white hover:bg-primary/90"
            onClick={handleCheckout}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Redirecting...
              </span>
            ) : (
              'Continue to payment'
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          You'll be taken to Stripe's secure payment page to enter your card details.
        </p>
      </div>
    </div>
  );
}
