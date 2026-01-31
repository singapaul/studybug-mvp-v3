import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDemoData } from '@/hooks/useDemoData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Users, ClipboardList, TrendingUp, Flame, Play, ArrowRight, Check } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { demoStudentAssignments, demoStudentScores, joinClass, classes } = useDemoData();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Get student's classes
  const studentClasses = classes.filter(c => c.studentIds.includes(user?.id || 'student-demo'));
  const hasClasses = studentClasses.length > 0 || user?.email === 'student@studybug.io';

  // Stats
  const classCount = user?.email === 'student@studybug.io' ? 2 : studentClasses.length;
  const dueAssignments = demoStudentAssignments.filter(a => a.status !== 'completed' && !isPast(new Date(a.dueDate))).length;
  const avgScore = demoStudentScores.length > 0 
    ? Math.round(demoStudentScores.reduce((sum, s) => sum + s.score, 0) / demoStudentScores.length)
    : 0;

  const handleJoinClass = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    
    const result = joinClass(joinCode.trim(), user?.id || 'student-demo');
    
    if (result.success) {
      toast({ title: 'Joined!', description: `You've joined ${result.className}` });
      setJoinCode('');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsJoining(false);
  };

  const getDueLabel = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return <Badge variant="destructive">Overdue</Badge>;
    if (isToday(date)) return <Badge className="bg-amber-500">Due Today</Badge>;
    if (isTomorrow(date)) return <Badge variant="secondary">Tomorrow</Badge>;
    const days = differenceInDays(date, new Date());
    return <Badge variant="outline">In {days} days</Badge>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}! 🐛</h1>
        <p className="text-muted-foreground">Ready to learn something new today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10"><Users className="w-5 h-5 text-secondary" /></div>
          <div><p className="text-2xl font-bold">{classCount}</p><p className="text-sm text-muted-foreground">Classes</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><ClipboardList className="w-5 h-5 text-primary" /></div>
          <div><p className="text-2xl font-bold">{dueAssignments}</p><p className="text-sm text-muted-foreground">Due</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent"><TrendingUp className="w-5 h-5 text-accent-foreground" /></div>
          <div><p className="text-2xl font-bold">{avgScore}%</p><p className="text-sm text-muted-foreground">Avg Score</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-coral/10"><Flame className="w-5 h-5 text-coral" /></div>
          <div><p className="text-2xl font-bold">5</p><p className="text-sm text-muted-foreground">Day Streak 🔥</p></div>
        </CardContent></Card>
      </div>

      {/* Join Class Card */}
      {!hasClasses && (
        <Card className="border-dashed border-2">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join Your First Class</h3>
            <p className="text-muted-foreground mb-4">Enter the join code from your tutor</p>
            <div className="flex gap-2 max-w-xs mx-auto">
              <Input placeholder="ABC123" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} className="font-mono text-center" />
              <Button onClick={handleJoinClass} disabled={isJoining}>{isJoining ? '...' : 'Join'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Assignments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upcoming Assignments</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/app/student/assignments">View All <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoStudentAssignments.filter(a => a.status !== 'completed').slice(0, 3).map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="capitalize">{assignment.gameType.replace('-', ' ')}</Badge>
                  {getDueLabel(assignment.dueDate)}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{assignment.gameName}</h3>
                <p className="text-sm text-muted-foreground mb-4">{assignment.className}</p>
                <Button asChild className="w-full" size="sm">
                  <Link to={`/app/student/assignments/${assignment.assignmentId}/play`}>
                    <Play className="w-4 h-4 mr-2" />{assignment.status === 'in-progress' ? 'Continue' : 'Play Now'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Scores */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Scores</h2>
        <Card>
          <CardContent className="p-0 divide-y">
            {demoStudentScores.slice(0, 5).map((score) => (
              <div key={score.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{score.gameName}</p>
                    <p className="text-xs text-muted-foreground">{score.className}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{score.score}%</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(score.date), 'MMM d')}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
