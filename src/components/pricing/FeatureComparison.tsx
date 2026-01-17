import { Check, X, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const features = [
  {
    name: 'Number of game modes',
    free: '3 modes',
    student: 'All modes',
    teacher: 'All modes',
    school: 'All modes',
    tooltip: 'Interactive revision games like memory matching, flashcards, and quizzes',
  },
  {
    name: 'Pre-built subjects',
    free: '10 subjects',
    student: 'All subjects',
    teacher: 'All subjects',
    school: 'All subjects',
    tooltip: 'Ready-made revision decks covering popular exam topics',
  },
  {
    name: 'Custom deck creation',
    free: false,
    student: 'Unlimited',
    teacher: 'Unlimited',
    school: 'Unlimited',
    tooltip: 'Create your own revision decks with custom questions and answers',
  },
  {
    name: 'Progress tracking',
    free: false,
    student: true,
    teacher: true,
    school: true,
    tooltip: 'Track your learning progress and see improvement over time',
  },
  {
    name: 'Deck sharing',
    free: false,
    student: 'Via link',
    teacher: 'Via link + Library',
    school: 'Via link + Library',
    tooltip: 'Share your custom decks with friends, students, or the community',
  },
  {
    name: 'Published library access',
    free: false,
    student: 'View only',
    teacher: 'View + Publish',
    school: 'View + Publish',
    tooltip: 'Access and contribute to the community library of shared decks',
  },
  {
    name: 'Student tracking',
    free: false,
    student: false,
    teacher: 'Basic',
    school: 'Advanced',
    tooltip: 'Monitor student progress and assign revision activities',
  },
  {
    name: 'Export/import decks',
    free: false,
    student: false,
    teacher: true,
    school: true,
    tooltip: 'Export decks to CSV or import from other platforms',
  },
  {
    name: 'Priority support',
    free: false,
    student: false,
    teacher: 'Email',
    school: 'Dedicated',
    tooltip: 'Get faster responses from our support team',
  },
  {
    name: 'SSO integration',
    free: false,
    student: false,
    teacher: false,
    school: true,
    tooltip: 'Single sign-on with your school\'s existing authentication system',
  },
  {
    name: 'Admin dashboard',
    free: false,
    student: false,
    teacher: false,
    school: true,
    tooltip: 'Manage users, view analytics, and control access',
  },
  {
    name: 'Custom training',
    free: false,
    student: false,
    teacher: false,
    school: true,
    tooltip: 'Personalized onboarding and training for your institution',
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
          <Check className="w-4 h-4 text-primary" strokeWidth={3} />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <X className="w-4 h-4 text-destructive" strokeWidth={2.5} />
        </div>
      </div>
    );
  }
  return <span className="text-sm text-foreground font-medium">{value}</span>;
}

export function FeatureComparison() {
  return (
    <section className="py-16">
      <ScrollReveal>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Compare Plans
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect plan for your learning journey
          </p>
        </div>
      </ScrollReveal>

      {/* Table - always visible */}
      <ScrollReveal delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">
                  Features
                </th>
                <th className="text-center py-4 px-4 font-semibold text-muted-foreground">
                  Free
                </th>
                <th className="text-center py-4 px-4 font-semibold text-primary bg-primary/5 rounded-t-xl">
                  Student
                  <span className="block text-xs font-normal text-primary/70">
                    Most Popular
                  </span>
                </th>
                <th className="text-center py-4 px-4 font-semibold text-foreground">
                  Teacher
                </th>
                <th className="text-center py-4 px-4 font-semibold text-foreground">
                  School
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{feature.name}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <FeatureValue value={feature.free} />
                  </td>
                  <td className="py-4 px-4 text-center bg-primary/5">
                    <FeatureValue value={feature.student} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <FeatureValue value={feature.teacher} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <FeatureValue value={feature.school} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </section>
  );
}
