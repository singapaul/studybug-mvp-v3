import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, TrendingUp, Play } from 'lucide-react';
import { getMyPersonalBests } from '@/services/supabase/student.service';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface PersonalBestsTabProps {
  studentId: string;
}

export default function PersonalBestsTab({ studentId }: PersonalBestsTabProps) {
  const navigate = useNavigate();
  const [personalBests, setPersonalBests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGamesPlayed: 0,
    totalAttempts: 0,
    overallAverage: 0,
  });

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const bests = await getMyPersonalBests(studentId);
      setPersonalBests(bests);

      // Calculate overall stats
      const totalGames = bests.length;
      const totalAttempts = bests.reduce((sum, b) => sum + b.totalAttempts, 0);
      const overallAvg =
        totalGames > 0
          ? Math.round(bests.reduce((sum, b) => sum + b.bestScore, 0) / totalGames)
          : 0;

      setStats({
        totalGamesPlayed: totalGames,
        totalAttempts,
        overallAverage: overallAvg,
      });
    } catch (error) {
      console.error('Failed to load personal bests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </Card>
    );
  }

  if (personalBests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Games Played Yet</h3>
        <p className="text-muted-foreground mb-4">
          Complete some assignments to see your personal bests here
        </p>
        <Button onClick={() => navigate('/student/dashboard')}>View Assignments</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Games Played</p>
              <p className="text-3xl font-bold mt-1">{stats.totalGamesPlayed}</p>
            </div>
            <Trophy className="h-10 w-10 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Attempts</p>
              <p className="text-3xl font-bold mt-1">{stats.totalAttempts}</p>
            </div>
            <Target className="h-10 w-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Best Score</p>
              <p className={`text-3xl font-bold mt-1 ${getScoreColor(stats.overallAverage)}`}>
                {stats.overallAverage}%
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Personal Bests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personalBests.map((best, index) => (
          <motion.div
            key={best.game?.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {best.game?.name || 'Unknown Game'}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {best.game?.gameType || 'Unknown'}
                    </Badge>
                  </div>
                  {index < 3 && (
                    <div className="flex items-center gap-1">
                      <Trophy
                        className={`h-5 w-5 ${
                          index === 0
                            ? 'text-yellow-500'
                            : index === 1
                              ? 'text-gray-400'
                              : 'text-orange-600'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Best Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best Score</span>
                    <Badge
                      variant="outline"
                      className={`${getScoreBadgeColor(best.bestScore)} text-lg font-bold px-3 py-1`}
                    >
                      {best.bestScore}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best Time</span>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Clock className="h-3 w-3" />
                      {formatTime(best.bestTime)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="text-sm font-medium">{best.averageScore}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Attempts</span>
                    <span className="text-sm font-medium">{best.totalAttempts}</span>
                  </div>
                </div>

                {/* Last Played */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Last played {format(new Date(best.lastPlayedAt), 'MMM d, yyyy')}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/student/dashboard`)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
