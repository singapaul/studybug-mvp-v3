import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, Flame, Target, BarChart3 } from 'lucide-react';
import { getMyProgressTrends } from '@/services/supabase/student.service';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

interface ProgressTrendsTabProps {
  studentId: string;
}

export default function ProgressTrendsTab({ studentId }: ProgressTrendsTabProps) {
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(30);

  useEffect(() => {
    loadData();
  }, [studentId, timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMyProgressTrends(studentId, timeRange);
      setTrends(data);
    } catch (error) {
      console.error('Failed to load progress trends:', error);
    } finally {
      setLoading(false);
    }
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

  if (!trends || trends.totalAttempts === 0) {
    return (
      <Card className="p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-muted-foreground">
          Complete some assignments to see your progress trends
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Time Range</h3>
          <Select
            value={timeRange.toString()}
            onValueChange={(value) => setTimeRange(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                Current
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Study Streak</p>
            <p className="text-4xl font-bold text-orange-600">
              {trends.currentStreak}
              <span className="text-lg ml-1">{trends.currentStreak === 1 ? 'day' : 'days'}</span>
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-blue-500" />
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                {timeRange} Days
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Attempts</p>
            <p className="text-4xl font-bold text-blue-600">{trends.totalAttempts}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Average
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Score</p>
            <p className="text-4xl font-bold text-green-600">{trends.averageScore}%</p>
          </Card>
        </motion.div>
      </div>

      {/* Score Over Time Chart */}
      {trends.scoreOverTime.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Score Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends.scoreOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={{ value: 'Score %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Score %"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Performance by Game Type */}
      {trends.performanceByGameType.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Game Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends.performanceByGameType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gameType" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={{ value: 'Average Score %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="averageScore"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                name="Average Score %"
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Game Type Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {trends.performanceByGameType.map((gameType: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{gameType.gameType}</p>
                  <p className="text-xs text-muted-foreground">
                    {gameType.attempts} {gameType.attempts === 1 ? 'attempt' : 'attempts'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{gameType.averageScore}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Insights & Progress
        </h3>
        <div className="space-y-3 text-sm">
          {trends.currentStreak > 0 && (
            <div className="flex items-start gap-2">
              <Flame className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p>
                You're on a <span className="font-semibold">{trends.currentStreak}-day streak</span>
                !{trends.currentStreak >= 3 && ' Keep up the amazing momentum!'}
              </p>
            </div>
          )}

          {trends.averageScore >= 85 && (
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>
                Your average score of <span className="font-semibold">{trends.averageScore}%</span>{' '}
                is excellent! You're mastering the material.
              </p>
            </div>
          )}

          {trends.averageScore < 70 && (
            <div className="flex items-start gap-2">
              <Target className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p>
                Your average score is <span className="font-semibold">{trends.averageScore}%</span>.
                Try reviewing the material and attempting the games again to improve!
              </p>
            </div>
          )}

          {trends.totalAttempts >= 20 && (
            <div className="flex items-start gap-2">
              <Target className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p>
                You've completed{' '}
                <span className="font-semibold">{trends.totalAttempts} attempts</span> in the last{' '}
                {timeRange} days. Great dedication!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
