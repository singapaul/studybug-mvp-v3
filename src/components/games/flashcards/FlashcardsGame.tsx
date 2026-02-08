import { useState, useEffect, useCallback, useRef } from 'react';
import { FlashcardsGameData, FlashcardItem } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Home,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import FlashcardCard from './FlashcardCard';
import FlashcardsResult from './FlashcardsResult';
import KeyboardShortcutsOverlay from './KeyboardShortcutsOverlay';

interface FlashcardsGameProps {
  gameData: FlashcardsGameData;
  gameName: string;
  onComplete: (result: { scorePercentage: number; timeTaken: number; attemptData: any }) => void;
  onExit: () => void;
}

interface CardProgress {
  cardId: string;
  known: boolean | null;
  viewed: boolean;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const STORAGE_KEY_PREFIX = 'flashcards_progress_';

export default function FlashcardsGame({
  gameData,
  gameName,
  onComplete,
  onExit,
}: FlashcardsGameProps) {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState<CardProgress[]>([]);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const storageKey = `${STORAGE_KEY_PREFIX}${gameName.replace(/\s/g, '_')}`;

  // Initialize or restore game
  useEffect(() => {
    if (!gameData || !gameData.cards || gameData.cards.length === 0) {
      console.error('Invalid game data:', gameData);
      return;
    }

    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress) {
      try {
        const saved = JSON.parse(savedProgress);
        setCards(saved.cards);
        setCurrentIndex(saved.currentIndex);
        setProgress(saved.progress);
        setTime(saved.time);
        setIsShuffled(saved.isShuffled);
        setIsGameActive(true);
      } catch (err) {
        console.error('Failed to restore progress:', err);
        initializeGame();
      }
    } else {
      initializeGame();
    }
  }, [gameData]);

  // Save progress to localStorage
  useEffect(() => {
    if (isGameActive && !isComplete && cards.length > 0) {
      try {
        const progressData = {
          cards,
          currentIndex,
          progress,
          time,
          isShuffled,
          lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(progressData));
      } catch (err) {
        console.warn('Failed to save progress:', err);
      }
    }
  }, [currentIndex, progress, time, isGameActive, isComplete, cards]);

  // Timer
  useEffect(() => {
    if (!isGameActive || isComplete) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isComplete]);

  // Keyboard shortcuts
  useEffect(() => {
    if (isComplete || showShortcuts) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === '1' && isFlipped) {
        e.preventDefault();
        handleAssessment(true);
      } else if (e.key === '2' && isFlipped) {
        e.preventDefault();
        handleAssessment(false);
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isFlipped, isComplete, showShortcuts]);

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    // Vertical swipe (flip)
    else if (Math.abs(deltaY) > 50) {
      handleFlip();
    }
  };

  const initializeGame = (shuffle = false) => {
    if (!gameData || !gameData.cards || gameData.cards.length === 0) {
      console.error('Cannot initialize game: invalid data');
      return;
    }

    const cardList = shuffle ? shuffleArray(gameData.cards) : [...gameData.cards];
    setCards(cardList);
    setProgress(
      cardList.map((card) => ({
        cardId: card.id,
        known: null,
        viewed: false,
      }))
    );
    setCurrentIndex(0);
    setIsFlipped(false);
    setTime(0);
    setIsGameActive(true);
    setIsComplete(false);
    setIsShuffled(shuffle);
    setReviewMode(false);

    // Only clear localStorage if not in preview mode
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.warn('Failed to clear localStorage:', err);
    }
  };

  const handleShuffle = () => {
    if (window.confirm('Shuffle cards and restart? Your current progress will be lost.')) {
      initializeGame(true);
    }
  };

  const handleFlip = () => {
    if (!progress[currentIndex].viewed) {
      const newProgress = [...progress];
      newProgress[currentIndex].viewed = true;
      setProgress(newProgress);
    }
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleAssessment = useCallback(
    (known: boolean) => {
      const newProgress = [...progress];
      newProgress[currentIndex].known = known;
      setProgress(newProgress);

      // Auto-advance to next card
      if (currentIndex < cards.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        }, 300);
      } else {
        // Check if all cards assessed
        const allAssessed = newProgress.every((p) => p.known !== null);
        if (allAssessed) {
          handleComplete();
        }
      }
    },
    [currentIndex, progress, cards.length]
  );

  const handleComplete = () => {
    setIsGameActive(false);
    setIsComplete(true);

    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.warn('Failed to clear localStorage:', err);
    }

    const knownCount = progress.filter((p) => p.known === true).length;
    const scorePercentage = cards.length > 0 ? (knownCount / cards.length) * 100 : 0;

    const result = {
      scorePercentage,
      timeTaken: time,
      attemptData: {
        totalCards: cards.length,
        knownCards: knownCount,
        unknownCards: progress.filter((p) => p.known === false).length,
        reviewedAll: progress.every((p) => p.known !== null),
      },
    };

    onComplete(result);
  };

  const handleReviewUnknown = () => {
    const unknownCards = cards.filter((card, index) => progress[index].known === false);

    if (unknownCards.length === 0) return;

    setCards(unknownCards);
    setProgress(
      unknownCards.map((card) => ({
        cardId: card.id,
        known: null,
        viewed: false,
      }))
    );
    setCurrentIndex(0);
    setIsFlipped(false);
    setTime(0);
    setIsGameActive(true);
    setIsComplete(false);
    setReviewMode(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Guard against invalid state
  if (!cards || cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Game</h2>
          <p className="text-muted-foreground mb-4">
            This flashcard set appears to be empty or invalid.
          </p>
          <Button onClick={onExit}>
            <Home className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercentage = ((currentIndex + 1) / cards.length) * 100;
  const assessedCount = progress.filter((p) => p.known !== null).length;
  const knownCount = progress.filter((p) => p.known === true).length;

  if (isComplete) {
    return (
      <FlashcardsResult
        totalCards={cards.length}
        knownCards={knownCount}
        unknownCards={progress.filter((p) => p.known === false).length}
        time={time}
        reviewMode={reviewMode}
        onReviewUnknown={handleReviewUnknown}
        onPlayAgain={() => initializeGame(isShuffled)}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background p-4">
      {/* Header */}
      <div className="container mx-auto max-w-4xl mb-6">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <h1 className="text-2xl font-bold">{gameName}</h1>
                {reviewMode && (
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-300"
                  >
                    Review Mode
                  </Badge>
                )}
              </div>
              {gameData.description && (
                <p className="text-sm text-muted-foreground">{gameData.description}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-base px-3 py-1">
                <Clock className="mr-2 h-4 w-4" />
                {formatTime(time)}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                disabled={assessedCount > 0}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(true)}>
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span className="text-muted-foreground">
                Assessed: {assessedCount}/{cards.length}
                {knownCount > 0 && ` (${Math.round((knownCount / assessedCount) * 100)}% known)`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Flashcard */}
      <div className="container mx-auto max-w-2xl mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <FlashcardCard
              front={currentCard.front}
              back={currentCard.back}
              frontImage={currentCard.frontImage}
              backImage={currentCard.backImage}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
          </motion.div>
        </AnimatePresence>

        {/* Self-Assessment (show when flipped) */}
        <AnimatePresence>
          {isFlipped && progress[currentIndex].known === null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-4 mt-6"
            >
              <Button
                onClick={() => handleAssessment(false)}
                variant="outline"
                size="lg"
                className="flex-1 h-auto py-4 border-2 border-red-200 hover:bg-red-50 hover:border-red-400"
              >
                <XCircle className="mr-2 h-5 w-5 text-red-600" />
                <div className="text-left">
                  <div className="font-semibold text-red-700">I didn't know this</div>
                  <div className="text-xs text-muted-foreground">Press 2</div>
                </div>
              </Button>

              <Button
                onClick={() => handleAssessment(true)}
                variant="outline"
                size="lg"
                className="flex-1 h-auto py-4 border-2 border-green-200 hover:bg-green-50 hover:border-green-400"
              >
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-green-700">I knew this</div>
                  <div className="text-xs text-muted-foreground">Press 1</div>
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {progress.map((p, idx) => (
              <div
                key={idx}
                className={cn(
                  'w-2 h-2 rounded-full',
                  idx === currentIndex && 'ring-2 ring-blue-500 ring-offset-2',
                  p.known === true && 'bg-green-500',
                  p.known === false && 'bg-red-500',
                  p.known === null && p.viewed && 'bg-blue-300',
                  p.known === null && !p.viewed && 'bg-gray-300'
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          <Button variant="ghost" onClick={onExit}>
            <Home className="mr-2 h-4 w-4" />
            Exit Session
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}
