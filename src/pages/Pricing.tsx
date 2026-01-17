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
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <section className="py-20 bg-cream relative overflow-hidden">
          <div className="absolute top-10 left-[10%] w-48 h-48 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute bottom-10 right-[15%] w-64 h-64 rounded-full bg-secondary/10 blur-2xl" />
          
          <div className="container text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              14-day free trial on all paid plans
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Choose the plan that fits your learning journey. No hidden fees.
            </motion.p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-10">
              <BillingToggle value={billingCycle} onChange={setBillingCycle} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {PLANS.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PricingCard
                    plan={plan}
                    billingCycle={billingCycle}
                    onSelect={() => handleSelectPlan(plan.id)}
                  />
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y border-border bg-cream">
          <div className="container">
            <TrustBadges />
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-white">
          <div className="container">
            <FeatureComparison />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute top-10 left-[10%] w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-10 right-[15%] w-64 h-64 rounded-full bg-secondary/10 blur-2xl" />
          
          <div className="container text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 rounded-full shadow-lg font-semibold"
              onClick={() => navigate('/signup/individual')}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-cream">
          <div className="container">
            <FAQSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
