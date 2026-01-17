import { TrendingUp, Clock, BarChart3 } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Boost Engagement',
    description:
      'Students love the game-based approach - average session time: 12 minutes vs 4 minutes for traditional flashcards.',
  },
  {
    icon: Clock,
    title: 'Save Teacher Time',
    description:
      'Access 500+ pre-built curriculum-aligned decks. No prep needed. Teachers can also share decks school-wide.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description:
      'Admin dashboard shows usage across your school. See which subjects students are revising and where they need support.',
  },
];

const steps = [
  { step: 1, title: 'Book a Demo', description: 'Schedule a 20-minute call with our education team' },
  { step: 2, title: 'Custom Proposal', description: "We'll create a tailored pricing plan for your school size" },
  { step: 3, title: 'Easy Onboarding', description: "We'll help you set up SSO and import your users" },
  { step: 4, title: 'Teacher Training', description: 'Live training session for your staff (included free)' },
];

export function SchoolBenefits() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Schools Choose Studybug
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card border border-border hover:border-secondary/50 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {steps.map((item) => (
            <div key={item.step} className="text-center p-4">
              <div className="w-10 h-10 rounded-full gradient-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
