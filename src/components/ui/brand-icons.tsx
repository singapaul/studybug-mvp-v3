import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
}

// Custom brand icons with playful styling
export function GamepadIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <rect x="2" y="6" width="20" height="12" rx="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="12" r="2" fill="currentColor"/>
      <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
      <circle cx="14" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function FlashcardIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <rect x="4" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="6" y="8" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <line x1="9" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function TrophyIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 4h10v6c0 2.761-2.239 5-5 5s-5-2.239-5-5V4z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 6H4c0 2.5 1.5 4 3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 6h3c0 2.5-1.5 4-3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function ChartIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 15l3-4 3 2 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="11" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="13" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function UsersIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <circle cx="9" cy="7" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 21v-2c0-2.21 2.686-4 6-4s6 1.79 6 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M17 13c2.21 0 4 1.34 4 3v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SchoolIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <path d="M12 3l10 5v2H2V8l10-5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="4" y="10" width="4" height="8" stroke="currentColor" strokeWidth="2"/>
      <rect x="10" y="10" width="4" height="8" stroke="currentColor" strokeWidth="2"/>
      <rect x="16" y="10" width="4" height="8" stroke="currentColor" strokeWidth="2"/>
      <rect x="2" y="18" width="20" height="3" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function SparkleIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="19" cy="5" r="1.5" fill="currentColor"/>
      <circle cx="5" cy="19" r="1" fill="currentColor"/>
    </svg>
  );
}

// Animated icon wrapper
interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'coral' | 'warning';
}

export function AnimatedIconWrapper({ children, className, color = 'primary' }: AnimatedIconProps) {
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-foreground',
    coral: 'bg-coral text-white',
    warning: 'bg-warning text-foreground',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center justify-center rounded-2xl',
        colorClasses[color],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
