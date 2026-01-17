import { Zap, Pencil, Library, BarChart, Users, Award } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

const features = [
  {
    icon: Zap,
    title: '20+ Interactive Game Modes',
    description:
      'From flashcards to memory matches, speed rounds to quizzes - find the perfect way to learn.',
    color: 'bg-primary',
  },
  {
    icon: Pencil,
    title: 'Create Your Own Revision Tools',
    description:
      'Build custom decks with your own questions, images, and answers. Import from PDFs too.',
    color: 'bg-secondary',
  },
  {
    icon: Library,
    title: '400+ Prebuilt Revision Games',
    description:
      'Access our library of curriculum-aligned content created by teachers across the UK.',
    color: 'bg-accent',
  },
  {
    icon: BarChart,
    title: 'Save & Track Your Progress',
    description:
      'See your improvement over time with detailed stats, streaks, and performance insights.',
    color: 'bg-coral',
  },
  {
    icon: Users,
    title: 'Classroom Management',
    description:
      'Teachers can track student progress, assign decks, and see who needs extra support.',
    color: 'bg-warning',
  },
  {
    icon: Award,
    title: 'Achievement System',
    description:
      'Earn badges, unlock achievements, and compete on leaderboards to stay motivated.',
    color: 'bg-primary',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-cream">
      <div className="container">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to ace your exams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for students, teachers, and schools
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <div className="group bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
