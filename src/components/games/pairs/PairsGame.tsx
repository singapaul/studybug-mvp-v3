import { useState, useEffect, useCallback } from 'react';
import { PairsGameData, PairsItem } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Undo2, Trophy, Star, Home, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import PairsCard from './PairsCard';
import PairsResultScreen from './PairsResultScreen';

interface PairsGameProps {
  gameData: PairsGameData;
  gameName: string;
  onComplete: (result: { scorePercentage: number; timeTaken: number; attemptData: any }) => void;
  onExit: () => void;
}

interface GameCard {
  id: string;
  content: string;
  image?: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PairsGame({ gameData, gameName, onComplete, onExit }: PairsGameProps) {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [gameData]);

  // Timer
  useEffect(() => {
    if (!isGameActive || isGameComplete) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isGameComplete]);

  // Check for game completion
  useEffect(() => {
    if (cards.length === 0) return;

    const allMatched = cards.every((card) => card.isMatched);
    if (allMatched && isGameActive) {
      handleGameComplete();
    }
  }, [cards, isGameActive]);

  const initializeGame = () => {
    // Create cards from pairs
    const gameCards: GameCard[] = [];

    gameData.items.forEach((item: PairsItem) => {
      // Left card
      gameCards.push({
        id: `${item.id}-left`,
        content: item.leftText,
        image: item.leftImage,
        pairId: item.id,
        isFlipped: false,
        isMatched: false,
      });

      // Right card
      gameCards.push({
        id: `${item.id}-right`,
        content: item.rightText,
        image: item.rightImage,
        pairId: item.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffled = shuffleArray(gameCards);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsGameActive(true);
    setIsGameComplete(false);
    setIsChecking(false);
  };

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (isChecking) return;
      if (flippedCards.length >= 2) return;
      if (flippedCards.includes(cardId)) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isMatched) return;

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      // Update card state
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));

      // Check for match when 2 cards are flipped
      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1);
        checkForMatch(newFlippedCards);
      }
    },
    [cards, flippedCards, isChecking]
  );

  const checkForMatch = (flippedIds: string[]) => {
    setIsChecking(true);

    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (!firstCard || !secondCard) {
      setIsChecking(false);
      return;
    }

    const isMatch = firstCard.pairId === secondCard.pairId;

    if (isMatch) {
      // Match found - keep cards flipped
      setCards((prev) =>
        prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
      );
      setFlippedCards([]);
      setIsChecking(false);
    } else {
      // No match - flip cards back after delay
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
        );
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const handleGameComplete = () => {
    setIsGameActive(false);
    setIsGameComplete(true);

    // Calculate score and save
    const result = {
      scorePercentage: 100, // Always 100% when completed
      timeTaken: time,
      attemptData: {
        moves,
        pairs: gameData.items.length,
        perfectGame: moves === gameData.items.length, // True if completed in minimum moves
      },
    };

    onComplete(result);
  };

  const handleRestart = () => {
    initializeGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate grid columns based on number of cards
  const getGridColumns = () => {
    const cardCount = cards.length;
    if (cardCount <= 4) return 2; // 2x2
    if (cardCount <= 12) return 4; // 4x3 or 4x4
    return 6; // 6x6
  };

  const gridCols = getGridColumns();
  const matchedPairs = cards.filter((c) => c.isMatched).length / 2;
  const totalPairs = gameData.items.length;

  // Calculate star rating based on efficiency
  const getStarRating = () => {
    const perfectMoves = totalPairs;
    if (moves === perfectMoves) return 3;
    if (moves <= perfectMoves * 1.5) return 2;
    return 1;
  };

  if (isGameComplete) {
    return (
      <PairsResultScreen
        moves={moves}
        time={time}
        totalPairs={totalPairs}
        starRating={getStarRating()}
        onPlayAgain={handleRestart}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background p-4">
      {/* Header */}
      <div className="container mx-auto max-w-6xl mb-6">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{gameName}</h1>
              {gameData.description && (
                <p className="text-sm text-muted-foreground">{gameData.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-base px-3 py-1">
                <Trophy className="mr-2 h-4 w-4" />
                {matchedPairs}/{totalPairs}
              </Badge>

              <Badge variant="outline" className="text-base px-3 py-1">
                <Undo2 className="mr-2 h-4 w-4" />
                {moves}
              </Badge>

              <Badge variant="outline" className="text-base px-3 py-1">
                <Clock className="mr-2 h-4 w-4" />
                {formatTime(time)}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Game Grid */}
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className={cn(
            'grid gap-4 justify-center',
            gridCols === 2 && 'grid-cols-2',
            gridCols === 4 && 'grid-cols-2 sm:grid-cols-4',
            gridCols === 6 && 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <PairsCard
                  id={card.id}
                  content={card.content}
                  image={card.image}
                  isFlipped={card.isFlipped}
                  isMatched={card.isMatched}
                  onClick={handleCardClick}
                  disabled={isChecking || card.isMatched}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
          <Button variant="outline" onClick={onExit}>
            <Home className="mr-2 h-4 w-4" />
            Exit Game
          </Button>
        </div>
      </div>
    </div>
  );
}
