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
    accentColor: 'bg-primary',
  },
  {
    quote:
      "The analytics dashboard gives us incredible insights into student progress. We can identify struggling students early and provide targeted support.",
    initials: 'DT',
    name: 'David Thompson',
    title: 'Deputy Head Teacher',
    school: "St Mary's, Birmingham",
    accentColor: 'bg-secondary',
  },
  {
    quote:
      'I actually look forward to revision now! The competitive elements and achievements keep me motivated throughout the term.',
    initials: 'YS',
    name: 'Year 7 Student',
    title: '',
    school: 'Flintshire, North Wales',
    accentColor: 'bg-accent',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Trusted by 1,500+ learners across the UK
          </h2>
          <p className="text-lg text-secondary-foreground/80">
            See what students and educators are saying about Studybug
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative h-full">
                {/* Accent top bar */}
                <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${testimonial.accentColor}`} />

                {/* Stars */}
                <div className="flex gap-1 mb-4 pt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${testimonial.accentColor} flex items-center justify-center text-white font-bold`}>
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
                    <div className="text-sm text-primary font-medium">{testimonial.school}</div>
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
