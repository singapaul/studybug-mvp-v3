import { useSignup } from '@/context/SignupContext';
import { PLANS } from '@/types/signup';
import { Shield, Zap, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlanSummary() {
  const { formData, currentStep } = useSignup();
  const selectedPlan = PLANS.find((p) => p.id === formData.plan);

  if (!selectedPlan) return null;

  const price =
    formData.billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice;

  const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        Order Summary
      </h3>

      <div className="space-y-4">
        {/* Plan */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-semibold text-foreground">{selectedPlan.name}</span>
        </div>

        {/* Billing Cycle */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Billing</span>
          <span className="font-medium text-foreground capitalize">{formData.billingCycle}</span>
        </div>

        {/* Free Trial */}
        {selectedPlan.id !== 'free' && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Free Trial</span>
            <span className="font-medium text-success">14 days</span>
          </div>
        )}

        <div className="border-t border-border pt-4">
          {/* Due Today */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Due today</span>
            <span className="text-2xl font-bold text-foreground">£0</span>
          </div>

          {selectedPlan.id !== 'free' && (
            <div className="mt-2 p-3 rounded-lg bg-muted/50 text-sm">
              <p className="text-muted-foreground">
                You'll be charged{' '}
                <span className="font-semibold text-foreground">
                  £{price}/{formData.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>{' '}
                after your trial ends on{' '}
                <span className="font-semibold text-foreground">
                  {trialEndDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Change Plan Link */}
        {currentStep > 1 && (
          <Link
            to="/signup/individual"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Change plan
          </Link>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
          <Shield className="w-4 h-4" />
          <span>Secure checkout · Cancel anytime</span>
        </div>

        {/* Help */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Need help?</p>
          <a
            href="mailto:support@studybug.com"
            className="text-sm text-primary hover:underline flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            support@studybug.com
          </a>
        </div>
      </div>
    </div>
  );
}
