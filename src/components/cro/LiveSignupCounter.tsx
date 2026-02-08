import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';

export function LiveSignupCounter() {
  const [count, setCount] = useState(23);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Simulate real-time signups
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setCount((prev) => prev + 1);
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 1000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <Users className="w-4 h-4" />
        <AnimatePresence>
          {showPulse && (
            <motion.div
              className="absolute inset-0 rounded-full bg-success"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm font-medium">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            {count}
          </motion.span>
        </AnimatePresence>{' '}
        students signed up today
      </span>
      <TrendingUp className="w-3 h-3" />
    </motion.div>
  );
}
