import { Upload, Gamepad2, BarChart3, ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

const steps = [
  {
    icon: Upload,
    heading: 'Upload your revision topics',
    description:
      "Turn your notes into interactive challenges. Add your own topics or pick from our growing library of prebuilt subjects - ready to revise instantly.",
    smallText: 'Save time by importing from Docs or PDF',
  },
  {
    icon: Gamepad2,
    heading: 'Choose your preferred game modes',
    description:
      'Play your way - from flashcards and quizzes to speed games and memory matches. Studybug adapts to how you learn best.',
    smallText: '20+ learning games and counting',
  },
  {
    icon: BarChart3,
    heading: 'Track your results and improvements',
    description:
      'Every game feeds into your personal dashboard. See your strongest topics, identify gaps, and celebrate your learning streaks.',
    smallText: 'Work towards achievements & milestones',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Studybug brings your revision to life
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform how you learn
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 relative" staggerDelay={0.15}>
          {/* Connection lines (desktop only) */}
          <div className="hidden md:block absolute top-16 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary/50 to-primary/50" />
          <div className="hidden md:block absolute top-16 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary/50 to-primary/50" />

          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="relative bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-lg transition-shadow h-full">
                {/* Step number */}
                <div className="absolute -top-4 left-8 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.heading}
                </h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <p className="text-sm text-primary font-medium flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  {step.smallText}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
