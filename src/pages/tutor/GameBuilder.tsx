import { useParams, useNavigate } from 'react-router-dom';
import { GameType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MultipleChoiceBuilder } from '@/components/games/MultipleChoiceBuilder';
import { PairsBuilder } from '@/components/games/PairsBuilder';
import { FlashcardsBuilder } from '@/components/games/FlashcardsBuilder';
import { SplatBuilder } from '@/components/games/SplatBuilder';
import { SwipeBuilder } from '@/components/games/SwipeBuilder';

export default function GameBuilder() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const gameType = type?.toUpperCase() as GameType;

  if (!gameType || !Object.values(GameType).includes(gameType)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Game Type</h2>
          <p className="text-muted-foreground mb-4">The selected game type is not supported.</p>
          <Button onClick={() => navigate('/tutor/games/create')}>
            Back to Game Selection
          </Button>
        </div>
      </div>
    );
  }

  const renderBuilder = () => {
    switch (gameType) {
      case GameType.MULTIPLE_CHOICE:
        return <MultipleChoiceBuilder />;
      case GameType.PAIRS:
        return <PairsBuilder />;
      case GameType.FLASHCARDS:
        return <FlashcardsBuilder />;
      case GameType.SPLAT:
        return <SplatBuilder />;
      case GameType.SWIPE:
        return <SwipeBuilder />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/tutor/games/create')}
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Builder Content */}
      <main className="container mx-auto px-4 py-6">
        {renderBuilder()}
      </main>
    </div>
  );
}
