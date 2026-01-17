import { Star } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

const testimonials = [
  {
    quote:
      'Studybug has completely transformed how our students engage with revision. The game-based approach has improved our GCSE results by 25%.',
    initials: 'SM',
    name: 'Sarah Mitchell',
    title: 'Head Teacher',
    school: 'Westfield Academy, Manchester',
  },
  {
    quote:
      "The analytics dashboard gives us incredible insights into student progress. We can identify struggling students early and provide targeted support.",
    initials: 'DT',
    name: 'David Thompson',
    title: 'Deputy Head Teacher',
    school: "St Mary's, Birmingham",
  },
  {
    quote:
      'I actually look forward to revision now! The competitive elements and achievements keep me motivated throughout the term.',
    initials: 'YS',
    name: 'Year 7 Student',
    title: '',
    school: 'Flintshire, North Wales',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by 1,500+ learners across the UK
          </h2>
          <p className="text-lg text-muted-foreground">
            See what students and educators are saying about Studybug
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow relative h-full">
                {/* Accent border */}
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary to-accent" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    {testimonial.title && (
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </div>
                    )}
                    <div className="text-sm text-primary">{testimonial.school}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
