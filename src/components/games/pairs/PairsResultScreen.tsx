import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Star,
  Clock,
  Undo2,
  RotateCcw,
  Home,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PairsResultScreenProps {
  moves: number;
  time: number;
  totalPairs: number;
  starRating: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function PairsResultScreen({
  moves,
  time,
  totalPairs,
  starRating,
  onPlayAgain,
  onExit,
}: PairsResultScreenProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isPerfectGame = moves === totalPairs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        <Card className="border-4 border-purple-200 shadow-2xl overflow-hidden">
          {/* Confetti background effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                style={{
                  left: `${(i / 20) * 100}%`,
                }}
              />
            ))}
          </div>

          <CardHeader className="text-center pb-4 relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', duration: 0.8 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-6 shadow-lg">
                <Trophy className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isPerfectGame ? 'Perfect Game!' : 'Well Done!'}
            </CardTitle>

            {isPerfectGame && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-purple-600 mt-2"
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">
                  You matched all pairs in the minimum number of moves!
                </span>
                <Sparkles className="h-5 w-5" />
              </motion.div>
            )}
          </CardHeader>

          <CardContent className="space-y-6 relative">
            {/* Star Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-2"
            >
              {[1, 2, 3].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.5 + star * 0.1,
                    type: 'spring',
                    duration: 0.6,
                  }}
                >
                  <Star
                    className={cn(
                      'h-12 w-12',
                      star <= starRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-green-500 rounded-full p-3">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-700 mb-1">
                      100%
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Score
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-blue-500 rounded-full p-3">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-1">
                      {formatTime(time)}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Time
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-purple-500 rounded-full p-3">
                        <Undo2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-700 mb-1">
                      {moves}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">
                      Moves
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Efficiency Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="flex justify-center"
            >
              <Badge
                variant="outline"
                className={cn(
                  'px-4 py-2 text-base font-semibold',
                  isPerfectGame &&
                    'border-green-500 bg-green-50 text-green-700',
                  !isPerfectGame &&
                    starRating === 2 &&
                    'border-blue-500 bg-blue-50 text-blue-700',
                  !isPerfectGame &&
                    starRating === 1 &&
                    'border-orange-500 bg-orange-50 text-orange-700'
                )}
              >
                {isPerfectGame && '🎯 Perfect Efficiency'}
                {!isPerfectGame && starRating === 2 && '⭐ Great Performance'}
                {!isPerfectGame && starRating === 1 && '👍 Good Effort'}
              </Badge>
            </motion.div>

            {/* Performance Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-muted/50 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Pairs:</span>
                <span className="font-semibold">{totalPairs}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Minimum Moves:</span>
                <span className="font-semibold">{totalPairs}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Moves:</span>
                <span
                  className={cn(
                    'font-semibold',
                    isPerfectGame ? 'text-green-600' : 'text-blue-600'
                  )}
                >
                  {moves}
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Button
                onClick={onPlayAgain}
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button
                onClick={onExit}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Assignments
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
