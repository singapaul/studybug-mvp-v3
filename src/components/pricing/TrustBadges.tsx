import { Shield, Lock, Flag, ShieldCheck } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';
import { useLocale } from '@/context/LocaleContext';

export function TrustBadges() {
  const { t } = useLocale();

  const badges = [
    {
      icon: Shield,
      label: t('trust.gdpr'),
      description: t('trust.gdprDesc'),
    },
    {
      icon: Lock,
      label: t('trust.secure'),
      description: t('trust.secureDesc'),
    },
    {
      icon: ShieldCheck,
      label: t('trust.moneyBack'),
      description: t('trust.moneyBackDesc'),
    },
    {
      icon: Flag,
      label: t('trust.ukSupport'),
      description: t('trust.ukSupportDesc'),
    },
  ];

  const schoolLogos = [
    'Oakwood Academy',
    'St. Mary\'s School',
    'Riverside College',
    'Westminster Academy',
  ];

  return (
    <div className="space-y-8">
      {/* Trust message */}
      <ScrollReveal>
        <p className="text-center text-muted-foreground font-medium">
          {t('trust.trusted')} <span className="text-primary font-semibold">{t('trust.studentsTeachers')}</span> {t('trust.acrossUK')}
        </p>
      </ScrollReveal>

      {/* Badges - all consistent white backgrounds */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.1}>
        {badges.map((badge, index) => (
          <StaggerItem key={index}>
            <motion.div 
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-border h-full cursor-default shadow-sm"
            >
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
              >
                <badge.icon className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="font-semibold text-foreground text-sm">{badge.label}</span>
              <span className="text-xs text-muted-foreground">{badge.description}</span>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* School logos placeholder */}
      <ScrollReveal delay={0.3}>
        <div className="flex flex-wrap justify-center gap-4">
          {schoolLogos.map((school, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-white border border-border text-sm text-muted-foreground font-medium cursor-default shadow-sm"
            >
              {school}
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
