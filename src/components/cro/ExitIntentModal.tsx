import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Gift, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ExitIntentModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const hasShown = sessionStorage.getItem('exitIntentShown');
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Add delay before enabling exit intent
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleClaim = () => {
    setIsOpen(false);
    navigate('/signup/individual?promo=EXTENDED');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="text-center relative">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Gift className="w-8 h-8 text-accent-foreground" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-2">Wait! Don't leave yet</h2>
                <p className="text-muted-foreground mb-6">
                  We'd hate to see you go. Here's an exclusive offer just for you:
                </p>

                {/* Offer box */}
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold text-primary">Extended Free Trial</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">21 Days Free</p>
                  <p className="text-sm text-muted-foreground">Instead of the usual 14 days</p>
                </div>

                <Button
                  size="lg"
                  onClick={handleClaim}
                  className="w-full gradient-primary text-primary-foreground hover:opacity-90 mb-3"
                >
                  Claim My Extended Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  No thanks, I'll pass
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
