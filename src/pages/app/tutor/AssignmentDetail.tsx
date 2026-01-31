import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoData } from '@/hooks/useDemoData';
import { ArrowLeft, Calendar, Users, TrendingUp, Clock, Check, X, Minus } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssignmentById, getGameById, getClassById, getProgressForAssignment, getStudentById } = useDemoData();

  const assignment = getAssignmentById(id || '');
  const game = assignment ? getGameById(assignment.gameId) : null;
  const classData = assignment ? getClassById(assignment.classId) : null;
  const progress = getProgressForAssignment(id || '');

  if (!assignment || !game || !classData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-foreground">Assignment not found</h2>
        <Button asChild className="mt-4">
          <Link to="/app/tutor/assignments">Back to Assignments</Link>
        </Button>
      </div>
    );
  }

  const completed = progress.filter(p => p.status === 'completed');
  const inProgress = progress.filter(p => p.status === 'in-progress');
  const notStarted = progress.filter(p => p.status === 'not-started');
  const avgScore = completed.length > 0 
    ? Math.round(completed.reduce((sum, p) => sum + (p.score || 0), 0) / completed.length)
    : null;

  const isOverdue = isPast(new Date(assignment.dueDate)) && !isToday(new Date(assignment.dueDate));

  const formatTime = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-primary"><Check className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> In Progress</Badge>;
      default:
        return <Badge variant="outline"><Minus className="w-3 h-3 mr-1" /> Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/tutor/assignments')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{game.name}</h1>
          <p className="text-muted-foreground">{classData.name}</p>
        </div>
        {isOverdue ? (
          <Badge variant="destructive">Overdue</Badge>
        ) : isToday(new Date(assignment.dueDate)) ? (
          <Badge className="bg-amber-500">Due Today</Badge>
        ) : (
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completed.length}/{progress.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{avgScore !== null ? `${avgScore}%` : '-'}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inProgress.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{notStarted.length}</p>
                <p className="text-sm text-muted-foreground">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Last Played</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progress.map((p) => {
                const student = getStudentById(p.studentId);
                if (!student) return null;

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                    <TableCell>
                      {p.score !== undefined ? (
                        <span className={p.score >= (assignment.passPercentage || 0) ? 'text-primary font-medium' : ''}>
                          {p.score}%
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{p.attempts}</TableCell>
                    <TableCell>{formatTime(p.timeSpent)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.lastPlayedAt ? format(new Date(p.lastPlayedAt), 'MMM d') : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
