import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Sparkles, BookOpen, Gamepad2 } from 'lucide-react';
import heroImage from '@/assets/studybug-hero.webp';

interface PricingHeroProps {
  onStartTrial: () => void;
  onLearnMore: () => void;
}

export function PricingHero({ onStartTrial, onLearnMore }: PricingHeroProps) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary/90">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-coral/10 blur-2xl" />
      </div>
      
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Social proof pill */}
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">S</div>
                <div className="w-6 h-6 rounded-full bg-coral flex items-center justify-center text-xs font-bold text-white">T</div>
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">P</div>
              </div>
              <span>Loved by 10,000+ students & teachers</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Learning That{' '}
              <span className="relative">
                <span className="relative z-10 text-accent">Feels Like Play.</span>
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-accent/30 rounded-full -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-white/80 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Transform any subject into addictive learning games. Students study more, remember better, and actually enjoy revision.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/signup/individual')}
                className="bg-primary text-white hover:bg-primary/90 font-semibold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Start Free Trial
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onLearnMore}
                className="border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
              >
                <Play className="mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Quick stats */}
            <motion.div 
              className="flex flex-wrap gap-6 justify-center lg:justify-start text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>400+ ready-made decks</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                <span>20+ game modes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Used in 500+ schools</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div 
            className="relative hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Main image container with glow */}
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-primary/30 to-coral/40 rounded-[2.5rem] blur-2xl scale-105" />
              
              {/* Main image card */}
              <motion.div 
                className="relative bg-white rounded-[2rem] p-3 shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src={heroImage} 
                  alt="Students enjoying Studybug learning games" 
                  className="w-full max-w-md rounded-[1.5rem] object-cover"
                />
                
                {/* Floating badge - top right */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">Fun & Effective</span>
                </motion.div>

                {/* Floating stat - bottom left */}
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-white border border-border px-4 py-3 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-2xl font-bold text-foreground">92%</div>
                  <div className="text-xs text-muted-foreground">improved grades</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
