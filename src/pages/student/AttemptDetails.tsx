import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Trophy,
  Clock,
  Calendar,
  Target,
  CheckCircle2,
  XCircle,
  Play,
} from 'lucide-react';
import { getAttemptDetails } from '@/services/supabase/student.service';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function AttemptDetails() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    if (!attemptId) return;

    setLoading(true);
    try {
      const data = await getAttemptDetails(attemptId);
      setAttempt(data);
    } catch (error) {
      console.error('Failed to load attempt details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-300';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-300';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-red-600 bg-red-50 border-red-300';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const handlePlayAgain = () => {
    if (attempt?.assignment) {
      navigate(`/student/play/${attempt.assignment.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Attempt Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The attempt you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/student/scores')}>Back to My Scores</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/scores')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Scores
          </Button>
        </div>

        {/* Summary Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{attempt.game?.name || 'Unknown Game'}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{attempt.game?.gameType}</Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {attempt.group?.name || 'Unknown Group'}
                  </span>
                </div>
              </div>
              <Button onClick={handlePlayAgain}>
                <Play className="mr-2 h-4 w-4" />
                Play Again
              </Button>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border-2 ${getScoreColor(attempt.scorePercentage)}`}>
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="h-6 w-6" />
                  <span className="text-sm font-medium">Score</span>
                </div>
                <p className="text-4xl font-bold">{attempt.scorePercentage}%</p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-300">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Time</span>
                </div>
                <p className="text-4xl font-bold text-blue-600">{formatTime(attempt.timeTaken)}</p>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-300">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Date</span>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {format(new Date(attempt.completedAt), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-purple-600">
                  {format(new Date(attempt.completedAt), 'h:mm a')}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Breakdown */}
        {attempt.attemptData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Attempt Details</h2>

              {/* Pairs Game Details */}
              {attempt.game?.gameType === 'PAIRS' && attempt.attemptData.moves && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Moves</p>
                      <p className="text-2xl font-bold">{attempt.attemptData.moves}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Pairs Found</p>
                      <p className="text-2xl font-bold">{attempt.attemptData.pairs}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
                      <p className="text-2xl font-bold">
                        {Math.round((attempt.attemptData.pairs / attempt.attemptData.moves) * 100)}%
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Perfect Game</p>
                      <p className="text-2xl font-bold">
                        {attempt.attemptData.perfectGame ? (
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-muted-foreground" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Flashcards Details */}
              {attempt.game?.gameType === 'FLASHCARDS' && attempt.attemptData.totalCards && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Cards</p>
                      <p className="text-2xl font-bold">{attempt.attemptData.totalCards}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Known Cards</p>
                      <p className="text-2xl font-bold text-green-600">
                        {attempt.attemptData.knownCards}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 mb-1">Unknown Cards</p>
                      <p className="text-2xl font-bold text-red-600">
                        {attempt.attemptData.unknownCards}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Completion</p>
                      <p className="text-2xl font-bold">
                        {attempt.attemptData.reviewedAll ? (
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-muted-foreground" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Splat Details */}
              {attempt.game?.gameType === 'SPLAT' && attempt.attemptData.totalQuestions && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Questions</p>
                      <p className="text-2xl font-bold">{attempt.attemptData.totalQuestions}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Correct</p>
                      <p className="text-2xl font-bold text-green-600">
                        {attempt.attemptData.correctAnswers}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Total Score</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {attempt.attemptData.totalScore}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 mb-1">Avg Reaction</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {(attempt.attemptData.averageReactionTime / 1000).toFixed(2)}s
                      </p>
                    </div>
                  </div>

                  {/* Reaction Times Breakdown */}
                  {attempt.attemptData.reactionTimes && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Question-by-Question Breakdown</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {attempt.attemptData.reactionTimes.map((time: number, index: number) => (
                          <div
                            key={index}
                            className="p-3 bg-muted rounded-lg flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">Q{index + 1}</span>
                            <div className="text-right">
                              <p className="text-sm font-bold">{(time / 1000).toFixed(2)}s</p>
                              <p className="text-xs text-muted-foreground">
                                +{attempt.attemptData.scores?.[index] || 0}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center pb-8">
          <Button variant="outline" onClick={() => navigate('/student/scores')}>
            Back to My Scores
          </Button>
          <Button onClick={handlePlayAgain}>
            <Play className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
