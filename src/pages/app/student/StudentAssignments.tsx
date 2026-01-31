import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDemoData } from '@/hooks/useDemoData';
import { Play, Check, Clock, Minus } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

export default function StudentAssignments() {
  const { demoStudentAssignments } = useDemoData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const renderAssignment = (assignment: typeof demoStudentAssignments[0]) => {
    const isOverdue = isPast(new Date(assignment.dueDate)) && !isToday(new Date(assignment.dueDate));
    
    return (
      <Card key={assignment.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="outline" className="capitalize">{assignment.gameType.replace('-', ' ')}</Badge>
            {assignment.status === 'completed' ? (
              <Badge className="bg-primary"><Check className="w-3 h-3 mr-1" />{assignment.score}%</Badge>
            ) : isOverdue ? (
              <Badge variant="destructive">Overdue</Badge>
            ) : (
              <Badge variant="secondary">{format(new Date(assignment.dueDate), 'MMM d')}</Badge>
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-1">{assignment.gameName}</h3>
          <p className="text-sm text-muted-foreground mb-4">{assignment.className}</p>
          <Button asChild className="w-full" size="sm" variant={assignment.status === 'completed' ? 'outline' : 'default'}>
            <Link to={`/app/student/assignments/${assignment.assignmentId}/play`}>
              <Play className="w-4 h-4 mr-2" />
              {assignment.status === 'completed' ? 'Play Again' : assignment.status === 'in-progress' ? 'Continue' : 'Play Now'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const all = demoStudentAssignments;
  const dueSoon = all.filter(a => a.status !== 'completed' && !isPast(new Date(a.dueDate)));
  const completed = all.filter(a => a.status === 'completed');
  const notStarted = all.filter(a => a.status === 'not-started');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Assignments</h1>
        <p className="text-muted-foreground">Games assigned by your tutors</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({all.length})</TabsTrigger>
          <TabsTrigger value="due">Due Soon ({dueSoon.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="not-started">Not Started ({notStarted.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{all.map(renderAssignment)}</div>
        </TabsContent>
        <TabsContent value="due" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{dueSoon.map(renderAssignment)}</div>
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{completed.map(renderAssignment)}</div>
        </TabsContent>
        <TabsContent value="not-started" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{notStarted.map(renderAssignment)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
