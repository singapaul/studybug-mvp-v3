import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, Gamepad2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { getMyGames } from '@/services/supabase/game.service';
import { createAssignment } from '@/services/supabase/assignment.service';
import { Game } from '@/types/game';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AssignGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  existingGameIds?: string[];
  onAssignmentCreated?: () => void;
}

export function AssignGameDialog({
  open,
  onOpenChange,
  groupId,
  groupName,
  existingGameIds = [],
  onAssignmentCreated,
}: AssignGameDialogProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [passPercentage, setPassPercentage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadGames();
      // Reset form
      setSelectedGameId('');
      setDueDate(undefined);
      setPassPercentage('');
    }
  }, [open]);

  const loadGames = async () => {
    try {
      setIsLoadingGames(true);
      const data = await getMyGames();
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
      toast.error('Failed to load games');
    } finally {
      setIsLoadingGames(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGameId) {
      toast.error('Please select a game');
      return;
    }

    try {
      setIsSubmitting(true);
      await createAssignment({
        gameId: selectedGameId,
        groupId,
        dueDate: dueDate || null,
        passPercentage: passPercentage ? parseInt(passPercentage) : null,
      });

      toast.success('Game assigned successfully!');
      onOpenChange(false);
      onAssignmentCreated?.();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to assign game');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableGames = games.filter((game) => !existingGameIds.includes(game.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Game to {groupName}</DialogTitle>
          <DialogDescription>
            Select a game to assign to this group. Students will be able to play it once assigned.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Game Selection */}
          <div className="space-y-3">
            <Label>Select Game *</Label>
            {isLoadingGames ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : availableGames.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-muted/50">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  {games.length === 0
                    ? 'No games created yet'
                    : 'All your games are already assigned to this group'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    // Navigate to create game page
                    window.location.href = '/tutor/games/create';
                  }}
                >
                  Create a Game
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedGameId} onValueChange={setSelectedGameId}>
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {availableGames.map((game) => (
                    <label
                      key={game.id}
                      className={cn(
                        'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-muted/50',
                        selectedGameId === game.id && 'bg-primary/5 border-primary'
                      )}
                    >
                      <RadioGroupItem value={game.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{game.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {game.gameType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {new Date(game.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedGameId === game.id && (
                        <Check className="h-5 w-5 text-primary mt-1" />
                      )}
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Due Date (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Set a deadline for students to complete this game
            </p>
          </div>

          {/* Pass Percentage (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="passPercentage">Pass Percentage (Optional)</Label>
            <Input
              id="passPercentage"
              type="number"
              min="0"
              max="100"
              value={passPercentage}
              onChange={(e) => setPassPercentage(e.target.value)}
              placeholder="e.g., 70"
            />
            <p className="text-xs text-muted-foreground">
              Minimum score percentage required to pass (0-100)
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedGameId}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Game
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
