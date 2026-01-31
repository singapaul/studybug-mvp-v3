import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDemoData } from '@/hooks/useDemoData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, Layers, Plus, Trash2, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameType, MultipleChoiceQuestion, FlashcardQuestion } from '@/types/app';

type Step = 'type' | 'details' | 'questions';

const subjects = ['Maths', 'English', 'Science', 'History', 'Geography', 'Languages', 'Art', 'Music', 'Other'];

export default function CreateGame() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addGame } = useDemoData();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('type');
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Multiple choice questions
  const [mcQuestions, setMcQuestions] = useState<Omit<MultipleChoiceQuestion, 'id'>[]>([
    { question: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);

  // Flashcard questions
  const [flashcards, setFlashcards] = useState<Omit<FlashcardQuestion, 'id'>[]>([
    { front: '', back: '' },
  ]);

  const handleTypeSelect = (type: GameType) => {
    setGameType(type);
    setStep('details');
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Game name is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = () => {
    if (!validateDetails()) return;
    setStep('questions');
  };

  const addMcQuestion = () => {
    setMcQuestions([...mcQuestions, { question: '', options: ['', '', '', ''], correctIndex: 0 }]);
  };

  const removeMcQuestion = (index: number) => {
    if (mcQuestions.length > 1) {
      setMcQuestions(mcQuestions.filter((_, i) => i !== index));
    }
  };

  const updateMcQuestion = (index: number, field: string, value: string | number) => {
    const updated = [...mcQuestions];
    if (field === 'question') {
      updated[index].question = value as string;
    } else if (field === 'correctIndex') {
      updated[index].correctIndex = value as number;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''));
      updated[index].options[optionIndex] = value as string;
    }
    setMcQuestions(updated);
  };

  const addFlashcard = () => {
    setFlashcards([...flashcards, { front: '', back: '' }]);
  };

  const removeFlashcard = (index: number) => {
    if (flashcards.length > 1) {
      setFlashcards(flashcards.filter((_, i) => i !== index));
    }
  };

  const updateFlashcard = (index: number, field: 'front' | 'back', value: string) => {
    const updated = [...flashcards];
    updated[index][field] = value;
    setFlashcards(updated);
  };

  const handleSubmit = () => {
    // Validate questions
    if (gameType === 'multiple-choice') {
      const valid = mcQuestions.every(q => 
        q.question.trim() && q.options.every(o => o.trim())
      );
      if (!valid) {
        toast({
          variant: 'destructive',
          title: 'Incomplete questions',
          description: 'Please fill in all questions and options',
        });
        return;
      }
    } else {
      const valid = flashcards.every(f => f.front.trim() && f.back.trim());
      if (!valid) {
        toast({
          variant: 'destructive',
          title: 'Incomplete flashcards',
          description: 'Please fill in both sides of all flashcards',
        });
        return;
      }
    }

    const questions = gameType === 'multiple-choice' 
      ? mcQuestions.map((q, i) => ({ ...q, id: `q${Date.now()}-${i}` }))
      : flashcards.map((f, i) => ({ ...f, id: `f${Date.now()}-${i}` }));

    const newGame = addGame({
      name: formData.name.trim(),
      type: gameType!,
      subject: formData.subject,
      description: formData.description.trim(),
      questions: questions as MultipleChoiceQuestion[] | FlashcardQuestion[],
      tutorId: user?.id || 'tutor-demo',
    });

    toast({
      title: 'Game created!',
      description: `${newGame.name} has been created with ${questions.length} questions`,
    });

    navigate('/app/tutor/games');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            if (step === 'type') navigate('/app/tutor/games');
            else if (step === 'details') setStep('type');
            else setStep('details');
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Game</h1>
          <p className="text-muted-foreground">
            {step === 'type' && 'Choose a game type'}
            {step === 'details' && 'Enter game details'}
            {step === 'questions' && `Add your ${gameType === 'multiple-choice' ? 'questions' : 'flashcards'}`}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {['type', 'details', 'questions'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step === s ? "bg-primary text-white" :
              ['type', 'details', 'questions'].indexOf(step) > i ? "bg-primary/20 text-primary" :
              "bg-muted text-muted-foreground"
            )}>
              {['type', 'details', 'questions'].indexOf(step) > i ? (
                <Check className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && (
              <div className={cn(
                "w-12 h-0.5 mx-2",
                ['type', 'details', 'questions'].indexOf(step) > i ? "bg-primary/20" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Game Type */}
      {step === 'type' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card 
            className={cn(
              "cursor-pointer border-2 hover:border-primary transition-colors",
              gameType === 'multiple-choice' && "border-primary"
            )}
            onClick={() => handleTypeSelect('multiple-choice')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Multiple Choice</h3>
              <p className="text-sm text-muted-foreground">
                Students choose the correct answer from 4 options
              </p>
            </CardContent>
          </Card>

          <Card 
            className={cn(
              "cursor-pointer border-2 hover:border-secondary transition-colors",
              gameType === 'flashcards' && "border-secondary"
            )}
            onClick={() => handleTypeSelect('flashcards')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Flashcards</h3>
              <p className="text-sm text-muted-foreground">
                Students flip cards to learn and memorize
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Game Details */}
      {step === 'details' && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Game Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Times Tables Quiz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className={errors.subject ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the game..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('type')}>
                  Back
                </Button>
                <Button onClick={handleDetailsSubmit}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Questions */}
      {step === 'questions' && gameType === 'multiple-choice' && (
        <div className="space-y-4">
          {mcQuestions.map((q, qIndex) => (
            <Card key={qIndex}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Question {qIndex + 1}</h3>
                  {mcQuestions.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeMcQuestion(qIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      placeholder="Enter your question"
                      value={q.question}
                      onChange={(e) => updateMcQuestion(qIndex, 'question', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctIndex === oIndex}
                            onChange={() => updateMcQuestion(qIndex, 'correctIndex', oIndex)}
                            className="accent-primary"
                          />
                          <Label className="text-xs">Option {String.fromCharCode(65 + oIndex)}</Label>
                        </div>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          value={option}
                          onChange={(e) => updateMcQuestion(qIndex, `option${oIndex}`, e.target.value)}
                          className={q.correctIndex === oIndex ? 'border-primary' : ''}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Select the correct answer</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full" onClick={addMcQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep('details')}>
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Create Game ({mcQuestions.length} questions)
            </Button>
          </div>
        </div>
      )}

      {step === 'questions' && gameType === 'flashcards' && (
        <div className="space-y-4">
          {flashcards.map((f, fIndex) => (
            <Card key={fIndex}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Card {fIndex + 1}</h3>
                  {flashcards.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeFlashcard(fIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Front</Label>
                    <Textarea
                      placeholder="Question or term"
                      value={f.front}
                      onChange={(e) => updateFlashcard(fIndex, 'front', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Back</Label>
                    <Textarea
                      placeholder="Answer or definition"
                      value={f.back}
                      onChange={(e) => updateFlashcard(fIndex, 'back', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full" onClick={addFlashcard}>
            <Plus className="w-4 h-4 mr-2" />
            Add Flashcard
          </Button>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep('details')}>
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Create Game ({flashcards.length} flashcards)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
