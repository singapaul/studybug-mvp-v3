import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDemoData } from '@/hooks/useDemoData';
import { Trophy, TrendingUp, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentScores() {
  const { demoStudentScores } = useDemoData();
  const avgScore = demoStudentScores.length > 0 ? Math.round(demoStudentScores.reduce((s, x) => s + x.score, 0) / demoStudentScores.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Scores</h1>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Trophy className="w-5 h-5 text-primary" /></div>
          <div><p className="text-2xl font-bold">{demoStudentScores.length}</p><p className="text-sm text-muted-foreground">Games Played</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10"><TrendingUp className="w-5 h-5 text-secondary" /></div>
          <div><p className="text-2xl font-bold">{avgScore}%</p><p className="text-sm text-muted-foreground">Average</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-coral/10"><Flame className="w-5 h-5 text-coral" /></div>
          <div><p className="text-2xl font-bold">7</p><p className="text-sm text-muted-foreground">Best Streak</p></div>
        </CardContent></Card>
      </div>

      {/* Scores Table */}
      <Card>
        <CardHeader><CardTitle>Score History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoStudentScores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">{score.gameName}</TableCell>
                  <TableCell className="text-muted-foreground">{score.className}</TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(score.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell><Badge variant={score.score >= 70 ? 'default' : 'secondary'}>{score.score}%</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
