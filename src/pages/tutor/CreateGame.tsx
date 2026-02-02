import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameType } from '@/types/game';
import { GAME_TEMPLATES } from '@/lib/game-templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, LayoutGrid, BookOpen, CheckCircle, Zap, Move, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ICON_MAP: Record<string, any> = {
  LayoutGrid,
  BookOpen,
  CheckCircle,
  Zap,
  Move,
};

export default function CreateGame() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<GameType | null>(null);

  const handleSelectType = (type: GameType) => {
    setSelectedType(type);
    // Navigate to builder with selected type
    navigate(`/tutor/games/build/${type.toLowerCase()}`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/tutor/games')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>

          <div>
            <h1 className="text-3xl font-bold">Create New Game</h1>
            <p className="text-muted-foreground mt-1">
              Choose a game type to get started
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GAME_TEMPLATES.map((template) => {
            const Icon = ICON_MAP[template.icon];
            const isSelected = selectedType === template.type;

            return (
              <Card
                key={template.type}
                className={`hover:shadow-lg transition-all cursor-pointer group ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelectType(template.type)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4 mb-2">
                    <div className={`p-3 rounded-lg ${template.color} bg-opacity-10`}>
                      <Icon
                        className={`h-8 w-8 ${template.color.replace('bg-', 'text-')}`}
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Min. {template.minItems} items required
                      </p>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
                    variant={isSelected ? 'default' : 'outline'}
                  >
                    Choose {template.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Need help choosing?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">For Vocabulary & Matching:</p>
              <p>Choose <strong>Pairs</strong> or <strong>Flashcards</strong></p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">For Assessments & Quizzes:</p>
              <p>Choose <strong>Multiple Choice</strong></p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">For Fast-Paced Learning:</p>
              <p>Choose <strong>Splat</strong> for timed challenges</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">For True/False Questions:</p>
              <p>Choose <strong>Swipe</strong> for quick decisions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
