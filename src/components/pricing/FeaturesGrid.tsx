import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';
import { 
  GameControllerIllustration, 
  FlashcardStackIllustration, 
  LibraryIllustration, 
  ProgressChartIllustration, 
  TeamIllustration, 
  TrophyIllustration 
} from '@/components/ui/animated-illustrations';

const features = [
  {
    illustration: GameControllerIllustration,
    title: '20+ Interactive Game Modes',
    description:
      'From flashcards to memory matches, speed rounds to quizzes - find the perfect way to learn.',
  },
  {
    illustration: FlashcardStackIllustration,
    title: 'Create Your Own Revision Tools',
    description:
      'Build custom decks with your own questions, images, and answers. Import from PDFs too.',
  },
  {
    illustration: LibraryIllustration,
    title: '400+ Prebuilt Revision Games',
    description:
      'Access our library of curriculum-aligned content created by teachers across the UK.',
  },
  {
    illustration: ProgressChartIllustration,
    title: 'Save & Track Your Progress',
    description:
      'See your improvement over time with detailed stats, streaks, and performance insights.',
  },
  {
    illustration: TeamIllustration,
    title: 'Classroom Management',
    description:
      'Teachers can track student progress, assign decks, and see who needs extra support.',
  },
  {
    illustration: TrophyIllustration,
    title: 'Achievement System',
    description:
      'Earn badges, unlock achievements, and compete on leaderboards to stay motivated.',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      {/* Decorative elements - using blue/pink, not green */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-secondary/10 blur-2xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-accent/15 blur-2xl" />
      
      <div className="container relative">
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
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full"
              >
                <div className="mb-5">
                  <feature.illustration size="lg" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
