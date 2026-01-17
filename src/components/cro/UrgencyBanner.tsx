import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export function UrgencyBanner() {
  const { t } = useLocale();
  // End date: 31st January 2026, 12:00 PM UTC
  const endDate = new Date('2026-01-31T12:00:00Z');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - Date.now();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-lg md:text-xl font-bold text-white tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs text-white/80 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );

  return (
    <motion.div
      className="bg-secondary py-3 px-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="container flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm md:text-base font-semibold text-secondary-foreground">
            {t('urgency.message')}
          </span>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <Clock className="w-4 h-4 text-secondary-foreground/80" />
          <span className="text-xs text-secondary-foreground/80 mr-2">{t('urgency.endsIn')}</span>
          <div className="flex items-center gap-1 md:gap-2 bg-white/20 rounded-lg px-3 py-1">
            <TimeBlock value={timeLeft.days} label={t('urgency.days')} />
            <span className="text-secondary-foreground/60 font-bold">:</span>
            <TimeBlock value={timeLeft.hours} label={t('urgency.hrs')} />
            <span className="text-secondary-foreground/60 font-bold">:</span>
            <TimeBlock value={timeLeft.minutes} label={t('urgency.min')} />
            <span className="text-secondary-foreground/60 font-bold hidden md:inline">:</span>
            <div className="hidden md:block">
              <TimeBlock value={timeLeft.seconds} label={t('urgency.sec')} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
