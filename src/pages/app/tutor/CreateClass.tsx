import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDemoData, generateJoinCode } from '@/hooks/useDemoData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const subjects = ['Maths', 'English', 'Science', 'History', 'Geography', 'Languages', 'Art', 'Music', 'Other'];
const ageRanges = ['5-7', '8-11', '12-14', '15-18', 'Adult'];

export default function CreateClass() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addClass } = useDemoData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    ageRange: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.ageRange) newErrors.ageRange = 'Age range is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newClass = addClass({
      name: formData.name.trim(),
      subject: formData.subject,
      ageRange: formData.ageRange,
      description: formData.description.trim(),
      joinCode: generateJoinCode(),
      tutorId: user?.id || 'tutor-demo',
      studentIds: [],
    });

    toast({
      title: 'Class created!',
      description: `${newClass.name} has been created. Share the join code: ${newClass.joinCode}`,
    });

    navigate(`/app/tutor/classes/${newClass.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/tutor/classes')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Class</h1>
          <p className="text-muted-foreground">Add a new class and invite students</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Year 7 Maths"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
                <Label htmlFor="ageRange">Age Range *</Label>
                <Select
                  value={formData.ageRange}
                  onValueChange={(value) => setFormData({ ...formData, ageRange: value })}
                >
                  <SelectTrigger className={errors.ageRange ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageRanges.map((range) => (
                      <SelectItem key={range} value={range}>{range} years</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ageRange && <p className="text-sm text-destructive">{errors.ageRange}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the class..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/app/tutor/classes')}>
                Cancel
              </Button>
              <Button type="submit">Create Class</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
