import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, X, Undo, Clock, Home, Trophy } from 'lucide-react';
import SwipeCard from './SwipeCard';
import SwipeResult from './SwipeResult';
import { SwipeGameData } from '@/types/game';

interface SwipeGameProps {
  gameData: SwipeGameData;
  gameName: string;
  onComplete: (result: {
    scorePercentage: number;
    timeTaken: number;
    attemptData: any;
  }) => void;
  onExit: () => void;
}

interface SwipeRecord {
  statementId: string;
  statement: string;
  direction: 'left' | 'right';
  correct: boolean;
  timestamp: number;
}

export default function SwipeGame({
  gameData,
  gameName,
  onComplete,
  onExit,
}: SwipeGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastSwipeCorrect, setLastSwipeCorrect] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  // Timer
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete]);

  // Haptic feedback (mobile)
  const triggerHaptic = useCallback((type: 'success' | 'error') => {
    if ('vibrate' in navigator) {
      if (type === 'success') {
        navigator.vibrate(50); // Short vibration
      } else {
        navigator.vibrate([50, 50, 50]); // Pattern for error
      }
    }
  }, []);

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (currentIndex >= gameData.items.length || showFeedback) return;

      const currentItem = gameData.items[currentIndex];
      // left = wrong/false, right = correct/true
      const correctDirection = currentItem.isCorrect ? 'right' : 'left';
      const isCorrect = direction === correctDirection;

      // Record the swipe
      const swipeRecord: SwipeRecord = {
        statementId: currentItem.id,
        statement: currentItem.statement,
        direction,
        correct: isCorrect,
        timestamp: Date.now(),
      };

      setSwipeHistory((prev) => [...prev, swipeRecord]);

      // Update score
      if (isCorrect) {
        setScore((prev) => prev + 1);
        triggerHaptic('success');
      } else {
        triggerHaptic('error');
      }

      // Show feedback
      setLastSwipeCorrect(isCorrect);
      setShowFeedback(true);
      setCanUndo(true);

      // Move to next question or complete
      setTimeout(() => {
        setShowFeedback(false);

        if (currentIndex === gameData.items.length - 1) {
          // Game complete
          handleComplete([...swipeHistory, swipeRecord]);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setCanUndo(false);
        }
      }, 800);
    },
    [currentIndex, gameData.items, showFeedback, swipeHistory, triggerHaptic]
  );

  const handleUndo = useCallback(() => {
    if (!canUndo || swipeHistory.length === 0) return;

    // Remove last swipe from history
    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));

    // Adjust score if last swipe was correct
    if (lastSwipe.correct) {
      setScore((prev) => prev - 1);
    }

    // Go back to previous question
    setCurrentIndex((prev) => prev - 1);
    setCanUndo(false);
    setShowFeedback(false);
  }, [canUndo, swipeHistory]);

  const handleComplete = (finalSwipeHistory: SwipeRecord[]) => {
    setIsComplete(true);

    const totalQuestions = gameData.items.length;
    const correctSwipes = finalSwipeHistory.filter((s) => s.correct).length;
    const scorePercentage = (correctSwipes / totalQuestions) * 100;

    const result = {
      scorePercentage,
      timeTaken: time,
      attemptData: {
        totalQuestions,
        correctSwipes,
        incorrectSwipes: totalQuestions - correctSwipes,
        swipes: finalSwipeHistory.map((s) => ({
          statementId: s.statementId,
          statement: s.statement,
          direction: s.direction,
          correct: s.correct,
        })),
      },
    };

    onComplete(result);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentIndex + 1) / gameData.items.length) * 100;

  // Guard against invalid data
  if (!gameData.items || gameData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Game</h2>
          <p className="text-muted-foreground mb-4">
            This swipe game appears to be empty or invalid.
          </p>
          <Button onClick={onExit}>
            <Home className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <SwipeResult
        totalQuestions={gameData.items.length}
        correctSwipes={score}
        incorrectSwipes={gameData.items.length - score}
        time={time}
        swipeHistory={swipeHistory}
        onPlayAgain={() => window.location.reload()}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{gameName}</h1>
              {gameData.description && (
                <p className="text-sm text-muted-foreground">{gameData.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-semibold">{formatTime(time)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">
                  {score}/{gameData.items.length}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentIndex + 1} of {gameData.items.length}
              </span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Swipe Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-[500px] max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showFeedback && currentIndex < gameData.items.length && (
              <SwipeCard
                key={gameData.items[currentIndex].id}
                statement={gameData.items[currentIndex].statement}
                image={gameData.items[currentIndex].image}
                onSwipe={handleSwipe}
                isActive={true}
              />
            )}
          </AnimatePresence>

          {/* Feedback Overlay */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center z-50"
              >
                <div
                  className={`rounded-full p-12 ${
                    lastSwipeCorrect
                      ? 'bg-green-500 shadow-green-500/50'
                      : 'bg-red-500 shadow-red-500/50'
                  } shadow-2xl`}
                >
                  {lastSwipeCorrect ? (
                    <Check className="h-32 w-32 text-white stroke-[3]" />
                  ) : (
                    <X className="h-32 w-32 text-white stroke-[3]" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <span>Swipe left for Wrong/False</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <span>Swipe right for Correct/True</span>
            </div>
          </div>

          {/* Undo Button */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleUndo}
              disabled={!canUndo}
              className="gap-2"
            >
              <Undo className="h-4 w-4" />
              Undo Last Swipe
            </Button>

            <Button variant="ghost" onClick={onExit} className="gap-2">
              <Home className="h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
