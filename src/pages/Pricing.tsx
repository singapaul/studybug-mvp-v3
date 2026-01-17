import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BillingToggle } from '@/components/pricing/BillingToggle';
import { PricingCard } from '@/components/pricing/PricingCard';
import { TrustBadges } from '@/components/pricing/TrustBadges';
import { FeatureComparison } from '@/components/pricing/FeatureComparison';
import { FAQSection } from '@/components/pricing/FAQSection';
import { PLANS, BillingCycle } from '@/types/signup';

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');

  const handleSelectPlan = (planId: string) => {
    if (planId === 'school') {
      navigate('/schools');
    } else if (planId === 'free') {
      navigate('/signup/free');
    } else {
      navigate(`/signup/individual?plan=${planId}&billing=${billingCycle}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required.
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            <div className="text-center mb-10">
              <BillingToggle value={billingCycle} onChange={setBillingCycle} />
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {PLANS.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  billingCycle={billingCycle}
                  onSelect={() => handleSelectPlan(plan.id)}
                />
              ))}
            </div>

            {/* Sub-pricing text */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y border-border bg-muted/30">
          <div className="container">
            <TrustBadges />
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container">
            <FeatureComparison />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <FAQSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
