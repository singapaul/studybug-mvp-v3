import { Upload, Gamepad2, BarChart3, ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Upload,
    heading: 'Upload your revision topics',
    description:
      "Turn your notes into interactive challenges. Add your own topics or pick from our growing library of prebuilt subjects - ready to revise instantly.",
    smallText: 'Save time by importing from Docs or PDF',
    color: 'bg-secondary',
    iconColor: 'text-white',
  },
  {
    icon: Gamepad2,
    heading: 'Choose your preferred game modes',
    description:
      'Play your way - from flashcards and quizzes to speed games and memory matches. Studybug adapts to how you learn best.',
    smallText: '20+ learning games and counting',
    color: 'bg-accent',
    iconColor: 'text-foreground',
  },
  {
    icon: BarChart3,
    heading: 'Track your results and improvements',
    description:
      'Every game feeds into your personal dashboard. See your strongest topics, identify gaps, and celebrate your learning streaks.',
    smallText: 'Work towards achievements & milestones',
    color: 'bg-warning',
    iconColor: 'text-foreground',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
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
          <div className="hidden md:block absolute top-20 left-1/3 w-1/3 h-0.5 bg-border" />
          <div className="hidden md:block absolute top-20 right-1/3 w-1/3 h-0.5 bg-border" />

          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <motion.div 
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-3xl border border-border p-8 shadow-sm hover:shadow-xl transition-all h-full"
              >
                {/* Step number */}
                <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full ${step.color} flex items-center justify-center ${step.iconColor} font-bold text-sm shadow-lg`}>
                  {index + 1}
                </div>

                {/* Icon */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6`}
                >
                  <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.heading}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                <p className="text-sm text-secondary font-medium flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  {step.smallText}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
