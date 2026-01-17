import { Building2, Users, TrendingUp } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';
import { useLocale } from '@/context/LocaleContext';

export function StatsBar() {
  const { t } = useLocale();
  
  const stats = [
    {
      icon: Building2,
      value: '500+',
      label: t('stats.schools'),
      color: 'bg-secondary',
    },
    {
      icon: Users,
      value: '50,000+',
      label: t('stats.students'),
      color: 'bg-primary',
    },
    {
      icon: TrendingUp,
      value: '92%',
      label: t('stats.improvement'),
      color: 'bg-coral',
    },
  ];

  return (
    <section className="py-8 bg-accent border-y border-border">
      <div className="container">
        <StaggerContainer className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 text-center md:text-left cursor-default"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-accent-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-accent-foreground/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
