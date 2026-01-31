import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoData } from '@/hooks/useDemoData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Users, Link as LinkIcon, ClipboardList, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getClassById, getStudentsInClass, getAssignmentsForClass, getGameById, getProgressForAssignment } = useDemoData();

  const classData = getClassById(id || '');
  const students = getStudentsInClass(id || '');
  const assignments = getAssignmentsForClass(id || '');

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-foreground">Class not found</h2>
        <Button asChild className="mt-4">
          <Link to="/app/tutor/classes">Back to Classes</Link>
        </Button>
      </div>
    );
  }

  const copyJoinCode = () => {
    navigator.clipboard.writeText(classData.joinCode);
    toast({
      title: 'Copied!',
      description: `Join code ${classData.joinCode} copied to clipboard`,
    });
  };

  const copyJoinLink = () => {
    const link = `${window.location.origin}/join/${classData.joinCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied!',
      description: 'Join link copied to clipboard',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/tutor/classes')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{classData.name}</h1>
          <p className="text-muted-foreground">{classData.subject} • {classData.ageRange} years</p>
        </div>
      </div>

      {/* Join Code Card */}
      <Card className="bg-secondary/5 border-secondary/20">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Join Code</p>
              <button
                onClick={copyJoinCode}
                className="flex items-center gap-2 text-2xl font-mono font-bold text-secondary hover:text-secondary/80 transition-colors"
              >
                {classData.joinCode}
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Shareable Link</p>
              <button
                onClick={copyJoinLink}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <LinkIcon className="w-4 h-4" />
                Copy join link
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {students.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No students yet. Share the join code to invite students.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(student.joinedAt), 'MMM d')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(student.lastActive), 'MMM d')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Assignments ({assignments.length})
            </CardTitle>
            <Button asChild size="sm">
              <Link to="/app/tutor/assignments/create">Add</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {assignments.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No assignments yet for this class.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {assignments.map((assignment) => {
                  const game = getGameById(assignment.gameId);
                  const progress = getProgressForAssignment(assignment.id);
                  const completed = progress.filter(p => p.status === 'completed').length;
                  const total = progress.length;

                  return (
                    <Link
                      key={assignment.id}
                      to={`/app/tutor/assignments/${assignment.id}`}
                      className="block p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{game?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Due {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {completed}/{total} complete
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
