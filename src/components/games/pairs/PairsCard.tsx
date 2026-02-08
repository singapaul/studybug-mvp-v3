import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PairsCardProps {
  id: string;
  content: string;
  image?: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: string) => void;
  disabled?: boolean;
}

export default function PairsCard({
  id,
  content,
  image,
  isFlipped,
  isMatched,
  onClick,
  disabled = false,
}: PairsCardProps) {
  const handleClick = () => {
    if (!disabled && !isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full aspect-square cursor-pointer',
        (disabled || isMatched) && 'cursor-not-allowed'
      )}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: isFlipped || isMatched ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      >
        {/* Card Back */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl shadow-lg',
            'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
            'flex items-center justify-center',
            'border-4 border-purple-400/50',
            'backface-hidden'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="relative">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-3 gap-2 h-full w-full p-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-full"
                    style={{
                      transform: `scale(${0.5 + (i % 3) * 0.2})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Icon */}
            <Sparkles className="h-12 w-12 text-white relative z-10" />
          </div>
        </div>

        {/* Card Front */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl shadow-lg',
            'bg-gradient-to-br from-white to-gray-50',
            'flex flex-col items-center justify-center p-4',
            'border-4',
            isMatched ? 'border-green-400 bg-green-50' : 'border-purple-200',
            'backface-hidden'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Matched indicator */}
          {isMatched && (
            <motion.div
              className="absolute top-2 right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-1">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          )}

          {/* Image */}
          {image && (
            <div className="w-full h-1/2 mb-2 flex items-center justify-center">
              <img
                src={image}
                alt={content}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}

          {/* Text Content */}
          <div
            className={cn(
              'text-center font-semibold break-words w-full',
              image ? 'text-sm' : 'text-base sm:text-lg'
            )}
          >
            {content}
          </div>
        </div>
      </motion.div>

      {/* Hover effect (only when not flipped and not matched) */}
      {!isFlipped && !isMatched && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
}
