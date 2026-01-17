import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';
import { useLocale } from '@/context/LocaleContext';
import { ShieldIllustration, ClockIllustration } from '@/components/ui/animated-illustrations';
import { Shield, Lock, ShieldCheck, Flag } from 'lucide-react';

export function TrustBadges() {
  const { t } = useLocale();

  const badges = [
    {
      icon: Shield,
      label: t('trust.gdpr'),
      description: t('trust.gdprDesc'),
      color: 'bg-accent',
      iconColor: 'text-white',
    },
    {
      icon: Lock,
      label: t('trust.secure'),
      description: t('trust.secureDesc'),
      color: 'bg-secondary',
      iconColor: 'text-white',
    },
    {
      icon: ShieldCheck,
      label: t('trust.moneyBack'),
      description: t('trust.moneyBackDesc'),
      color: 'bg-warning',
      iconColor: 'text-white',
    },
    {
      icon: Flag,
      label: t('trust.ukSupport'),
      description: t('trust.ukSupportDesc'),
      color: 'bg-coral',
      iconColor: 'text-white',
    },
  ];


  const partnerBadges = [
    { name: 'Education First', type: 'Partner' },
    { name: 'UK EdTech', type: 'Certified' },
    { name: 'Learning Alliance', type: 'Member' },
    { name: 'TeachHub', type: 'Partner' },
  ];

  return (
    <div className="space-y-8">
      {/* Trust message */}
      <ScrollReveal>
        <p className="text-center text-muted-foreground font-medium">
          {t('trust.trusted')} <span className="text-secondary font-semibold">{t('trust.studentsTeachers')}</span> {t('trust.acrossUK')}
        </p>
      </ScrollReveal>

      {/* Badges - all consistent white backgrounds with different accent colors */}
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
                className={`w-10 h-10 rounded-full ${badge.color} flex items-center justify-center mb-2`}
              >
                <badge.icon className={`w-5 h-5 ${badge.iconColor}`} />
              </motion.div>
              <span className="font-semibold text-foreground text-sm">{badge.label}</span>
              <span className="text-xs text-muted-foreground">{badge.description}</span>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Partner badges */}
      <ScrollReveal delay={0.3}>
        <div className="flex flex-wrap justify-center gap-3">
          {partnerBadges.map((partner, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm cursor-default"
            >
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-secondary">{partner.name.charAt(0)}</span>
              </div>
              <span className="font-medium text-foreground">{partner.name}</span>
              <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">{partner.type}</span>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
