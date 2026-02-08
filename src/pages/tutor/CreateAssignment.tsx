import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  Search,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Gamepad2,
  Users,
  ListChecks,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { getMyGames } from '@/services/supabase/game.service';
import { getMyGroups } from '@/services/supabase/group.service';
import { createAssignment } from '@/services/supabase/assignment.service';
import { Game, GameType } from '@/types/game';
import { Group } from '@/types/group';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const GAME_TYPE_COLORS = {
  PAIRS: 'bg-blue-100 text-blue-700 border-blue-200',
  FLASHCARDS: 'bg-purple-100 text-purple-700 border-purple-200',
  MULTIPLE_CHOICE: 'bg-green-100 text-green-700 border-green-200',
  SPLAT: 'bg-orange-100 text-orange-700 border-orange-200',
  SWIPE: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data
  const [games, setGames] = useState<Game[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameType, setSelectedGameType] = useState<string>('all');

  // Form state
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [passPercentage, setPassPercentage] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [gamesData, groupsData] = await Promise.all([getMyGames(), getMyGroups()]);
      setGames(gamesData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load games and groups');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter games based on search and game type
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      searchQuery === '' ||
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.gameType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedGameType === 'all' || game.gameType === selectedGameType;

    return matchesSearch && matchesType;
  });

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedGameId) {
      toast.error('Please select a game');
      return;
    }

    if (selectedGroupIds.length === 0) {
      toast.error('Please select at least one group');
      return;
    }

    if (passPercentage && (parseInt(passPercentage) < 0 || parseInt(passPercentage) > 100)) {
      toast.error('Pass percentage must be between 0 and 100');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create assignments for each selected group
      const assignmentPromises = selectedGroupIds.map((groupId) =>
        createAssignment({
          gameId: selectedGameId,
          groupId,
          dueDate: dueDate || null,
          passPercentage: passPercentage ? parseInt(passPercentage) : null,
        })
      );

      await Promise.all(assignmentPromises);

      const selectedGame = games.find((g) => g.id === selectedGameId);
      toast.success(
        `Successfully assigned "${selectedGame?.name}" to ${selectedGroupIds.length} group${selectedGroupIds.length > 1 ? 's' : ''}!`
      );

      navigate('/tutor/dashboard');
    } catch (error) {
      console.error('Error creating assignments:', error);
      toast.error('Failed to create assignments');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedGame = games.find((g) => g.id === selectedGameId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (games.length === 0 || groups.length === 0) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/tutor/dashboard')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="border-destructive">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-center">Cannot Create Assignment</CardTitle>
              <CardDescription className="text-center">
                {games.length === 0 && groups.length === 0
                  ? 'You need to create at least one game and one group before creating assignments.'
                  : games.length === 0
                    ? 'You need to create at least one game before creating assignments.'
                    : 'You need to create at least one group before creating assignments.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-center">
              {games.length === 0 && (
                <Button onClick={() => navigate('/tutor/games/create')}>
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Create Game
                </Button>
              )}
              {groups.length === 0 && (
                <Button onClick={() => navigate('/tutor/groups')} variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/tutor/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Create Assignment</h1>
          <p className="text-muted-foreground mt-1">
            Assign a game to one or more groups with optional deadlines
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Game Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Select Game
                </CardTitle>
                <CardDescription>Choose a game to assign to your groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search games by name or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedGameType} onValueChange={setSelectedGameType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value={GameType.PAIRS}>Pairs</SelectItem>
                      <SelectItem value={GameType.FLASHCARDS}>Flashcards</SelectItem>
                      <SelectItem value={GameType.MULTIPLE_CHOICE}>Multiple Choice</SelectItem>
                      <SelectItem value={GameType.SPLAT}>Splat</SelectItem>
                      <SelectItem value={GameType.SWIPE}>Swipe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Games List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredGames.length === 0 ? (
                    <div className="text-center py-8">
                      <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        {searchQuery || selectedGameType !== 'all'
                          ? 'No games match your search'
                          : 'No games available'}
                      </p>
                    </div>
                  ) : (
                    filteredGames.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setSelectedGameId(game.id)}
                        className={cn(
                          'w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md',
                          selectedGameId === game.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{game.name}</h3>
                              {selectedGameId === game.id && (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Created {format(new Date(game.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              GAME_TYPE_COLORS[game.gameType as keyof typeof GAME_TYPE_COLORS]
                            }
                          >
                            {game.gameType}
                          </Badge>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Groups and Settings */}
          <div className="space-y-6">
            {/* Group Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Groups
                </CardTitle>
                <CardDescription>Assign to one or multiple groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {groups.map((group) => (
                    <label
                      key={group.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                        selectedGroupIds.includes(group.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Checkbox
                        checked={selectedGroupIds.includes(group.id)}
                        onCheckedChange={() => handleGroupToggle(group.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {group._count?.members || 0} students • {group.joinCode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assignment Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  Settings
                </CardTitle>
                <CardDescription>Optional assignment configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Due Date */}
                <div className="space-y-2">
                  <Label>Due Date (Optional)</Label>
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
                </div>

                {/* Pass Percentage */}
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
                    Minimum score percentage to pass (0-100)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {(selectedGameId || selectedGroupIds.length > 0) && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {selectedGame && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Game:</span>
                      <span className="font-medium">{selectedGame.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Groups:</span>
                    <span className="font-medium">{selectedGroupIds.length} selected</span>
                  </div>
                  {dueDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">{format(dueDate, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {passPercentage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pass %:</span>
                      <span className="font-medium">{passPercentage}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedGameId || selectedGroupIds.length === 0 || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Assignments...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Create Assignment{selectedGroupIds.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
