import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Gamepad2, Zap, BookOpen, Timer, Brain, CheckCircle, 
  Pencil, BarChart3, Trophy, WifiOff, Users, School,
  FileDown, Sparkles, GraduationCap
} from 'lucide-react';

const gameModes = [
  { icon: Gamepad2, name: 'Flip & Match', description: 'Classic memory matching game' },
  { icon: Zap, name: 'Splat!', description: 'Fast-paced card reactions' },
  { icon: CheckCircle, name: 'Multiple Choice', description: 'Quiz-style assessments' },
  { icon: BookOpen, name: 'Flashcards', description: 'Traditional revision cards' },
  { icon: Timer, name: 'Speed Round', description: 'Beat the clock challenges' },
  { icon: Brain, name: 'Memory Challenge', description: 'Test your retention' },
  { icon: CheckCircle, name: 'True/False', description: 'Quick decision games' },
  { icon: Pencil, name: 'Fill in the Blanks', description: 'Complete the sentence' },
];

const studentFeatures = [
  { icon: Pencil, title: 'Custom deck creation', description: 'Build your own revision materials tailored to your needs' },
  { icon: BarChart3, title: 'Progress tracking', description: 'See your improvement over time with detailed analytics' },
  { icon: Trophy, title: 'Achievement system', description: 'Earn badges and rewards as you progress' },
  { icon: WifiOff, title: 'Offline mode', description: 'Download decks and study without internet' },
];

const teacherFeatures = [
  { icon: Users, title: 'Classroom management', description: 'Organize students into classes and groups' },
  { icon: BarChart3, title: 'Student tracking', description: 'Monitor individual and class progress' },
  { icon: BookOpen, title: 'Pre-built curriculum decks', description: '400+ ready-to-use subject decks' },
  { icon: FileDown, title: 'Export/import tools', description: 'Share and backup your materials' },
];

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Make{' '}
              <span className="text-gradient">Learning Engaging</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover all the features that make Studybug the most engaging revision platform for students and teachers.
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
              <Link to="/signup/individual">Start Free Trial</Link>
            </Button>
          </div>
        </section>

        {/* Game Modes */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Gamepad2 className="w-4 h-4" />
                20+ Game Modes
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Interactive Game Modes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from a variety of game types to keep learning fresh and engaging.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {gameModes.map((mode, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <mode.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{mode.name}</h3>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Students */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-4">
                  <GraduationCap className="w-4 h-4" />
                  For Students
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Master Any Subject Your Way
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Create custom decks, track your progress, and earn achievements as you learn.
                </p>
                <div className="space-y-4">
                  {studentFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  <GraduationCap className="w-32 h-32 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Teachers */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <School className="w-32 h-32 text-primary/40" />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <School className="w-4 h-4" />
                  For Teachers
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Powerful Classroom Tools
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Manage your classes, track student progress, and access hundreds of curriculum-aligned decks.
                </p>
                <div className="space-y-4">
                  {teacherFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Try It?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Start your 14-day free trial and experience all features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
                <Link to="/signup/individual">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
