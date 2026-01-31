import { motion } from 'framer-motion';

interface ParticleEffectProps {
  x: number;
  y: number;
}

export default function ParticleEffect({ x, y }: ParticleEffectProps) {
  const particleCount = 20;
  const colors = ['#f97316', '#ef4444', '#ec4899', '#f59e0b', '#eab308'];

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Central burst */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Particles */}
      {[...Array(particleCount)].map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size = 8 + Math.random() * 12;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x,
              y,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Star particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.div
            key={`star-${i}`}
            className="absolute text-3xl"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x,
              y,
              opacity: 0,
              scale: 1.5,
              rotate: 360,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          >
            ⭐
          </motion.div>
        );
      })}

      {/* Text splash */}
      <motion.div
        className="absolute text-6xl font-bold text-white"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textShadow: '0 0 20px rgba(249, 115, 22, 0.8)',
        }}
        initial={{ scale: 0, opacity: 1, rotate: -45 }}
        animate={{ scale: 1.5, opacity: 0, rotate: 0 }}
        transition={{ duration: 0.6 }}
      >
        SPLAT!
      </motion.div>
    </div>
  );
}
