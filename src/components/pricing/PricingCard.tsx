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
  
  const monthlyPrice = plan.monthlyPrice;
  const annualMonthly = Math.round((plan.annualPrice / 12) * 100) / 100;
  const displayPrice = billingCycle === 'monthly' ? monthlyPrice : annualMonthly;
  const annualTotal = plan.annualPrice;

  const getCardStyle = () => {
    switch (plan.tier) {
      case 'free':
        return 'border-2 border-dashed border-border bg-white';
      case 'standard':
        return 'border-2 border-primary bg-white shadow-xl ring-4 ring-primary/10';
      case 'premium':
        return 'border-2 border-secondary/50 bg-white shadow-lg';
      case 'enterprise':
        return 'border-2 border-accent bg-white shadow-lg';
      default:
        return 'border-2 border-border bg-white';
    }
  };

  const getBadgeStyle = () => {
    switch (plan.badgeColor) {
      case 'accent':
        return 'bg-warning text-foreground';
      case 'primary':
        return 'bg-primary text-white';
      case 'secondary':
        return 'bg-secondary text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  const getAccentColor = () => {
    switch (plan.tier) {
      case 'free':
        return 'bg-muted';
      case 'standard':
        return 'bg-primary';
      case 'premium':
        return 'bg-secondary';
      case 'enterprise':
        return 'bg-accent';
      default:
        return 'bg-primary';
    }
  };

  const getButtonStyle = () => {
    switch (plan.tier) {
      case 'free':
        return 'bg-muted text-foreground hover:bg-muted/80 rounded-full';
      case 'standard':
        return 'bg-primary text-white hover:bg-primary/90 shadow-lg rounded-full';
      case 'premium':
        return 'bg-secondary text-white hover:bg-secondary/90 rounded-full';
      case 'enterprise':
        return 'bg-foreground text-white hover:bg-foreground/90 rounded-full';
      default:
        return 'bg-primary text-white rounded-full';
    }
  };

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
      className={`relative flex flex-col rounded-3xl p-6 transition-all h-full ${getCardStyle()}`}
    >
      {plan.badge && (
        <motion.div 
          className="absolute -top-3 right-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getBadgeStyle()}`}>
            {isPopular && <Sparkles className="w-3 h-3" />}
            {getBadgeText()}
          </span>
        </motion.div>
      )}

      <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-3xl ${getAccentColor()}`} />

      <div className="mb-6 pt-2">
        <h3 className="text-xl font-bold text-foreground mb-1">
          {t(`plan.${plan.id}`)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t(`plan.${plan.id}.subtitle`)}
        </p>
      </div>

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
              <span className="text-sm text-primary mt-1 font-medium">
                {t('pricing.billedAnnually')} {formatPrice(annualTotal)}
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <motion.li 
            key={index} 
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm text-foreground">{feature}</span>
          </motion.li>
        ))}
        {plan.negativeFeatures?.map((feature, index) => (
          <li key={`neg-${index}`} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
              <X className="w-3 h-3 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

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
