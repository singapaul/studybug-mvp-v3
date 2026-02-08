import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SwipeCardProps {
  statement: string;
  image?: string;
  onSwipe: (direction: 'left' | 'right') => void;
  isActive: boolean;
}

export default function SwipeCard({ statement, image, onSwipe, isActive }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Overlay opacity for visual feedback
  const leftOverlayOpacity = useTransform(x, [-200, 0], [1, 0]);
  const rightOverlayOpacity = useTransform(x, [0, 200], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = window.innerWidth * 0.3; // 30% of screen width
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Determine if swipe threshold is met
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 500) {
        // Swiped right
        onSwipe('right');
      } else {
        // Swiped left
        onSwipe('left');
      }
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
      }}
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute inset-0 flex items-center justify-center cursor-grab"
    >
      <Card className="relative w-full max-w-2xl h-[500px] bg-white shadow-2xl overflow-hidden">
        {/* Left Overlay (Wrong/False) */}
        <motion.div
          style={{ opacity: leftOverlayOpacity }}
          className="absolute inset-0 bg-red-500/20 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="rotate-12 border-8 border-red-500 rounded-full p-8">
            <X className="h-24 w-24 text-red-500 stroke-[3]" />
          </div>
        </motion.div>

        {/* Right Overlay (Correct/True) */}
        <motion.div
          style={{ opacity: rightOverlayOpacity }}
          className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="-rotate-12 border-8 border-green-500 rounded-full p-8">
            <Check className="h-24 w-24 text-green-500 stroke-[3]" />
          </div>
        </motion.div>

        {/* Card Content */}
        <div className="h-full flex flex-col">
          {/* Image (if provided) */}
          {image && (
            <div className="h-1/2 bg-muted relative overflow-hidden">
              <img src={image} alt="Question" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Statement */}
          <div className={`${image ? 'h-1/2' : 'h-full'} flex items-center justify-center p-8`}>
            <p className="text-2xl md:text-3xl font-semibold text-center">{statement}</p>
          </div>
        </div>

        {/* Swipe Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-between px-12 pointer-events-none">
          <div className="flex items-center gap-2 text-red-500">
            <X className="h-6 w-6" />
            <span className="font-semibold text-sm">Swipe Left</span>
          </div>
          <div className="flex items-center gap-2 text-green-500">
            <span className="font-semibold text-sm">Swipe Right</span>
            <Check className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
