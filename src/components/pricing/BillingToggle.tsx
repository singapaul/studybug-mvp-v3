import { BillingCycle } from '@/types/signup';
import { useLocale } from '@/context/LocaleContext';

interface BillingToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  const { t } = useLocale();

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted border border-border">
      <button
        onClick={() => onChange('monthly')}
        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
          value === 'monthly'
            ? 'bg-background text-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {t('pricing.monthly')}
      </button>
      <button
        onClick={() => onChange('annual')}
        className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
          value === 'annual'
            ? 'bg-background text-foreground shadow-md'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {t('pricing.annual')}
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent text-accent-foreground animate-pulse">
          {t('pricing.save')}
        </span>
      </button>
    </div>
  );
}
