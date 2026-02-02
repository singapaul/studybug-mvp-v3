import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Home } from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { GameWithData, GameType } from '@/types/game';
import { saveGameAttempt } from '@/services/game-attempt.service';
import PairsGame from '@/components/games/pairs/PairsGame';
import FlashcardsGame from '@/components/games/flashcards/FlashcardsGame';
import SplatGame from '@/components/games/splat/SplatGame';
import SwipeGame from '@/components/games/swipe/SwipeGame';
import { toast } from 'sonner';

export default function PlayGame() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [game, setGame] = useState<GameWithData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = session?.student?.id || '';

  useEffect(() => {
    loadGameData();
  }, [assignmentId]);

  const loadGameData = async () => {
    if (!assignmentId) {
      setError('No assignment ID provided');
      setIsLoading(false);
      return;
    }

    try {
      // Load assignment
      const assignmentsData = localStorage.getItem('dev_assignments');
      if (!assignmentsData) {
        throw new Error('No assignments found');
      }

      const assignments = JSON.parse(assignmentsData);
      const foundAssignment = assignments.find((a: any) => a.id === assignmentId);

      if (!foundAssignment) {
        throw new Error('Assignment not found');
      }

      // Convert dates
      const assignmentWithDates = {
        ...foundAssignment,
        dueDate: foundAssignment.dueDate ? new Date(foundAssignment.dueDate) : null,
        createdAt: new Date(foundAssignment.createdAt),
        updatedAt: new Date(foundAssignment.updatedAt),
      };

      // Load game
      const gamesData = localStorage.getItem('dev_games');
      if (!gamesData) {
        throw new Error('No games found');
      }

      const games = JSON.parse(gamesData);
      const foundGame = games.find((g: any) => g.id === foundAssignment.gameId);

      if (!foundGame) {
        throw new Error('Game not found');
      }

      // Parse game data
      const gameWithData: GameWithData = {
        ...foundGame,
        gameData: JSON.parse(foundGame.gameData),
        createdAt: new Date(foundGame.createdAt),
        updatedAt: new Date(foundGame.updatedAt),
      };

      // Load group for display
      const groupsData = localStorage.getItem('dev_groups');
      if (groupsData) {
        const groups = JSON.parse(groupsData);
        const group = groups.find((g: any) => g.id === foundAssignment.groupId);
        if (group) {
          assignmentWithDates.group = {
            ...group,
            createdAt: new Date(group.createdAt),
            updatedAt: new Date(group.updatedAt),
          };
        }
      }

      assignmentWithDates.game = foundGame;
      setAssignment(assignmentWithDates);
      setGame(gameWithData);
    } catch (err: any) {
      console.error('Failed to load game:', err);
      setError(err.message || 'Failed to load game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameComplete = async (result: {
    scorePercentage: number;
    timeTaken: number;
    attemptData: any;
  }) => {
    try {
      await saveGameAttempt(
        assignmentId!,
        studentId,
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
            gameData={game.gameData as any}
            gameName={game.name}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.FLASHCARDS:
        return (
          <FlashcardsGame
            gameData={game.gameData as any}
            gameName={game.name}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.SPLAT:
        return (
          <SplatGame
            gameData={game.gameData as any}
            gameName={game.name}
            onComplete={handleGameComplete}
            onExit={handleExit}
          />
        );

      case GameType.SWIPE:
        return (
          <SwipeGame
            gameData={game.gameData as any}
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
