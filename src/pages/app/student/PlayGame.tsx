import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDemoData } from '@/hooks/useDemoData';
import { Check, X, Pause, RotateCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MultipleChoiceQuestion, FlashcardQuestion } from '@/types/app';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function PlayGame() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { demoStudentAssignments, getGameById, getAssignmentById } = useDemoData();

  const studentAssignment = demoStudentAssignments.find(a => a.assignmentId === id);
  const assignment = getAssignmentById(id || '');
  const game = assignment ? getGameById(assignment.gameId) : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; answer: number | string }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime] = useState(Date.now());

  if (!game || !assignment) {
    return <div className="text-center py-12"><h2 className="text-lg font-semibold">Game not found</h2><Button onClick={() => navigate('/app/student/assignments')} className="mt-4">Back to Assignments</Button></div>;
  }

  const questions = game.questions;
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isComplete = currentIndex >= totalQuestions;

  const handleMCAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const question = questions[currentIndex] as MultipleChoiceQuestion;
    const isCorrect = answerIndex === question.correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setAnswers([...answers, { correct: isCorrect, answer: answerIndex }]);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setCurrentIndex(i => i + 1);
    }, isCorrect ? 1000 : 2000);
  };

  const handleFlashcardNext = (knew: boolean) => {
    if (knew) setScore(s => s + 1);
    setAnswers([...answers, { correct: knew, answer: knew ? 'knew' : 'learning' }]);
    setIsFlipped(false);
    setCurrentIndex(i => i + 1);
  };

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    navigate(`/app/student/assignments/${id}/result`, { 
      state: { score, total: totalQuestions, timeSpent, answers, gameType: game.type }
    });
  };

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{Math.round((score / totalQuestions) * 100)}%</h1>
        <p className="text-muted-foreground mb-6">You got {score} out of {totalQuestions} correct!</p>
        <Button onClick={handleComplete} size="lg">View Results <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-foreground">{game.name}</h1>
          <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {totalQuestions}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{score}/{currentIndex} correct</span>
          <Button variant="ghost" size="icon" onClick={() => setIsPaused(true)}><Pause className="w-4 h-4" /></Button>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Multiple Choice */}
      {game.type === 'multiple-choice' && (
        <Card>
          <CardContent className="p-8">
            <div className="bg-secondary rounded-2xl p-6 mb-6 text-center">
              <p className="text-xs text-white/70 uppercase tracking-wide mb-2">Question {currentIndex + 1}</p>
              <h2 className="text-xl font-bold text-white">{(questions[currentIndex] as MultipleChoiceQuestion).question}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(questions[currentIndex] as MultipleChoiceQuestion).options.map((option, i) => {
                const question = questions[currentIndex] as MultipleChoiceQuestion;
                const isCorrect = i === question.correctIndex;
                const isSelected = selectedAnswer === i;
                
                return (
                  <button
                    key={i}
                    onClick={() => handleMCAnswer(i)}
                    disabled={showFeedback}
                    className={cn(
                      "py-4 px-4 rounded-xl font-medium text-left transition-all border-2",
                      showFeedback && isCorrect && "bg-primary border-primary text-white",
                      showFeedback && isSelected && !isCorrect && "bg-destructive border-destructive text-white",
                      !showFeedback && "bg-muted border-transparent hover:border-primary/50",
                      showFeedback && !isSelected && !isCorrect && "opacity-50"
                    )}
                  >
                    <span className="text-sm opacity-60 mr-2">{String.fromCharCode(65 + i)}</span>
                    {option}
                    {showFeedback && isCorrect && <Check className="inline w-4 h-4 ml-2" />}
                    {showFeedback && isSelected && !isCorrect && <X className="inline w-4 h-4 ml-2" />}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcards */}
      {game.type === 'flashcards' && (
        <div className="space-y-4">
          <Card 
            className="cursor-pointer min-h-[300px] flex items-center justify-center"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CardContent className="p-8 text-center">
              <p className="text-xs text-muted-foreground mb-4">{isFlipped ? 'Answer' : 'Question'} • Tap to flip</p>
              <h2 className="text-2xl font-bold">
                {isFlipped 
                  ? (questions[currentIndex] as FlashcardQuestion).back 
                  : (questions[currentIndex] as FlashcardQuestion).front}
              </h2>
            </CardContent>
          </Card>
          
          {isFlipped && (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => handleFlashcardNext(false)}>
                <RotateCcw className="w-4 h-4 mr-2" /> Still Learning
              </Button>
              <Button className="flex-1" onClick={() => handleFlashcardNext(true)}>
                <Check className="w-4 h-4 mr-2" /> Got It!
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Pause Dialog */}
      <Dialog open={isPaused} onOpenChange={setIsPaused}>
        <DialogContent>
          <DialogHeader><DialogTitle>Game Paused</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Take a break. Your progress is saved.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate('/app/student/assignments')}>Exit Game</Button>
            <Button onClick={() => setIsPaused(false)}>Resume</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
