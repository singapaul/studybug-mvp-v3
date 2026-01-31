import { useState, useEffect, useCallback, useRef } from 'react';
import { SplatGameData, SplatItem } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Zap, Home, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import SplatButton from './SplatButton';
import SplatResult from './SplatResult';
import ParticleEffect from './ParticleEffect';
import { playSound, initializeSounds, toggleMute, isMuted } from './soundEffects';

interface SplatGameProps {
  gameData: SplatGameData;
  gameName: string;
  onComplete: (result: {
    scorePercentage: number;
    timeTaken: number;
    attemptData: any;
  }) => void;
  onExit: () => void;
}

interface QuestionState {
  question: string;
  correctAnswer: string;
  answers: string[];
  image?: string;
  startTime: number;
}

interface QuestionResult {
  questionId: string;
  correct: boolean;
  reactionTime: number;
  points: number;
  timedOut: boolean;
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Calculate points based on reaction time
function calculatePoints(reactionTime: number, timeLimit: number): number {
  const basePoints = 100;
  const speedBonus = Math.max(0, Math.floor((timeLimit - reactionTime) / timeLimit * 50));
  return basePoints + speedBonus;
}

export default function SplatGame({
  gameData,
  gameName,
  onComplete,
  onExit,
}: SplatGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const timeLimit = gameData.timeLimit || 10;

  // Initialize sounds
  useEffect(() => {
    initializeSounds();
  }, []);

  // Initialize game
  useEffect(() => {
    if (gameData.items.length > 0) {
      startQuestion(0);
      setIsGameActive(true);
    }
  }, [gameData]);

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || isComplete || showCorrectAnswer) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        if (prev <= 3) {
          playSound('tick');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, isComplete, showCorrectAnswer, currentQuestionIndex]);

  const startQuestion = (index: number) => {
    if (index >= gameData.items.length) {
      handleComplete();
      return;
    }

    const item = gameData.items[index];

    // Generate wrong answers (shuffle other correct answers)
    const otherAnswers = gameData.items
      .filter((_, i) => i !== index)
      .map((item) => item.answer);

    const shuffledWrong = shuffleArray(otherAnswers).slice(0, 2); // Take 2-5 wrong answers
    const allAnswers = shuffleArray([item.answer, ...shuffledWrong]);

    const questionState: QuestionState = {
      question: item.question,
      correctAnswer: item.answer,
      answers: allAnswers,
      image: item.image,
      startTime: Date.now(),
    };

    setCurrentQuestion(questionState);
    setTimeLeft(timeLimit);
    setShowCorrectAnswer(false);
    setSelectedAnswer(null);
    startTimeRef.current = Date.now();
  };

  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    playSound('wrong');

    const result: QuestionResult = {
      questionId: gameData.items[currentQuestionIndex].id,
      correct: false,
      reactionTime: timeLimit * 1000,
      points: 0,
      timedOut: true,
    };

    setResults((prev) => [...prev, result]);
    setShowCorrectAnswer(true);

    // Show correct answer briefly, then move to next
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
      startQuestion(currentQuestionIndex + 1);
    }, 2000);
  };

  const handleAnswer = useCallback(
    (answer: string, position: { x: number; y: number }) => {
      if (!currentQuestion || showCorrectAnswer) return;

      if (timerRef.current) clearInterval(timerRef.current);

      const reactionTime = Date.now() - startTimeRef.current;
      const isCorrect = answer === currentQuestion.correctAnswer;

      setSelectedAnswer(answer);

      if (isCorrect) {
        playSound('splat');

        // Add particle effect
        const particleId = Date.now();
        setParticles((prev) => [...prev, { id: particleId, x: position.x, y: position.y }]);
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== particleId));
        }, 1000);

        const points = calculatePoints(reactionTime, timeLimit * 1000);
        setTotalScore((prev) => prev + points);

        const result: QuestionResult = {
          questionId: gameData.items[currentQuestionIndex].id,
          correct: true,
          reactionTime,
          points,
          timedOut: false,
        };

        setResults((prev) => [...prev, result]);

        // Move to next question after animation
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          startQuestion(currentQuestionIndex + 1);
        }, 800);
      } else {
        playSound('wrong');

        const result: QuestionResult = {
          questionId: gameData.items[currentQuestionIndex].id,
          correct: false,
          reactionTime,
          points: -10, // Penalty
          timedOut: false,
        };

        setResults((prev) => [...prev, result]);
        setTotalScore((prev) => Math.max(0, prev - 10));

        // Show shake animation, then show correct answer
        setTimeout(() => {
          setShowCorrectAnswer(true);
          setTimeout(() => {
            setCurrentQuestionIndex((prev) => prev + 1);
            startQuestion(currentQuestionIndex + 1);
          }, 1500);
        }, 500);
      }
    },
    [currentQuestion, showCorrectAnswer, currentQuestionIndex, timeLimit]
  );

  const handleComplete = () => {
    setIsGameActive(false);
    setIsComplete(true);

    const correctAnswers = results.filter((r) => r.correct).length;
    const scorePercentage = (correctAnswers / gameData.items.length) * 100;
    const totalTime = results.reduce((sum, r) => sum + r.reactionTime, 0);

    const result = {
      scorePercentage,
      timeTaken: Math.floor(totalTime / 1000),
      attemptData: {
        totalQuestions: gameData.items.length,
        correctAnswers,
        totalScore,
        reactionTimes: results.map((r) => r.reactionTime),
        scores: results.map((r) => r.points),
        averageReactionTime: totalTime / results.length,
        fastestReaction: Math.min(...results.map((r) => r.reactionTime)),
      },
    };

    onComplete(result);
  };

  const toggleSound = () => {
    toggleMute();
    setSoundEnabled(!soundEnabled);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / gameData.items.length) * 100;
  const timePercentage = (timeLeft / timeLimit) * 100;

  if (isComplete) {
    return (
      <SplatResult
        totalQuestions={gameData.items.length}
        correctAnswers={results.filter((r) => r.correct).length}
        totalScore={totalScore}
        reactionTimes={results.map((r) => r.reactionTime)}
        averageReactionTime={results.reduce((sum, r) => sum + r.reactionTime, 0) / results.length}
        fastestReaction={Math.min(...results.map((r) => r.reactionTime))}
        onPlayAgain={() => window.location.reload()}
        onExit={onExit}
      />
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <ParticleEffect key={particle.id} x={particle.x} y={particle.y} />
        ))}
      </AnimatePresence>

      {/* Header */}
      <div className="container mx-auto max-w-6xl p-4">
        <Card className="p-4 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <h1 className="text-2xl font-bold">{gameName}</h1>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-base px-3 py-1">
                  Question {currentQuestionIndex + 1}/{gameData.items.length}
                </Badge>
                <Badge variant="outline" className="text-base px-3 py-1">
                  Score: {totalScore}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSound}
                className="w-10 h-10 p-0"
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={onExit}>
                <Home className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          </div>

          <Progress value={progressPercentage} className="h-2 mt-4" />
        </Card>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 mb-6 shadow-xl border-4 border-orange-300">
            {currentQuestion.image && (
              <div className="w-full max-h-48 flex items-center justify-center mb-4">
                <img
                  src={currentQuestion.image}
                  alt="Question"
                  className="max-w-full max-h-48 object-contain rounded-lg"
                />
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-800">
              {currentQuestion.question}
            </h2>

            {/* Timer */}
            <div className="flex items-center justify-center gap-3">
              <Clock className={cn(
                'h-6 w-6',
                timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-orange-600'
              )} />
              <div className={cn(
                'text-5xl font-bold',
                timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-orange-600'
              )}>
                {timeLeft}
              </div>
            </div>

            <Progress
              value={timePercentage}
              className={cn(
                'h-3 mt-4',
                timeLeft <= 3 && 'bg-red-100'
              )}
            />
          </Card>
        </motion.div>
      </div>

      {/* Answer Buttons (Random Positioning) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="relative w-full h-full pointer-events-none">
          <AnimatePresence mode="wait">
            {currentQuestion.answers.map((answer, index) => (
              <SplatButton
                key={`${currentQuestionIndex}-${answer}`}
                answer={answer}
                index={index}
                totalAnswers={currentQuestion.answers.length}
                isCorrect={answer === currentQuestion.correctAnswer}
                isSelected={selectedAnswer === answer}
                showCorrect={showCorrectAnswer}
                onSelect={handleAnswer}
                disabled={showCorrectAnswer || selectedAnswer !== null}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
