import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Home, RotateCcw, X, TrendingUp } from 'lucide-react';

interface SwipeRecord {
  statementId: string;
  statement: string;
  direction: 'left' | 'right';
  correct: boolean;
  timestamp: number;
}

interface SwipeResultProps {
  totalQuestions: number;
  correctSwipes: number;
  incorrectSwipes: number;
  time: number;
  swipeHistory: SwipeRecord[];
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function SwipeResult({
  totalQuestions,
  correctSwipes,
  time,
  swipeHistory,
  onPlayAgain,
  onExit,
}: SwipeResultProps) {
  const scorePercentage = (correctSwipes / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = () => {
    if (scorePercentage >= 90)
      return { text: 'Outstanding!', color: 'text-yellow-600', emoji: '🏆' };
    if (scorePercentage >= 75) return { text: 'Excellent!', color: 'text-green-600', emoji: '🎯' };
    if (scorePercentage >= 60) return { text: 'Good Job!', color: 'text-blue-600', emoji: '👍' };
    return { text: 'Keep Practicing!', color: 'text-purple-600', emoji: '💪' };
  };

  const performance = getPerformanceLevel();
  const incorrectSwipes = swipeHistory.filter((s) => !s.correct);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h1 className={`text-4xl font-bold ${performance.color}`}>{performance.text}</h1>
          <p className="text-lg text-muted-foreground">
            You completed all {totalQuestions} questions!
          </p>
        </motion.div>

        {/* Score Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-4xl font-bold">{Math.round(scorePercentage)}%</div>
                    <p className="text-sm text-muted-foreground">
                      {correctSwipes}/{totalQuestions} correct
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Time Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div className="text-4xl font-bold font-mono">{formatTime(time)}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-4xl font-bold">{Math.round(scorePercentage)}%</div>
                    <p className="text-sm text-muted-foreground">
                      {incorrectSwipes.length} mistakes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Review Incorrect Swipes */}
        {incorrectSwipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  Review Incorrect Swipes ({incorrectSwipes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incorrectSwipes.map((swipe) => (
                    <div
                      key={swipe.statementId}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{swipe.statement}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-300"
                          >
                            You swiped: {swipe.direction === 'left' ? 'Wrong' : 'Correct'}
                          </Badge>
                          <span className="text-muted-foreground">
                            Should have swiped: {swipe.direction === 'left' ? 'right' : 'left'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Perfect Score Message */}
        {scorePercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
              <CardContent className="py-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Perfect Score!</h3>
                <p className="text-yellow-700">
                  You got every single question correct! Outstanding work!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tips for Improvement */}
        {scorePercentage < 75 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tips for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Take your time to read each question carefully before swiping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Review the incorrect swipes above to learn from mistakes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Practice makes perfect - try playing again to improve your score!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={onPlayAgain} size="lg" className="gap-2">
            <RotateCcw className="h-5 w-5" />
            Play Again
          </Button>
          <Button onClick={onExit} variant="outline" size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            Exit to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
