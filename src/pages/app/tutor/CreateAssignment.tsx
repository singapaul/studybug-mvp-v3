import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDemoData } from '@/hooks/useDemoData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const { games, classes, addAssignment } = useDemoData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    gameId: '',
    classId: '',
    dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    passPercentage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.gameId) newErrors.gameId = 'Please select a game';
    if (!formData.classId) newErrors.classId = 'Please select a class';
    if (!formData.dueDate) newErrors.dueDate = 'Please select a due date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newAssignment = addAssignment({
      gameId: formData.gameId,
      classId: formData.classId,
      dueDate: formData.dueDate,
      passPercentage: formData.passPercentage ? parseInt(formData.passPercentage) : undefined,
    });

    const game = games.find(g => g.id === formData.gameId);
    const cls = classes.find(c => c.id === formData.classId);

    toast({
      title: 'Assignment created!',
      description: `${game?.name} assigned to ${cls?.name}`,
    });

    navigate('/app/tutor/assignments');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/tutor/assignments')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Assignment</h1>
          <p className="text-muted-foreground">Assign a game to your class</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="game">Select Game *</Label>
              <Select
                value={formData.gameId}
                onValueChange={(value) => setFormData({ ...formData, gameId: value })}
              >
                <SelectTrigger className={errors.gameId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Choose a game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      <div className="flex items-center gap-2">
                        <span>{game.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({game.questions.length} questions)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gameId && <p className="text-sm text-destructive">{errors.gameId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Select Class *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData({ ...formData, classId: value })}
              >
                <SelectTrigger className={errors.classId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      <div className="flex items-center gap-2">
                        <span>{cls.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({cls.studentIds.length} students)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classId && <p className="text-sm text-destructive">{errors.classId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`pl-10 ${errors.dueDate ? 'border-destructive' : ''}`}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passPercentage">Pass Percentage (optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="passPercentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="70"
                  value={formData.passPercentage}
                  onChange={(e) => setFormData({ ...formData, passPercentage: e.target.value })}
                  className="w-24"
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty for no pass requirement
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/app/tutor/assignments')}>
                Cancel
              </Button>
              <Button type="submit">Create Assignment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
