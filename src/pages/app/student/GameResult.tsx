import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Trophy, Clock, RotateCcw, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function GameResult() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 8, total = 10, timeSpent = 240 } = location.state || {};

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70;

  useEffect(() => {
    if (passed) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [passed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/app/student/assignments')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assignments
      </Button>

      <Card>
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full ${passed ? 'bg-primary/10' : 'bg-amber-500/10'} flex items-center justify-center mx-auto mb-4`}>
            {passed ? <Trophy className="w-10 h-10 text-primary" /> : <Check className="w-10 h-10 text-amber-500" />}
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">{percentage}%</h1>
          <p className="text-lg text-muted-foreground mb-4">
            You got {score} out of {total} correct
          </p>
          
          <Badge className={passed ? 'bg-primary' : 'bg-amber-500'}>
            {passed ? 'Passed! 🎉' : 'Keep Practicing!'}
          </Badge>

          <div className="flex justify-center gap-6 mt-6 pt-6 border-t">
            <div className="text-center">
              <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-sm font-medium">{formatTime(timeSpent)}</p>
              <p className="text-xs text-muted-foreground">Time</p>
            </div>
            <div className="text-center">
              <Check className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">{score}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <X className="w-5 h-5 text-destructive mx-auto mb-1" />
              <p className="text-sm font-medium">{total - score}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/app/student/assignments/${id}/play`}>
            <RotateCcw className="w-4 h-4 mr-2" /> Play Again
          </Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link to="/app/student/assignments">View All Assignments</Link>
        </Button>
      </div>
    </div>
  );
}
