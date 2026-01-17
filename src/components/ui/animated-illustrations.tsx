import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

// Animated Game Controller Illustration
export function GameControllerIllustration({ className, size = 'md' }: IllustrationProps) {
  return (
    <motion.div
      className={cn(sizeClasses[size], 'relative', className)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        initial="initial"
        animate="animate"
      >
        {/* Controller body */}
        <motion.rect
          x="10"
          y="30"
          width="80"
          height="40"
          rx="20"
          className="fill-secondary"
          animate={{ y: [30, 28, 30] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* D-pad */}
        <rect x="22" y="42" width="16" height="6" rx="2" className="fill-white/90" />
        <rect x="27" y="37" width="6" height="16" rx="2" className="fill-white/90" />
        {/* Buttons */}
        <motion.circle
          cx="70"
          cy="42"
          r="5"
          className="fill-cta"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
        />
        <motion.circle
          cx="62"
          cy="50"
          r="5"
          className="fill-warning"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        />
        <circle cx="78" cy="50" r="5" className="fill-accent" />
        <circle cx="70" cy="58" r="5" className="fill-success" />
        {/* Sparkles */}
        <motion.circle
          cx="90"
          cy="25"
          r="3"
          className="fill-warning"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="15"
          cy="22"
          r="2"
          className="fill-accent"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Animated Flashcard Stack Illustration
export function FlashcardStackIllustration({ className, size = 'md' }: IllustrationProps) {
  return (
    <motion.div
      className={cn(sizeClasses[size], 'relative', className)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Back cards */}
        <motion.rect
          x="20"
          y="15"
          width="60"
          height="40"
          rx="6"
          className="fill-accent"
          animate={{ rotate: [-3, -2, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '50% 50%' }}
        />
        <motion.rect
          x="18"
          y="20"
          width="60"
          height="40"
          rx="6"
          className="fill-warning"
          animate={{ rotate: [2, 3, 2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ transformOrigin: '50% 50%' }}
        />
        {/* Front card */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="15" y="25" width="70" height="50" rx="8" className="fill-white shadow-lg" />
          <rect x="15" y="25" width="70" height="50" rx="8" className="fill-secondary" />
          {/* Question mark */}
          <motion.text
            x="50"
            y="58"
            className="fill-white font-bold"
            fontSize="28"
            textAnchor="middle"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ?
          </motion.text>
        </motion.g>
        {/* Sparkle */}
        <motion.path
          d="M85 20 L87 25 L92 27 L87 29 L85 34 L83 29 L78 27 L83 25 Z"
          className="fill-warning"
          animate={{ opacity: [0, 1, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '85px 27px' }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Animated Progress Chart Illustration
export function ProgressChartIllustration({ className, size = 'md' }: IllustrationProps) {
  return (
    <motion.div
      className={cn(sizeClasses[size], 'relative', className)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Chart background */}
        <rect x="15" y="15" width="70" height="60" rx="8" className="fill-white" />
        <rect x="15" y="15" width="70" height="60" rx="8" className="fill-muted" />
        
        {/* Bars */}
        <motion.rect
          x="25"
          y="55"
          width="10"
          height="15"
          rx="2"
          className="fill-secondary"
          initial={{ height: 0, y: 70 }}
          animate={{ height: 15, y: 55 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        <motion.rect
          x="40"
          y="45"
          width="10"
          height="25"
          rx="2"
          className="fill-accent"
          initial={{ height: 0, y: 70 }}
          animate={{ height: 25, y: 45 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.rect
          x="55"
          y="35"
          width="10"
          height="35"
          rx="2"
          className="fill-warning"
          initial={{ height: 0, y: 70 }}
          animate={{ height: 35, y: 35 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.rect
          x="70"
          y="25"
          width="10"
          height="45"
          rx="2"
          className="fill-success"
          initial={{ height: 0, y: 70 }}
          animate={{ height: 45, y: 25 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        
        {/* Arrow pointing up */}
        <motion.path
          d="M50 10 L55 18 L52 18 L52 8 L48 8 L48 18 L45 18 Z"
          className="fill-cta"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Animated Trophy/Achievement Illustration
export function TrophyIllustration({ className, size = 'md' }: IllustrationProps) {
  return (
    <motion.div
      className={cn(sizeClasses[size], 'relative', className)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Trophy cup */}
        <motion.path
          d="M30 25 L70 25 L65 55 Q50 65 35 55 Z"
          className="fill-warning"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '50% 45%' }}
        />
        {/* Trophy handles */}
        <path d="M30 30 Q15 30 15 42 Q15 50 28 50" fill="none" className="stroke-warning" strokeWidth="5" />
        <path d="M70 30 Q85 30 85 42 Q85 50 72 50" fill="none" className="stroke-warning" strokeWidth="5" />
        {/* Base */}
        <rect x="40" y="62" width="20" height="8" rx="2" className="fill-foreground" />
        <rect x="35" y="68" width="30" height="10" rx="3" className="fill-foreground" />
        {/* Star */}
        <motion.path
          d="M50 32 L53 41 L62 41 L55 47 L58 56 L50 51 L42 56 L45 47 L38 41 L47 41 Z"
          className="fill-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Sparkles */}
        <motion.circle
          cx="25"
          cy="18"
          r="3"
          className="fill-cta"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="78"
          cy="22"
          r="2"
          className="fill-accent"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="50"
          cy="12"
          r="2.5"
          className="fill-secondary"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Animated Team/Classroom Illustration
export function TeamIllustration({ className, size = 'md' }: IllustrationProps) {
  return (
    <motion.div
      className={cn(sizeClasses[size], 'relative', className)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Center person */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <circle cx="50" cy="35" r="12" className="fill-secondary" />
          <ellipse cx="50" cy="65" rx="18" ry="15" className="fill-secondary" />
        </motion.g>
        
        {/* Left person */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        >
          <circle cx="25" cy="40" r="10" className="fill-accent" />
          <ellipse cx="25" cy="65" rx="14" ry="12" className="fill-accent" />
        </motion.g>
        
        {/* Right person */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        >
          <circle cx="75" cy="40" r="10" className="fill-warning" />
          <ellipse cx="75" cy="65" rx="14" ry="12" className="fill-warning" />
        </motion.g>
        
        {/* Connection lines */}
        <motion.line
          x1="35"
          y1="45"
          x2="40"
          y2="40"
          className="stroke-muted-foreground"
          strokeWidth="2"
          strokeDasharray="4 2"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.line
          x1="65"
          y1="45"
          x2="60"
          y2="40"
          className="stroke-muted-foreground"
          strokeWidth="2"
          strokeDasharray="4 2"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Animated Book/Library Illustration
export function LibraryIllustration({ className, size = 'md' }: IllustrationProps) {
  return (
    <motion.div
      className={cn(sizeClasses[size], 'relative', className)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Books */}
        <rect x="15" y="30" width="15" height="45" rx="2" className="fill-secondary" />
        <rect x="32" y="25" width="12" height="50" rx="2" className="fill-accent" />
        <rect x="46" y="35" width="14" height="40" rx="2" className="fill-warning" />
        <rect x="62" y="28" width="12" height="47" rx="2" className="fill-cta" />
        <rect x="76" y="32" width="10" height="43" rx="2" className="fill-success" />
        
        {/* Book spines */}
        <rect x="17" y="32" width="2" height="41" className="fill-white/30" />
        <rect x="34" y="27" width="2" height="46" className="fill-white/30" />
        <rect x="48" y="37" width="2" height="36" className="fill-white/30" />
        
        {/* Open book floating above */}
        <motion.g
          animate={{ y: [0, -5, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ transformOrigin: '50% 15%' }}
        >
          <path d="M35 15 Q50 5 65 15 L65 25 Q50 18 35 25 Z" className="fill-white" />
          <path d="M35 15 Q50 5 65 15" fill="none" className="stroke-secondary" strokeWidth="2" />
          <line x1="40" y1="18" x2="48" y2="16" className="stroke-muted" strokeWidth="1" />
          <line x1="52" y1="16" x2="60" y2="18" className="stroke-muted" strokeWidth="1" />
        </motion.g>
        
        {/* Sparkle */}
        <motion.circle
          cx="75"
          cy="18"
          r="3"
          className="fill-warning"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.svg>
    </motion.div>
  );
}
