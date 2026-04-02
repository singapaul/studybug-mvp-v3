import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Rocket, Layers, Library } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SignupComplete() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const welcomeEmailSentRef = useRef(false);

  const dashboardPath = session?.user.role === Role.TUTOR ? '/tutor/dashboard' : '/student/dashboard';

  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#7c3aed', '#a855f7', '#22c55e', '#eab308', '#3b82f6'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#7c3aed', '#a855f7', '#22c55e', '#eab308', '#3b82f6'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Mock: welcome email would be sent here in production
  useEffect(() => {
    if (session?.user.id && !welcomeEmailSentRef.current) {
      welcomeEmailSentRef.current = true;
      console.log('Mock: send-welcome-email for userId:', session.user.id);
    }
  }, [session?.user.id]);

  const onboardingCards = [
    {
      icon: Rocket,
      title: 'Play a Pre-Built Deck',
      description: 'Try our Times Tables deck to see how it works',
      cta: 'Start Playing',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Layers,
      title: 'Create Your First Deck',
      description: 'Make a custom revision deck for your subject',
      cta: 'Create Deck',
      color: 'bg-accent/10 text-accent-foreground',
    },
    {
      icon: Library,
      title: 'Browse the Library',
      description: 'Explore decks created by teachers',
      cta: 'Browse Library',
      color: 'bg-success/10 text-success',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  const firstName = session?.user.firstName ?? 'there';

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-2xl">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="space-y-8 animate-fade-in text-center">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full gradient-success flex items-center justify-center shadow-lg animate-pulse">
                    <CheckCircle2 className="w-12 h-12 text-success-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Welcome to Studybug, {firstName}! 🎉
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your 14-day free trial has started. Let's get you set up!
                </p>
              </div>

              {/* Account Summary */}
              {session && (
                <div className="p-6 rounded-xl bg-muted/50 border border-border text-left">
                  <h3 className="font-semibold text-foreground mb-4">Your Account</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium text-foreground">{session.user.email}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Account type</span>
                      <span className="font-medium text-primary capitalize">
                        {session.user.role === Role.TUTOR ? 'Teacher' : 'Student'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Onboarding Cards */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">What would you like to do first?</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {onboardingCards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(dashboardPath)}
                      className="flex flex-col items-center p-6 rounded-xl border border-border bg-card text-center hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-medium text-foreground mb-1">{card.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                      <span className="text-sm font-medium text-primary">{card.cta} →</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main CTA */}
              <div className="pt-4 space-y-3">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8" asChild>
                  <Link to={dashboardPath}>
                    <Rocket className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
