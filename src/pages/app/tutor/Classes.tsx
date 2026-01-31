import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemoData } from '@/hooks/useDemoData';
import { Plus, Users, Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Classes() {
  const { classes, assignments, deleteClass } = useDemoData();
  const { toast } = useToast();

  const copyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: `Join code ${code} copied to clipboard`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteClass(id);
    toast({
      title: 'Class deleted',
      description: `${name} has been deleted`,
    });
  };

  const getActiveAssignments = (classId: string) => {
    return assignments.filter(a => a.classId === classId && new Date(a.dueDate) >= new Date()).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage your classes and students</p>
        </div>
        <Button asChild>
          <Link to="/app/tutor/classes/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Class
          </Link>
        </Button>
      </div>

      {classes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No classes yet</h3>
            <p className="text-muted-foreground mb-4">Create your first class to get started</p>
            <Button asChild>
              <Link to="/app/tutor/classes/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Class
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
                  <TableHead>Class Name</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Join Code</TableHead>
                  <TableHead>Active Assignments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.subject}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cls.studentIds.length} students</Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => copyJoinCode(cls.joinCode)}
                        className="flex items-center gap-2 font-mono text-sm bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors"
                      >
                        {cls.joinCode}
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getActiveAssignments(cls.id)} active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link to={`/app/tutor/classes/${cls.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {cls.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the class and remove all students. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(cls.id, cls.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
