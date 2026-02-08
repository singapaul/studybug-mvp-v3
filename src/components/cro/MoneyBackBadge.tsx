import { Shield, BadgeCheck } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

interface MoneyBackBadgeProps {
  className?: string;
}

export function MoneyBackBadge({ className = '' }: MoneyBackBadgeProps) {
  const { t } = useLocale();

  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-success/5 border border-success/20 ${className}`}
    >
      <div className="w-12 h-12 rounded-full gradient-success flex items-center justify-center">
        <Shield className="w-6 h-6 text-success-foreground" />
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="font-bold text-foreground">{t('moneyBack.title')}</span>
          <BadgeCheck className="w-4 h-4 text-success" />
        </div>
        <p className="text-sm text-muted-foreground">{t('moneyBack.subtitle')}</p>
      </div>
    </div>
  );
}
