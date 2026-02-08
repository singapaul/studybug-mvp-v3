import { useNavigate } from 'react-router-dom';
import { useSignup } from '@/context/SignupContext';
import { PLANS, PlanType } from '@/types/signup';
import { BillingToggle } from '@/components/pricing/BillingToggle';
import { Check, X, Sparkles, Crown, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChoosePlanStepProps {
  onNext: () => void;
}

export function ChoosePlanStep({ onNext }: ChoosePlanStepProps) {
  const navigate = useNavigate();
  const { formData, updateFormData } = useSignup();

  // Filter to show only paid individual plans
  const individualPlans = PLANS.filter((p) => p.id === 'student' || p.id === 'teacher');
  const schoolPlan = PLANS.find((p) => p.id === 'school');

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === 'school') {
      navigate('/schools/demo');
      return;
    }
    updateFormData({ plan: planId });
  };

  const getIconForPlan = (planId: string) => {
    switch (planId) {
      case 'student':
        return GraduationCap;
      case 'teacher':
        return Crown;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose your plan</h2>
        <p className="text-muted-foreground">Start with a 14-day free trial. Cancel anytime.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <BillingToggle
          value={formData.billingCycle}
          onChange={(cycle) => updateFormData({ billingCycle: cycle })}
        />
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {individualPlans.map((plan) => {
          const isSelected = formData.plan === plan.id;
          const price =
            formData.billingCycle === 'monthly'
              ? plan.monthlyPrice
              : Math.round((plan.annualPrice / 12) * 100) / 100;
          const Icon = getIconForPlan(plan.id);

          return (
            <button
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              className={`relative flex flex-col rounded-2xl border-2 p-6 text-left transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                      plan.badgeColor === 'accent'
                        ? 'bg-accent text-accent-foreground'
                        : 'gradient-primary text-primary-foreground'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              <div
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'bg-primary border-primary' : 'border-border bg-background'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  isSelected ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                />
              </div>

              {/* Plan Info */}
              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.subtitle}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">£{price.toFixed(2)}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {formData.billingCycle === 'annual' && (
                <p className="text-sm text-success mb-4">Billed as £{plan.annualPrice}/year</p>
              )}

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* School Plan Option */}
      {schoolPlan && (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => handleSelectPlan('school')}
            className="w-full p-4 rounded-xl border border-dashed border-border bg-muted/30 hover:border-secondary hover:bg-secondary/5 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-foreground">Looking for a School plan?</h4>
                <p className="text-sm text-muted-foreground">
                  Bulk licensing for your entire institution →
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-secondary">Request Demo</span>
          </button>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onNext}
          className="gradient-primary text-primary-foreground hover:opacity-90 px-8"
        >
          Continue to Account Setup
        </Button>
      </div>
    </div>
  );
}
