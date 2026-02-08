import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Trophy, Eye, Download, Filter } from 'lucide-react';
import { getMyAttempts, getMyGroups } from '@/services/supabase/student.service';
import { GameType } from '@/types/game';
import { format } from 'date-fns';

interface AssignmentAttemptsTabProps {
  studentId: string;
}

export default function AssignmentAttemptsTab({ studentId }: AssignmentAttemptsTabProps) {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [gameTypeFilter, setGameTypeFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    loadData();
  }, [studentId]);

  useEffect(() => {
    applyFilters();
  }, [attempts, gameTypeFilter, groupFilter, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [attemptsData, groupsData] = await Promise.all([
        getMyAttempts(studentId),
        getMyGroups(studentId),
      ]);
      setAttempts(attemptsData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Failed to load attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attempts];

    // Filter by game type
    if (gameTypeFilter !== 'all') {
      filtered = filtered.filter((a) => a.game?.gameType === gameTypeFilter);
    }

    // Filter by group
    if (groupFilter !== 'all') {
      filtered = filtered.filter((a) => a.group?.id === groupFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        case 'date-asc':
          return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
        case 'score-desc':
          return b.scorePercentage - a.scorePercentage;
        case 'score-asc':
          return a.scorePercentage - b.scorePercentage;
        case 'time-desc':
          return b.timeTaken - a.timeTaken;
        case 'time-asc':
          return a.timeTaken - b.timeTaken;
        default:
          return 0;
      }
    });

    setFilteredAttempts(filtered);
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

  const exportToCSV = () => {
    const headers = ['Date', 'Game', 'Game Type', 'Group', 'Score %', 'Time'];
    const rows = filteredAttempts.map((attempt) => [
      format(new Date(attempt.completedAt), 'yyyy-MM-dd HH:mm'),
      attempt.game?.name || 'Unknown',
      attempt.game?.gameType || 'Unknown',
      attempt.group?.name || 'Unknown',
      attempt.scorePercentage,
      attempt.timeTaken,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-scores-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (attemptId: string) => {
    navigate(`/student/attempts/${attemptId}`);
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1">
            <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Game Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Game Types</SelectItem>
                <SelectItem value={GameType.PAIRS}>Pairs</SelectItem>
                <SelectItem value={GameType.FLASHCARDS}>Flashcards</SelectItem>
                <SelectItem value={GameType.SPLAT}>Splat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="score-desc">Score (High to Low)</SelectItem>
                <SelectItem value="score-asc">Score (Low to High)</SelectItem>
                <SelectItem value="time-desc">Time (Longest)</SelectItem>
                <SelectItem value="time-asc">Time (Shortest)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={filteredAttempts.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {(gameTypeFilter !== 'all' || groupFilter !== 'all') && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredAttempts.length} of {attempts.length} attempts
            </span>
          </div>
        )}
      </Card>

      {/* Attempts Table */}
      {filteredAttempts.length === 0 ? (
        <Card className="p-8 text-center">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Attempts Found</h3>
          <p className="text-muted-foreground">
            {attempts.length === 0
              ? "You haven't completed any assignments yet."
              : 'No attempts match your current filters.'}
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(attempt.completedAt), 'MMM d, yyyy')}
                        <span className="text-muted-foreground">
                          {format(new Date(attempt.completedAt), 'h:mm a')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{attempt.game?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{attempt.game?.gameType || 'Unknown'}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {attempt.group?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={getScoreBadgeColor(attempt.scorePercentage)}
                      >
                        {attempt.scorePercentage}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatTime(attempt.timeTaken)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(attempt.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
