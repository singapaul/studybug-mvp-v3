import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoData } from '@/hooks/useDemoData';
import { Plus, ClipboardList, Eye } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Assignments() {
  const { assignments, games, classes, getProgressForAssignment } = useDemoData();

  const getGame = (gameId: string) => games.find(g => g.id === gameId);
  const getClass = (classId: string) => classes.find(c => c.id === classId);

  const getDueDateBadge = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (isToday(date)) {
      return <Badge className="bg-amber-500">Due Today</Badge>;
    }
    if (isTomorrow(date)) {
      return <Badge variant="secondary">Tomorrow</Badge>;
    }
    return <Badge variant="outline">{format(date, 'MMM d')}</Badge>;
  };

  const getCompletionRate = (assignmentId: string) => {
    const progress = getProgressForAssignment(assignmentId);
    const completed = progress.filter(p => p.status === 'completed').length;
    return { completed, total: progress.length };
  };

  const getAvgScore = (assignmentId: string) => {
    const progress = getProgressForAssignment(assignmentId);
    const completed = progress.filter(p => p.status === 'completed' && p.score !== undefined);
    if (completed.length === 0) return null;
    const avg = completed.reduce((sum, p) => sum + (p.score || 0), 0) / completed.length;
    return Math.round(avg);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Track student progress on assigned games</p>
        </div>
        <Button asChild>
          <Link to="/app/tutor/assignments/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Link>
        </Button>
      </div>

      {assignments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No assignments yet</h3>
            <p className="text-muted-foreground mb-4">Assign a game to your class</p>
            <Button asChild>
              <Link to="/app/tutor/assignments/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => {
                  const game = getGame(assignment.gameId);
                  const cls = getClass(assignment.classId);
                  const { completed, total } = getCompletionRate(assignment.id);
                  const avgScore = getAvgScore(assignment.id);

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{game?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground capitalize">{game?.type?.replace('-', ' ')}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground">{cls?.name || 'Unknown'}</p>
                      </TableCell>
                      <TableCell>
                        {getDueDateBadge(assignment.dueDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {completed}/{total}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {avgScore !== null ? (
                          <Badge variant={avgScore >= 70 ? 'default' : 'secondary'}>
                            {avgScore}%
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/app/tutor/assignments/${assignment.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
