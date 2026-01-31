import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardCardProps {
  front: string;
  back: string;
  frontImage?: string;
  backImage?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashcardCard({
  front,
  back,
  frontImage,
  backImage,
  isFlipped,
  onFlip,
}: FlashcardCardProps) {
  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: '1000px', minHeight: '400px' }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      >
        {/* Front Side */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl shadow-2xl',
            'bg-gradient-to-br from-white to-blue-50',
            'flex flex-col items-center justify-center p-8',
            'border-4 border-blue-200',
            'backface-hidden',
            'min-h-[400px]'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Front Content */}
          <div className="text-center space-y-6 w-full max-w-xl">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Question
            </div>

            {frontImage && (
              <div className="w-full max-h-48 flex items-center justify-center mb-4">
                <img
                  src={frontImage}
                  alt="Front"
                  className="max-w-full max-h-48 object-contain rounded-lg shadow-md"
                />
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              {front}
            </h2>

            <div className="flex items-center justify-center gap-2 text-blue-600 text-sm font-medium mt-8">
              <RotateCw className="h-4 w-4 animate-pulse" />
              <span>Click or press Space to flip</span>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl shadow-2xl',
            'bg-gradient-to-br from-white to-green-50',
            'flex flex-col items-center justify-center p-8',
            'border-4 border-green-200',
            'backface-hidden',
            'min-h-[400px]'
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Back Content */}
          <div className="text-center space-y-6 w-full max-w-xl">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Answer
            </div>

            {backImage && (
              <div className="w-full max-h-48 flex items-center justify-center mb-4">
                <img
                  src={backImage}
                  alt="Back"
                  className="max-w-full max-h-48 object-contain rounded-lg shadow-md"
                />
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              {back}
            </h2>

            <div className="text-sm text-muted-foreground mt-8">
              Did you know the answer?
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile hint */}
      <div className="sm:hidden text-center text-xs text-muted-foreground mt-4">
        Swipe up/down to flip • Swipe left/right to navigate
      </div>
    </div>
  );
}
