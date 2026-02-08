import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplatButtonProps {
  answer: string;
  index: number;
  totalAnswers: number;
  isCorrect: boolean;
  isSelected: boolean;
  showCorrect: boolean;
  onSelect: (answer: string, position: { x: number; y: number }) => void;
  disabled: boolean;
}

// Generate random position ensuring no overlap
function generateRandomPosition(
  index: number,
  totalAnswers: number,
  buttonWidth: number,
  buttonHeight: number
): { x: number; y: number } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Define safe zones (avoid header area)
  const minX = 50;
  const maxX = viewportWidth - buttonWidth - 50;
  const minY = 350; // Below question card
  const maxY = viewportHeight - buttonHeight - 50;

  // Use grid-based positioning with randomization to ensure spread
  const cols = Math.ceil(Math.sqrt(totalAnswers));
  const rows = Math.ceil(totalAnswers / cols);

  const col = index % cols;
  const row = Math.floor(index / cols);

  const cellWidth = (maxX - minX) / cols;
  const cellHeight = (maxY - minY) / rows;

  // Random position within cell
  const x = minX + col * cellWidth + Math.random() * (cellWidth - buttonWidth);
  const y = minY + row * cellHeight + Math.random() * (cellHeight - buttonHeight);

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

export default function SplatButton({
  answer,
  index,
  totalAnswers,
  isCorrect,
  isSelected,
  showCorrect,
  onSelect,
  disabled,
}: SplatButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [buttonSize, setButtonSize] = useState({ width: 200, height: 80 });

  // Calculate position on mount
  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonSize({ width: rect.width, height: rect.height });

      const pos = generateRandomPosition(index, totalAnswers, rect.width, rect.height);
      setPosition(pos);
    }
  }, [index, totalAnswers]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    onSelect(answer, { x: centerX, y: centerY });
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{
        opacity: isSelected && isCorrect ? 0 : 1,
        scale: isSelected && isCorrect ? 2 : 1,
        rotate: 0,
        x: position.x,
        y: position.y,
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        type: 'spring',
        duration: 0.5,
        delay: index * 0.1,
      }}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={cn(
        'absolute pointer-events-auto',
        'px-6 py-4 rounded-2xl',
        'text-lg font-bold shadow-xl',
        'transition-all duration-200',
        'min-w-[150px] max-w-[250px]',
        'border-4',
        // Default state
        !isSelected &&
          !showCorrect &&
          'bg-gradient-to-br from-orange-400 to-red-500 text-white border-orange-600 hover:from-orange-500 hover:to-red-600',
        // Selected correct (splat animation handled by parent)
        isSelected &&
          isCorrect &&
          'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-700',
        // Selected wrong (shake animation)
        isSelected &&
          !isCorrect &&
          'bg-gradient-to-br from-red-500 to-red-700 text-white border-red-800 animate-shake',
        // Show correct answer
        showCorrect &&
          isCorrect &&
          'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-700 ring-4 ring-green-300',
        // Disabled
        disabled && 'cursor-not-allowed opacity-75'
      )}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      {answer}
    </motion.button>
  );
}
