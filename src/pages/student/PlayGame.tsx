import FlashcardsGame from '@/components/games/flashcards/FlashcardsGame';
import PairsGame from '@/components/games/pairs/PairsGame';
import SplatGame from '@/components/games/splat/SplatGame';
import SwipeGame from '@/components/games/swipe/SwipeGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { saveGameAttempt } from '@/services/supabase/game-attempt.service';
import { getAssignmentById } from '@/services/supabase/student.service';
import { Assignment } from '@/types/assignment';
import {
  GameType,
  GameWithData,
  PairsGameData,
  FlashcardsGameData,
  SplatGameData,
  SwipeGameData,
} from '@/types/game';
import { AlertCircle, Home } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function PlayGame() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [game, setGame] = useState<GameWithData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGameData = useCallback(async () => {
    if (!assignmentId) {
      setError('No assignment ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch assignment with game and group data from Supabase
      const assignmentData = await getAssignmentById(assignmentId);

      if (!assignmentData) {
        throw new Error('Assignment not found');
      }

      setAssignment(assignmentData);
      setGame(assignmentData.game);
    } catch (err: unknown) {
      console.error('Failed to load game:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load game. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  const handleGameComplete = async (result: {
    scorePercentage: number;
    timeTaken: number;
    attemptData: Record<string, unknown>;
  }) => {
    try {
      await saveGameAttempt(
        assignmentId!,
        result.scorePercentage,
        result.timeTaken,
        result.attemptData
      );

      toast.success('Game completed!', {
        description: `Score: ${Math.round(result.scorePercentage)}%`,
      });
    } catch (err) {
      console.error('Failed to save game attempt:', err);
      toast.error('Failed to save your progress');
    }
  };

  const handleExit = () => {
    navigate('/student/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !assignment || !game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-red-100 rounded-full p-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Unable to Load Game</h2>
            <p className="text-muted-foreground">
              {error || 'The game or assignment could not be found.'}
            </p>
            <Button onClick={handleExit} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render appropriate game component based on game type
  const renderGame = () => {
    switch (game.gameType) {
      case GameType.PAIRS:
        return (
          <PairsGame
            gameData={game.gameData as PairsGameData}
            gameName={game.name}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.FLASHCARDS:
        return (
          <FlashcardsGame
            gameData={game.gameData as FlashcardsGameData}
            gameName={game.name}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.SPLAT:
        return (
          <SplatGame
            gameData={game.gameData as SplatGameData}
            gameName={game.name}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.SWIPE:
        return (
          <SwipeGame
            gameData={game.gameData as SwipeGameData}
            gameName={game.name}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      // TODO: Add other game types here
      // case GameType.MULTIPLE_CHOICE:
      //   return <MultipleChoiceGame ... />
      // etc.

      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-yellow-100 rounded-full p-4">
                    <AlertCircle className="h-12 w-12 text-yellow-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Game Not Available</h2>
                <p className="text-muted-foreground">
                  The {game.gameType} game type is not yet implemented.
                </p>
                <Button onClick={handleExit} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return renderGame();
}
