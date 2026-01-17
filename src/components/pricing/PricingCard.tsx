import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlanDetails, BillingCycle } from '@/types/signup';
import { motion } from 'framer-motion';
import { useLocale } from '@/context/LocaleContext';

interface PricingCardProps {
  plan: PlanDetails;
  billingCycle: BillingCycle;
  onSelect: () => void;
}

export function PricingCard({ plan, billingCycle, onSelect }: PricingCardProps) {
  const { t, formatPrice } = useLocale();
  const isCustomPricing = plan.id === 'school';
  const isFree = plan.id === 'free';
  const isPopular = plan.tier === 'standard';
  
  // Calculate annual price as monthly equivalent
  const monthlyPrice = plan.monthlyPrice;
  const annualMonthly = Math.round((plan.annualPrice / 12) * 100) / 100;
  const displayPrice = billingCycle === 'monthly' ? monthlyPrice : annualMonthly;
  const annualTotal = plan.annualPrice;

  // Card styling based on tier
  const getCardStyle = () => {
    switch (plan.tier) {
      case 'free':
        return 'border-dashed border-2 border-border bg-muted/30';
      case 'standard':
        return 'border-2 border-primary bg-primary/5 shadow-lg shadow-primary/20 ring-2 ring-primary/20';
      case 'premium':
        return 'border-2 border-border bg-card shadow-md';
      case 'enterprise':
        return 'border-2 border-secondary/50 bg-gradient-to-br from-secondary/10 to-primary/5';
      default:
        return 'border-2 border-border bg-card';
    }
  };

  // Badge styling
  const getBadgeStyle = () => {
    switch (plan.badgeColor) {
      case 'accent':
        return 'bg-accent text-accent-foreground';
      case 'primary':
        return 'gradient-primary text-primary-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  // Button styling
  const getButtonStyle = () => {
    switch (plan.tier) {
      case 'free':
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
      case 'standard':
        return 'gradient-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30';
      case 'premium':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'enterprise':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  // Get translated badge
  const getBadgeText = () => {
    if (!plan.badge) return null;
    if (plan.badge === 'Most Popular') return t('badge.mostPopular');
    if (plan.badge === 'Best for Educators') return t('badge.bestForEducators');
    if (plan.badge === 'Enterprise') return t('badge.enterprise');
    return plan.badge;
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative flex flex-col rounded-2xl p-6 transition-all h-full group ${getCardStyle()}`}
    >
      {/* Popular glow effect */}
      {isPopular && (
        <div className="absolute inset-0 rounded-2xl gradient-primary opacity-5 group-hover:opacity-10 transition-opacity" />
      )}

      {/* Badge */}
      {plan.badge && (
        <motion.div 
          className="absolute -top-3 right-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getBadgeStyle()}`}>
            {isPopular && <Sparkles className="w-3 h-3" />}
            {getBadgeText()}
          </span>
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-1">
          {t(`plan.${plan.id}`)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t(`plan.${plan.id}.subtitle`)}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {isCustomPricing ? (
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-foreground">{t('pricing.customPricing')}</span>
            <span className="text-sm text-muted-foreground mt-1">{t('pricing.contactUs')}</span>
          </div>
        ) : isFree ? (
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-foreground">{formatPrice(0)}</span>
            <span className="text-sm text-muted-foreground mt-1">{t('pricing.freeForever')}</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">
                {formatPrice(displayPrice)}
              </span>
              <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
            </div>
            {billingCycle === 'annual' && (
              <span className="text-sm text-success mt-1 font-medium">
                {t('pricing.billedAnnually')} {formatPrice(annualTotal)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <motion.li 
            key={index} 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-success" />
            </div>
            <span className="text-sm text-foreground">{feature}</span>
          </motion.li>
        ))}
        {plan.negativeFeatures?.map((feature, index) => (
          <li key={`neg-${index}`} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
              <X className="w-3 h-3 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onSelect}
          className={`w-full ${getButtonStyle()}`}
          size="lg"
        >
          {plan.ctaText}
        </Button>
      </motion.div>
    </motion.div>
  );
}
