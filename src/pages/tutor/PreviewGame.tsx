import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { GameWithData, GameType } from '@/types/game';
import { getGameById } from '@/services/supabase/game.service';
import PairsGame from '@/components/games/pairs/PairsGame';
import FlashcardsGame from '@/components/games/flashcards/FlashcardsGame';
import SplatGame from '@/components/games/splat/SplatGame';
import SwipeGame from '@/components/games/swipe/SwipeGame';
import { toast } from 'sonner';

export default function PreviewGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  const [game, setGame] = useState<GameWithData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGameData = useCallback(async () => {
    if (!gameId) {
      setError('No game ID provided');
      setIsLoading(false);
      return;
    }

    if (!session?.user?.id) {
      setError('Not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      // Load game
      const gameData = await getGameById(gameId);

      if (!gameData) {
        throw new Error('Game not found');
      }

      // Verify this tutor owns the game
      if (gameData.userId !== session.user.id) {
        throw new Error('You do not have permission to view this game');
      }

      setGame(gameData);
    } catch (err) {
      console.error('Failed to load game:', err);
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setIsLoading(false);
    }
  }, [gameId, session]);

  useEffect(() => {
    // Wait for auth to load before loading game data
    if (!authLoading && session) {
      loadGameData();
    } else if (!authLoading && !session) {
      // Not authenticated, redirect
      navigate('/');
    }
  }, [authLoading, session, loadGameData, navigate]);

  const handleGameComplete = async (result: {
    scorePercentage: number;
    timeTaken: number;
    attemptData: any;
  }) => {
    // For preview mode, just show the result - don't save
    toast.success('Preview completed!', {
      description: `Score: ${Math.round(result.scorePercentage)}% | Time: ${result.timeTaken}s | Moves: ${result.attemptData.moves}`,
    });
  };

  const handleExit = () => {
    navigate('/tutor/games');
  };

  // Show loading while auth is initializing
  if (authLoading || isLoading) {
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

  if (error || !game) {
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
              {error || 'The game could not be found.'}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleExit} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </div>
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
            gameData={game.gameData as any}
            gameName={`${game.name} (Preview)`}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.FLASHCARDS:
        return (
          <FlashcardsGame
            gameData={game.gameData as any}
            gameName={`${game.name} (Preview)`}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.SPLAT:
        return (
          <SplatGame
            gameData={game.gameData as any}
            gameName={`${game.name} (Preview)`}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.SWIPE:
        return (
          <SwipeGame
            gameData={game.gameData as any}
            gameName={`${game.name} (Preview)`}
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
                <h2 className="text-2xl font-bold">Preview Not Available</h2>
                <p className="text-muted-foreground">
                  The {game.gameType} game type preview is not yet implemented.
                </p>
                <Button onClick={handleExit} className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Games
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <>
      {/* Preview Banner */}
      <div className="bg-yellow-100 border-b-2 border-yellow-300 py-2 px-4 text-center">
        <p className="text-sm font-medium text-yellow-800">
          🔍 Preview Mode - Game results will not be saved
        </p>
      </div>
      {renderGame()}
    </>
  );
}
