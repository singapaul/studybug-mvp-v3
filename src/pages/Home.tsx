import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Gamepad2, TrendingUp, Sparkles, Target, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, session } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      const redirectPath =
        session.user.role === Role.TUTOR ? '/tutor/dashboard' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header/Nav */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">StudyBug</span>
            </div>
            <Button onClick={() => navigate('/login')} size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Interactive Learning Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Make Learning
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Fun & Engaging
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create interactive games, organize students into groups, and track progress — all in one
            place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button onClick={() => navigate('/login')} size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              View Demo
            </Button>
          </div>

          {import.meta.env.DEV && (
            <p className="text-sm text-amber-600 dark:text-amber-500 font-medium mt-4">
              Development Mode: Click "Get Started" to choose your role
            </p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools for tutors and engaging experiences for students
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Gamepad2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Interactive Games</CardTitle>
              <CardDescription>
                Create engaging learning games including Pairs, Flashcards, Splat, and more
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Group Management</CardTitle>
              <CardDescription>
                Organize students into classes with simple join codes and easy administration
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor student performance with detailed analytics and score tracking
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 4 */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>
                Set deadlines, assign games to groups, and track completion rates
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 5 */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle>Engaging Experience</CardTitle>
              <CardDescription>
                Beautiful animations, sound effects, and motivational elements keep students engaged
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 6 */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>
                Intuitive interface designed for both tutors and students — no training required
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/50 rounded-3xl my-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Choose whether you're a tutor or student. Tutors can create groups and games,
                  while students join with a code.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Set Up Your Classroom</h3>
                <p className="text-muted-foreground">
                  Tutors create groups and design interactive games. Students enter a join code to
                  access their assignments.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Learn & Track Progress</h3>
                <p className="text-muted-foreground">
                  Students play engaging games while tutors monitor performance, assign new
                  activities, and celebrate achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Learning?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of educators making learning fun and effective
          </p>
          <Button onClick={() => navigate('/login')} size="lg" className="text-lg px-8">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-semibold">StudyBug</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StudyBug. Interactive learning platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
