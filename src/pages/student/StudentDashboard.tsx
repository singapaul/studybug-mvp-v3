import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Users,
  Trophy,
  Clock,
  Plus,
  Calendar,
  Target,
  TrendingUp,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Play,
  BarChart3,
  Flame,
  Gamepad2,
  ArrowRight,
} from 'lucide-react';
import { Group } from '@/types/group';
import { StudentAssignment, AssignmentFilter, AssignmentSort } from '@/types/assignment';
import { getMyGroups, getMyAssignments, getMyStats } from '@/services/supabase/student.service';
import JoinGroupDialog from '@/components/student/JoinGroupDialog';
import { StudentTestDataButton } from '@/components/dev/StudentTestDataButton';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const GAME_TYPE_LABELS: Record<string, string> = {
  PAIRS: 'Pairs',
  FLASHCARDS: 'Flashcards',
  MULTIPLE_CHOICE: 'Multiple Choice',
  SPLAT: 'Splat',
  SWIPE: 'Swipe',
};

const GAME_TYPE_COLORS: Record<string, string> = {
  PAIRS: 'bg-purple-100 text-purple-700 border-purple-200',
  FLASHCARDS: 'bg-blue-100 text-blue-700 border-blue-200',
  MULTIPLE_CHOICE: 'bg-green-100 text-green-700 border-green-200',
  SPLAT: 'bg-orange-100 text-orange-700 border-orange-200',
  SWIPE: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function StudentDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    averageScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [filter, setFilter] = useState<AssignmentFilter>('all');
  const [sort, setSort] = useState<AssignmentSort>('dueDate');

  const studentId = session?.student?.id || '';
  const studentEmail = session?.user.email || '';

  const loadData = async () => {
    if (!studentId) return;

    setIsLoading(true);
    try {
      const [groupsData, assignmentsData, statsData] = await Promise.all([
        getMyGroups(),
        getMyAssignments(filter, sort),
        getMyStats(),
      ]);

      setGroups(groupsData);
      setAssignments(assignmentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load student data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId, filter, sort]);

  const handleJoinSuccess = () => {
    loadData();
  };

  const handlePlayGame = (assignmentId: string) => {
    console.log('🎮 Navigating to game:', assignmentId);
    console.log('📍 URL:', `/student/play/${assignmentId}`);
    navigate(`/student/play/${assignmentId}`);
  };

  const getStatusBadge = (assignment: StudentAssignment) => {
    if (assignment.isCompleted) {
      const isPassing = assignment.isPassing !== undefined ? assignment.isPassing : true;
      return (
        <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {isPassing ? 'Passed' : 'Completed'}
        </Badge>
      );
    }

    if (assignment.isOverdue) {
      return (
        <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
          <AlertCircle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  };

  const formatDueDate = (dueDate: Date | null) => {
    if (!dueDate) return 'No due date';

    const now = new Date();
    const isOverdue = dueDate < now;
    const distance = formatDistanceToNow(dueDate, { addSuffix: true });

    return (
      <span className={cn('text-sm', isOverdue && 'text-red-600 font-medium')}>Due {distance}</span>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Student Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {session?.user.email.split('@')[0]}!
            </h1>
            <p className="text-lg opacity-90 mb-6 max-w-2xl">Continue your learning journey</p>

            {/* Join Code Button */}
            <Button
              onClick={() => setShowJoinDialog(true)}
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Enter Join Code
            </Button>
          </div>
        </div>

        {/* Motivational Stats & Quick Links */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </>
          ) : (
            <>
              {/* Streak Card */}
              <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <Flame className="h-5 w-5" />
                    Study Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-600">0</div>
                  <p className="text-sm text-muted-foreground mt-1">days in a row</p>
                </CardContent>
              </Card>

              {/* Games Played */}
              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Gamepad2 className="h-5 w-5" />
                    Games Played
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600">
                    {stats.completedAssignments}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">total completions</p>
                </CardContent>
              </Card>

              {/* Average Score */}
              <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Trophy className="h-5 w-5" />
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600">{stats.averageScore}%</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.averageScore >= 80 ? 'Excellent work!' : 'Keep practicing!'}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Upcoming Assignments & Recent Scores */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Assignments
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setFilter('pending')}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : assignments.filter((a) => !a.isCompleted).slice(0, 3).length > 0 ? (
                <div className="space-y-3">
                  {assignments
                    .filter((a) => !a.isCompleted)
                    .slice(0, 3)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handlePlayGame(assignment.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {assignment.game.gameType.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{assignment.game.name}</p>
                            <p className="text-xs text-muted-foreground">{assignment.group.name}</p>
                          </div>
                        </div>
                        {assignment.dueDate && (
                          <Badge variant={assignment.isOverdue ? 'destructive' : 'outline'}>
                            {formatDistanceToNow(assignment.dueDate, { addSuffix: true })}
                          </Badge>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {assignments.length === 0 ? 'No assignments yet' : 'All caught up!'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Scores */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Scores
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/student/scores')}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : assignments.filter((a) => a.bestScore !== undefined).slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {assignments
                    .filter((a) => a.bestScore !== undefined)
                    .slice(0, 5)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {assignment.bestScore! >= 90
                              ? '🏆'
                              : assignment.bestScore! >= 75
                                ? '🎯'
                                : '📚'}
                          </div>
                          <div>
                            <p className="font-medium">{assignment.game.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {assignment.attemptCount}{' '}
                              {assignment.attemptCount === 1 ? 'attempt' : 'attempts'}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            assignment.bestScore! >= 90
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : assignment.bestScore! >= 75
                                ? 'bg-blue-50 text-blue-700 border-blue-300'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                          )}
                        >
                          {assignment.bestScore}%
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground mb-3">No scores yet</p>
                  <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
                    Start Playing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="assignments">
              <Target className="mr-2 h-4 w-4" />
              My Assignments
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="mr-2 h-4 w-4" />
              My Groups
            </TabsTrigger>
          </TabsList>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            {/* Filters and Sort */}
            {!isLoading && assignments.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={filter === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('completed')}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={filter === 'overdue' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('overdue')}
                  >
                    Overdue
                  </Button>
                </div>

                <Select value={sort} onValueChange={(value) => setSort(value as AssignmentSort)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="gameType">Game Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Assignment Cards */}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : assignments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  {groups.length === 0 ? (
                    <>
                      <Users className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Join a Group to Get Started</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                        Enter a join code shared by your tutor to join a group and receive
                        assignments.
                      </p>
                      <Button onClick={() => setShowJoinDialog(true)} size="lg">
                        <Plus className="mr-2 h-4 w-4" />
                        Join Group
                      </Button>
                    </>
                  ) : (
                    <>
                      <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Assignments Yet</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-md">
                        Your tutor hasn't assigned any games yet. Check back soon!
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className={cn(
                      'hover:shadow-md transition-shadow',
                      assignment.isOverdue && !assignment.isCompleted && 'border-red-200'
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1">
                            {assignment.game.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-1">
                            {assignment.group.name}
                          </CardDescription>
                        </div>
                        {getStatusBadge(assignment)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <Badge
                          variant="outline"
                          className={GAME_TYPE_COLORS[assignment.game.gameType] || 'bg-gray-100'}
                        >
                          {GAME_TYPE_LABELS[assignment.game.gameType] || assignment.game.gameType}
                        </Badge>
                        {formatDueDate(assignment.dueDate)}
                      </div>

                      {assignment.bestScore !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            Best Score: {Math.round(assignment.bestScore)}%
                          </span>
                          {assignment.passPercentage && (
                            <span className="text-muted-foreground">
                              (Pass: {assignment.passPercentage}%)
                            </span>
                          )}
                        </div>
                      )}

                      {assignment.attemptCount > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {assignment.attemptCount} attempt
                          {assignment.attemptCount !== 1 ? 's' : ''}
                        </p>
                      )}

                      <Button
                        className="w-full"
                        variant={assignment.isCompleted ? 'outline' : 'default'}
                        onClick={() => handlePlayGame(assignment.id)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {assignment.isCompleted ? 'Play Again' : 'Play Now'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : groups.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Groups Yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                    Join a group using the join code provided by your tutor.
                  </p>
                  <Button onClick={() => setShowJoinDialog(true)} size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Join Your First Group
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {group.name}
                      </CardTitle>
                      <CardDescription>
                        {group.subjectArea && <span className="block">{group.subjectArea}</span>}
                        {group.ageRange && (
                          <span className="text-xs text-muted-foreground">
                            Age: {group.ageRange}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {group._count?.members || 0} members
                        </span>
                        <span className="text-muted-foreground">
                          {assignments.filter((a) => a.groupId === group.id).length} assignments
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Join Group Dialog */}
        <JoinGroupDialog
          open={showJoinDialog}
          onOpenChange={setShowJoinDialog}
          studentId={studentId}
          studentEmail={studentEmail}
          onSuccess={handleJoinSuccess}
        />

        {/* Dev Tool - Only visible in development */}
        <StudentTestDataButton studentId={studentId} onDataChanged={loadData} />
      </div>
    </DashboardLayout>
  );
}
