import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Upload, Gamepad2, BarChart3, FileText, Library, 
  Settings, Target, Trophy, Sparkles, ChevronRight
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const steps = [
  {
    number: 1,
    icon: Upload,
    title: 'Upload your revision topics',
    description: 'Turn your notes into interactive challenges. Add your own topics or pick from our growing library of prebuilt subjects.',
    tips: [
      { icon: FileText, text: 'Import from Word docs, PDFs, or spreadsheets' },
      { icon: Library, text: 'Browse 400+ pre-built curriculum decks' },
      { icon: Settings, text: 'Customize cards with images and hints' },
    ],
  },
  {
    number: 2,
    icon: Gamepad2,
    title: 'Choose your game mode',
    description: 'Play your way - from flashcards and quizzes to speed games and memory matches. Studybug adapts to how you learn best.',
    tips: [
      { icon: Target, text: 'Select difficulty levels that match your skill' },
      { icon: Settings, text: 'Customize game settings and time limits' },
      { icon: Gamepad2, text: '20+ different game modes to choose from' },
    ],
  },
  {
    number: 3,
    icon: BarChart3,
    title: 'Track your results',
    description: 'Every game feeds into your personal dashboard. See your strongest topics, identify gaps, and celebrate your learning streaks.',
    tips: [
      { icon: BarChart3, text: 'Detailed performance analytics' },
      { icon: Trophy, text: 'Earn achievements and badges' },
      { icon: Target, text: 'Set goals and track milestones' },
    ],
  },
];

const faqs = [
  {
    question: 'How long does it take to create my first deck?',
    answer: 'Most users create their first deck in under 5 minutes. You can start with a pre-built deck instantly, or create a simple custom deck in just a few clicks.',
  },
  {
    question: 'Can I import my existing notes?',
    answer: 'Yes! You can import content from Word documents, PDFs, and spreadsheets. Our smart import feature will help format your content into interactive cards.',
  },
  {
    question: 'Which game mode should I start with?',
    answer: 'We recommend starting with Flashcards to get familiar with the content, then moving to more challenging modes like Speed Round or Memory Challenge.',
  },
  {
    question: 'How does progress tracking work?',
    answer: 'Every time you play, your results are recorded. The dashboard shows your accuracy, time spent, streak days, and which topics need more practice.',
  },
  {
    question: 'Can I use Studybug on my phone?',
    answer: 'Yes! Studybug works on any device with a web browser. Paid plans also include offline mode so you can study without internet.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              From signup to your first game in under 5 minutes
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get Started in{' '}
              <span className="text-gradient">3 Simple Steps</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Studybug makes it easy to turn any subject into an engaging learning game. Here's how it works.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="space-y-20">
              {steps.map((step, index) => (
                <div key={step.number} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    {/* Step Number */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                        {step.number}
                      </div>
                      <div className="h-px flex-1 bg-border max-w-[100px]" />
                    </div>

                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {step.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {step.description}
                    </p>

                    {/* Tips */}
                    <div className="space-y-4">
                      {step.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <tip.icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-muted-foreground">{tip.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Illustration */}
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="aspect-video rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border border-border flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center shadow-xl">
                        <step.icon className="w-12 h-12 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Common Getting Started Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know to get started with Studybug.
              </p>
            </div>

            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-semibold text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
              Start your 14-day free trial and see how easy revision can be.
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
              <Link to="/signup/individual">
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
