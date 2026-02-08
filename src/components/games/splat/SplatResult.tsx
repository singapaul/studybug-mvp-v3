import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target, Clock, TrendingUp, RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SplatResultProps {
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  reactionTimes: number[];
  averageReactionTime: number;
  fastestReaction: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function SplatResult({
  totalQuestions,
  correctAnswers,
  totalScore,
  reactionTimes,
  averageReactionTime,
  fastestReaction,
  onPlayAgain,
  onExit,
}: SplatResultProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { text: 'Lightning Fast!', color: 'text-yellow-600', emoji: '⚡' };
    if (percentage >= 75) return { text: 'Sharp Reflexes!', color: 'text-orange-600', emoji: '🎯' };
    if (percentage >= 50) return { text: 'Getting Better!', color: 'text-blue-600', emoji: '👍' };
    return { text: 'Keep Practicing!', color: 'text-purple-600', emoji: '💪' };
  };

  const performance = getPerformanceLevel();

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-3xl"
      >
        <Card className="border-4 border-orange-300 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', duration: 0.8 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-gradient-to-br from-orange-400 to-red-600 rounded-full p-6 shadow-lg">
                <Zap className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Game Complete!
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
            {/* Score Display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-orange-600 mb-2">{totalScore}</div>
              <div className="text-lg text-muted-foreground">Total Points</div>
              <Badge variant="outline" className="mt-2 text-base px-4 py-2">
                {percentage}% Correct
              </Badge>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-blue-500 rounded-full p-2">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {correctAnswers}/{totalQuestions}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Correct</div>
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
                      <div className="bg-green-500 rounded-full p-2">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {formatTime(averageReactionTime)}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Avg Time</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-yellow-500 rounded-full p-2">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-700">
                      {formatTime(fastestReaction)}
                    </div>
                    <div className="text-xs text-yellow-600 font-medium">Fastest</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-purple-500 rounded-full p-2">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {Math.round(totalScore / totalQuestions)}
                    </div>
                    <div className="text-xs text-purple-600 font-medium">Avg/Q</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Reaction Time Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-muted/50 rounded-lg p-4"
            >
              <h3 className="font-semibold mb-3 text-center">Reaction Times</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {reactionTimes.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white rounded p-2"
                  >
                    <span className="text-muted-foreground">Q{index + 1}</span>
                    <span className="font-semibold">{formatTime(time)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Tips */}
            {percentage < 75 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-orange-50 rounded-lg p-4 text-sm text-orange-800"
              >
                <p className="font-semibold mb-1">💡 Tips to Improve:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Stay focused on the question before looking at answers</li>
                  <li>Click as soon as you spot the correct answer</li>
                  <li>Practice makes perfect - try again!</li>
                  <li>Take a deep breath and stay calm under time pressure</li>
                </ul>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Button
                onClick={onPlayAgain}
                size="lg"
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button onClick={onExit} variant="outline" size="lg" className="flex-1">
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
