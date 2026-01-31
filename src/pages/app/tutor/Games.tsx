import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoData } from '@/hooks/useDemoData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Gamepad2, Play, Pencil, Copy, Trash2, FileText, Layers } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export default function Games() {
  const { games, deleteGame, duplicateGame } = useDemoData();
  const { toast } = useToast();

  const handleDuplicate = (id: string) => {
    const newGame = duplicateGame(id);
    if (newGame) {
      toast({
        title: 'Game duplicated',
        description: `${newGame.name} has been created`,
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    deleteGame(id);
    toast({
      title: 'Game deleted',
      description: `${name} has been deleted`,
    });
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return <FileText className="w-4 h-4" />;
      case 'flashcards':
        return <Layers className="w-4 h-4" />;
      default:
        return <Gamepad2 className="w-4 h-4" />;
    }
  };

  const getGameTypeBadge = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'flashcards':
        return 'Flashcards';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Games</h1>
          <p className="text-muted-foreground">Create and manage your revision games</p>
        </div>
        <Button asChild>
          <Link to="/app/tutor/games/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Game
          </Link>
        </Button>
      </div>

      {games.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No games yet</h3>
            <p className="text-muted-foreground mb-4">Create your first revision game</p>
            <Button asChild>
              <Link to="/app/tutor/games/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Game
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {getGameTypeIcon(game.type)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/app/tutor/games/${game.id}/edit`}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(game.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {game.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the game. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(game.id, game.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-semibold text-foreground mb-1">{game.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {game.description || `${game.questions.length} questions`}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{getGameTypeBadge(game.type)}</Badge>
                  <Badge variant="outline">{game.questions.length} questions</Badge>
                  {game.timesAssigned > 0 && (
                    <Badge variant="outline">Assigned {game.timesAssigned}x</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/app/tutor/games/${game.id}/edit`}>
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/app/tutor/games/${game.id}/preview`}>
                      <Play className="w-3 h-3 mr-1" />
                      Preview
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
