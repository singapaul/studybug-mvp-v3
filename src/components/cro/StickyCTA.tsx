import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '@/context/LocaleContext';

export function StickyCTA() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px
      const scrolled = window.scrollY > 600;
      setIsVisible(scrolled && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50"
        >
          <div className="relative gradient-primary rounded-2xl p-4 shadow-xl shadow-primary/20 max-w-sm md:max-w-md mx-auto md:mx-0">
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-primary-foreground font-semibold text-sm md:text-base">
                  {t('stickyCta.title')}
                </p>
                <p className="text-primary-foreground/80 text-xs md:text-sm">
                  {t('stickyCta.subtitle')}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => navigate('/signup/individual')}
                className="bg-background text-foreground hover:bg-muted whitespace-nowrap"
              >
                {t('stickyCta.button')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
