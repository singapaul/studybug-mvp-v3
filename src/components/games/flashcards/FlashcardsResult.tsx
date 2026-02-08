import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen,
  RotateCcw,
  Home,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardsResultProps {
  totalCards: number;
  knownCards: number;
  unknownCards: number;
  time: number;
  reviewMode: boolean;
  onReviewUnknown: () => void;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function FlashcardsResult({
  totalCards,
  knownCards,
  unknownCards,
  time,
  reviewMode,
  onReviewUnknown,
  onPlayAgain,
  onExit,
}: FlashcardsResultProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = Math.round((knownCards / totalCards) * 100);

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { text: 'Excellent!', color: 'text-green-600', emoji: '🌟' };
    if (percentage >= 75) return { text: 'Great Job!', color: 'text-blue-600', emoji: '⭐' };
    if (percentage >= 50) return { text: 'Good Effort!', color: 'text-yellow-600', emoji: '👍' };
    return { text: 'Keep Practicing!', color: 'text-orange-600', emoji: '💪' };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        <Card className="border-4 border-blue-200 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', duration: 0.8 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-6 shadow-lg">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {reviewMode ? 'Review Complete!' : 'Session Complete!'}
            </CardTitle>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={cn('text-2xl font-semibold mt-2', performance.color)}
            >
              {performance.emoji} {performance.text}
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="flex justify-center"
            >
              <div className="relative w-48 h-48">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className={cn(percentage >= 75 ? 'text-green-500' : 'text-blue-500')}
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100),
                    }}
                    transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-gray-800">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Known</div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-blue-500 rounded-full p-3">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-700">{totalCards}</div>
                    <div className="text-sm text-blue-600 font-medium">Cards Reviewed</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-green-500 rounded-full p-3">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-700">{knownCards}</div>
                    <div className="text-sm text-green-600 font-medium">Known</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-red-500 rounded-full p-3">
                        <XCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-700">{unknownCards}</div>
                    <div className="text-sm text-red-600 font-medium">Need Review</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Time */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center"
            >
              <Badge variant="outline" className="px-6 py-3 text-lg font-semibold">
                <Clock className="mr-2 h-5 w-5" />
                Time: {formatTime(time)}
              </Badge>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-3 pt-4"
            >
              {unknownCards > 0 && !reviewMode && (
                <Button
                  onClick={onReviewUnknown}
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Review {unknownCards} Unknown Card{unknownCards !== 1 ? 's' : ''}
                </Button>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={onPlayAgain} variant="outline" size="lg" className="flex-1">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Study Again
                </Button>
                <Button onClick={onExit} variant="outline" size="lg" className="flex-1">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Assignments
                </Button>
              </div>
            </motion.div>

            {/* Performance Tips */}
            {percentage < 75 && !reviewMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800"
              >
                <p className="font-semibold mb-1">💡 Study Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Review the "Need Review" cards again to improve retention</li>
                  <li>Try saying the answer out loud before flipping</li>
                  <li>Use the shuffle option to test yourself in random order</li>
                  <li>Take breaks between study sessions for better memory</li>
                </ul>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
