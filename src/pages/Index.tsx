import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PricingHero } from '@/components/pricing/PricingHero';
import { StatsBar } from '@/components/pricing/StatsBar';
import { HowItWorks } from '@/components/pricing/HowItWorks';
import { FeaturesGrid } from '@/components/pricing/FeaturesGrid';
import { BillingToggle } from '@/components/pricing/BillingToggle';
import { PricingCard } from '@/components/pricing/PricingCard';
import { TrustBadges } from '@/components/pricing/TrustBadges';
import { FeatureComparison } from '@/components/pricing/FeatureComparison';
import { Testimonials } from '@/components/pricing/Testimonials';
import { FAQSection } from '@/components/pricing/FAQSection';
import { PLANS, BillingCycle } from '@/types/signup';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { UrgencyBanner } from '@/components/cro/UrgencyBanner';
import { StickyCTA } from '@/components/cro/StickyCTA';
import { InteractiveDemo } from '@/components/cro/InteractiveDemo';
import { MoneyBackBadge } from '@/components/cro/MoneyBackBadge';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';
import { ArrowRight } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const pricingRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const handleSelectPlan = (planId: string) => {
    if (planId === 'school') {
      navigate('/schools');
    } else if (planId === 'free') {
      navigate('/signup/free');
    } else {
      navigate(`/signup/individual?plan=${planId}&billing=${billingCycle}`);
    }
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Urgency Banner */}
      <UrgencyBanner />
      
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <PricingHero 
          onStartTrial={scrollToPricing}
          onLearnMore={scrollToHowItWorks}
        />

        {/* Stats Bar */}
        <StatsBar />

        {/* How It Works */}
        <div ref={howItWorksRef}>
          <HowItWorks />
        </div>

        {/* Interactive Demo */}
        <InteractiveDemo />

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20 bg-background">
          <div className="container">
            <ScrollReveal className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('pricing.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {t('pricing.subtitle')}
              </p>
              
              {/* Toggle */}
              <BillingToggle value={billingCycle} onChange={setBillingCycle} />
            </ScrollReveal>

            {/* Pricing Cards */}
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
              {PLANS.map((plan) => (
                <StaggerItem key={plan.id}>
                  <PricingCard
                    plan={plan}
                    billingCycle={billingCycle}
                    onSelect={() => handleSelectPlan(plan.id)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Money Back Guarantee */}
            <ScrollReveal delay={0.4}>
              <div className="flex justify-center mt-10">
                <MoneyBackBadge />
              </div>
            </ScrollReveal>

            {/* Sub-pricing text */}
            <ScrollReveal delay={0.5}>
              <p className="text-center text-sm text-muted-foreground mt-6">
                {t('pricing.noCreditCard')}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y border-border bg-cream">
          <div className="container">
            <TrustBadges />
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-background">
          <div className="container">
            <FeatureComparison />
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Final CTA - Clean and focused */}
        <section className="py-20 bg-foreground relative overflow-hidden">
          <div className="container text-center relative">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Learning Smarter Today
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
                Join thousands of students and teachers who are making revision fun and effective.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-lg font-semibold"
                  onClick={() => navigate('/signup/individual')}
                >
                  Start 14-Day Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full"
                  onClick={() => navigate('/schools')}
                >
                  For Schools
                </Button>
              </div>
              <p className="text-sm text-white/50 mt-4">
                No credit card required • Cancel anytime
              </p>
            </ScrollReveal>
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

      {/* CRO Elements */}
      <StickyCTA />
    </div>
  );
}
