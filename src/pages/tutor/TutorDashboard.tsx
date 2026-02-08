import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Users,
  Gamepad2,
  ListChecks,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
} from 'lucide-react';
import { getMyGroups } from '@/services/supabase/group.service';
import { getMyGames } from '@/services/supabase/game.service';
import { format } from 'date-fns';
import { TutorTestDataButton } from '@/components/dev/TutorTestDataButton';

const GAME_TYPE_ICONS = {
  PAIRS: '🎴',
  FLASHCARDS: '📚',
  SPLAT: '💥',
  MULTIPLE_CHOICE: '✅',
  SWIPE: '👆',
};

export default function TutorDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalGames: 0,
    totalStudents: 0,
    totalAssignments: 0,
  });
  const [groups, setGroups] = useState<any[]>([]);
  const [recentGames, setRecentGames] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    if (!session?.tutor?.id) return;

    setLoading(true);
    try {
      const [groupsData, gamesData] = await Promise.all([getMyGroups(), getMyGames()]);

      // Calculate stats
      const totalStudents = groupsData.reduce(
        (sum: number, g: any) => sum + (g.memberCount || 0),
        0
      );

      setStats({
        totalGroups: groupsData.length,
        totalGames: gamesData.length,
        totalStudents,
        totalAssignments: 0, // Will be calculated from assignments when available
      });

      setGroups(groupsData.slice(0, 5)); // Show top 5
      setRecentGames(gamesData.slice(0, 3)); // Show 3 recent games
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasData = stats.totalGroups > 0 || stats.totalGames > 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Tutor Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {session?.user.email.split('@')[0]}!
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Create engaging learning experiences and track your students' progress
            </p>

            {/* Quick Stats */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg bg-white/20" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm opacity-90">Groups</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.totalGroups}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gamepad2 className="h-5 w-5" />
                    <span className="text-sm opacity-90">Games</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.totalGames}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5" />
                    <span className="text-sm opacity-90">Students</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ListChecks className="h-5 w-5" />
                    <span className="text-sm opacity-90">Assignments</span>
                  </div>
                  <p className="text-3xl font-bold">{stats.totalAssignments}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Create a Class */}
            <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary">
              <CardHeader onClick={() => navigate('/tutor/groups')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle>Create a Class</CardTitle>
                <CardDescription>
                  Organize students into groups and manage your classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/tutor/groups')}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </CardContent>
            </Card>

            {/* Create a Game */}
            <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary">
              <CardHeader onClick={() => navigate('/tutor/games/create')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle>Create a Game</CardTitle>
                <CardDescription>Design interactive learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/tutor/games/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Game
                </Button>
              </CardContent>
            </Card>

            {/* Create Assignment */}
            <Card
              className={`transition-all cursor-pointer group border-2 ${
                hasData ? 'hover:shadow-lg hover:border-primary' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <CardHeader onClick={() => hasData && navigate('/tutor/assignments/create')}>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-3 rounded-lg ${
                      hasData
                        ? 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white'
                        : 'bg-gray-100 text-gray-400'
                    } transition-colors`}
                  >
                    <ListChecks className="h-6 w-6" />
                  </div>
                  {hasData && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <CardTitle>Create Assignment</CardTitle>
                <CardDescription>Assign games to groups with deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  disabled={!hasData}
                  onClick={() => navigate('/tutor/assignments/create')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {hasData ? 'New Assignment' : 'Create Games & Groups First'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity & Groups Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Games */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Recent Games
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tutor/games')}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : recentGames.length > 0 ? (
                <div className="space-y-3">
                  {recentGames.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => navigate(`/tutor/games/${game.id}`)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {GAME_TYPE_ICONS[game.gameType as keyof typeof GAME_TYPE_ICONS] || '🎮'}
                        </span>
                        <div>
                          <p className="font-medium">{game.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(game.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{game.gameType}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground mb-3">No games created yet</p>
                  <Button
                    onClick={() => navigate('/tutor/games/create')}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Game
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Groups Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Groups
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/tutor/groups')}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : groups.length > 0 ? (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => navigate(`/tutor/groups/${group.id}`)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {group.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {group.memberCount || 0} students
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{group.joinCode}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground mb-3">No groups created yet</p>
                  <Button onClick={() => navigate('/tutor/groups')} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Group
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide (shown when no data) */}
        {!hasData && !loading && (
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Getting Started
              </CardTitle>
              <CardDescription>Follow these steps to set up your classroom</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Create your first group</p>
                    <p className="text-sm text-muted-foreground">
                      Organize students into classes and generate join codes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Design learning games</p>
                    <p className="text-sm text-muted-foreground">
                      Choose from 5 game types and create engaging activities
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Assign games to groups</p>
                    <p className="text-sm text-muted-foreground">
                      Set deadlines and track student progress (Coming soon)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dev Tools Button (Development Only) */}
      {session?.tutor?.id && (
        <TutorTestDataButton tutorId={session.tutor.id} onDataChanged={loadDashboardData} />
      )}
    </DashboardLayout>
  );
}
