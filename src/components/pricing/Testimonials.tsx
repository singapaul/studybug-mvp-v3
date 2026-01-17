import { Star, User } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote:
      'Studybug has completely transformed how our students engage with revision. The game-based approach has improved our GCSE results by 25%.',
    name: 'Sarah Mitchell',
    title: 'Head Teacher',
    school: 'Westfield Academy, Manchester',
    accentColor: 'bg-accent',
  },
  {
    quote:
      "The analytics dashboard gives us incredible insights into student progress. We can identify struggling students early and provide targeted support.",
    name: 'David Thompson',
    title: 'Deputy Head Teacher',
    school: "St Mary's, Birmingham",
    accentColor: 'bg-secondary',
  },
  {
    quote:
      'I actually look forward to revision now! The competitive elements and achievements keep me motivated throughout the term.',
    name: 'Year 7 Student',
    title: '',
    school: 'Flintshire, North Wales',
    accentColor: 'bg-warning',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 left-[5%] w-48 h-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-10 right-[10%] w-64 h-64 rounded-full bg-accent/15 blur-2xl" />
      <div className="absolute top-1/2 right-[20%] w-32 h-32 rounded-full bg-warning/10 blur-xl" />
      
      {/* Subtle wave pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'bottom'
      }} />
      
      <div className="container relative">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by 1,500+ learners across the UK
          </h2>
          <p className="text-lg text-white/80">
            See what students and educators are saying about Studybug
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-6 shadow-xl h-full"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
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
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full ${testimonial.accentColor} flex items-center justify-center shadow-md`}
                  >
                    <User className={`w-6 h-6 ${testimonial.accentColor === 'bg-secondary' ? 'text-white' : 'text-foreground'}`} />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    {testimonial.title && (
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </div>
                    )}
                    <div className="text-sm text-secondary font-medium">{testimonial.school}</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
