import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, History } from 'lucide-react';
import AssignmentAttemptsTab from '@/components/student/progress/AssignmentAttemptsTab';
import PersonalBestsTab from '@/components/student/progress/PersonalBestsTab';
import ProgressTrendsTab from '@/components/student/progress/ProgressTrendsTab';

export default function MyScores() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attempts');

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Scores
          </h1>
          <p className="text-muted-foreground">
            Track your progress, view your best scores, and see how you're improving over time
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="attempts" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Assignment </span>Attempts
            </TabsTrigger>
            <TabsTrigger value="bests" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Personal Bests
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress </span>Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attempts">
            <AssignmentAttemptsTab studentId={user.id} />
          </TabsContent>

          <TabsContent value="bests">
            <PersonalBestsTab studentId={user.id} />
          </TabsContent>

          <TabsContent value="trends">
            <ProgressTrendsTab studentId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
