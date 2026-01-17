import { Zap, Pencil, Library, BarChart, Users, Award } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: '20+ Interactive Game Modes',
    description:
      'From flashcards to memory matches, speed rounds to quizzes - find the perfect way to learn.',
    color: 'bg-primary',
    iconColor: 'text-white',
  },
  {
    icon: Pencil,
    title: 'Create Your Own Revision Tools',
    description:
      'Build custom decks with your own questions, images, and answers. Import from PDFs too.',
    color: 'bg-secondary',
    iconColor: 'text-white',
  },
  {
    icon: Library,
    title: '400+ Prebuilt Revision Games',
    description:
      'Access our library of curriculum-aligned content created by teachers across the UK.',
    color: 'bg-accent',
    iconColor: 'text-foreground',
  },
  {
    icon: BarChart,
    title: 'Save & Track Your Progress',
    description:
      'See your improvement over time with detailed stats, streaks, and performance insights.',
    color: 'bg-coral',
    iconColor: 'text-white',
  },
  {
    icon: Users,
    title: 'Classroom Management',
    description:
      'Teachers can track student progress, assign decks, and see who needs extra support.',
    color: 'bg-warning',
    iconColor: 'text-foreground',
  },
  {
    icon: Award,
    title: 'Achievement System',
    description:
      'Earn badges, unlock achievements, and compete on leaderboards to stay motivated.',
    color: 'bg-primary',
    iconColor: 'text-white',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-secondary/10 blur-2xl" />
      
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
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </motion.div>
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
