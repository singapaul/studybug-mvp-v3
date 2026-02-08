import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getMyGames } from '@/services/supabase/game.service';
import { Game, GameType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Gamepad2, Loader2, LayoutGrid, BookOpen, CheckCircle, Zap, Move } from 'lucide-react';
import { getTemplateColor, getTemplateName } from '@/lib/game-templates';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

const GAME_TYPE_ICONS: Record<GameType, any> = {
  [GameType.PAIRS]: LayoutGrid,
  [GameType.FLASHCARDS]: BookOpen,
  [GameType.MULTIPLE_CHOICE]: CheckCircle,
  [GameType.SPLAT]: Zap,
  [GameType.SWIPE]: Move,
};

export default function Games() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<GameType | 'ALL'>('ALL');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    if (!session?.tutor) return;

    try {
      setIsLoading(true);
      const data = await getMyGames(session.tutor.id);
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
      toast.error('Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGames = filterType === 'ALL'
    ? games
    : games.filter((g) => g.gameType === filterType);

  const getGameTypeCounts = () => {
    const counts: Record<string, number> = {
      ALL: games.length,
    };

    Object.values(GameType).forEach((type) => {
      counts[type] = games.filter((g) => g.gameType === type).length;
    });

    return counts;
  };

  const counts = getGameTypeCounts();

  const GameCard = ({ game }: { game: Game }) => {
    const Icon = GAME_TYPE_ICONS[game.gameType];
    const colorClass = getTemplateColor(game.gameType);

    return (
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => navigate(`/tutor/games/${game.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
              <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {game.name}
              </CardTitle>
              <Badge variant="secondary" className="mt-1">
                {getTemplateName(game.gameType)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {game._count?.assignments || 0} assignment{game._count?.assignments !== 1 ? 's' : ''}
            </span>
            <span className="text-muted-foreground">
              {new Date(game.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Games</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage learning games for your students
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/tutor/games/create')}>
              <Plus className="mr-2 h-5 w-5" />
              Create Game
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as GameType | 'ALL')}>
          <TabsList className="mb-6">
            <TabsTrigger value="ALL">All ({counts.ALL})</TabsTrigger>
            <TabsTrigger value={GameType.PAIRS}>Pairs ({counts.PAIRS})</TabsTrigger>
            <TabsTrigger value={GameType.FLASHCARDS}>Flashcards ({counts.FLASHCARDS})</TabsTrigger>
            <TabsTrigger value={GameType.MULTIPLE_CHOICE}>Quiz ({counts.MULTIPLE_CHOICE})</TabsTrigger>
            <TabsTrigger value={GameType.SPLAT}>Splat ({counts.SPLAT})</TabsTrigger>
            <TabsTrigger value={GameType.SWIPE}>Swipe ({counts.SWIPE})</TabsTrigger>
          </TabsList>

          <TabsContent value={filterType}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredGames.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="rounded-full bg-muted p-6 mb-6">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  {filterType === 'ALL' ? 'No games yet' : `No ${getTemplateName(filterType as GameType)} games yet`}
                </h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {filterType === 'ALL'
                    ? 'Create your first game to start building engaging learning activities for your students.'
                    : `Create a ${getTemplateName(filterType as GameType)} game to get started.`}
                </p>
                <Button size="lg" onClick={() => navigate('/tutor/games/create')}>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Game
                </Button>
              </div>
            ) : (
              // Games Grid
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
