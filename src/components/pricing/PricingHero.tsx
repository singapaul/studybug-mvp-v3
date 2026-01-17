import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/studybug-hero.webp';

interface PricingHeroProps {
  onStartTrial: () => void;
  onLearnMore: () => void;
}

export function PricingHero({ onStartTrial, onLearnMore }: PricingHeroProps) {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-primary">
      {/* Decorative shapes */}
      <motion.div 
        className="absolute top-10 left-10 w-24 h-24 rounded-full bg-warning opacity-80 hidden lg:block"
        animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-32 right-16 w-16 h-16 rounded-2xl bg-secondary rotate-12 hidden lg:block"
        animate={{ y: [0, 10, 0], rotate: [12, 18, 12] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-16 left-1/4 w-20 h-20 rounded-full bg-accent opacity-90 hidden lg:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-32 right-1/3 w-12 h-12 rounded-xl bg-coral -rotate-12 hidden lg:block"
        animate={{ rotate: [-12, -6, -12] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning text-foreground text-sm font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              14-day free trial on all paid plans
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Make Revision{' '}
              <span className="text-white">Fun</span> with Interactive Learning Games
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join thousands of students and teachers using Studybug to master any subject through engaging game-based learning.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/signup/individual')}
                className="bg-foreground text-background hover:bg-foreground/90 px-8 font-semibold"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onLearnMore}
                className="border-2 border-foreground text-foreground bg-transparent hover:bg-foreground/10"
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Main Image */}
              <motion.div 
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                animate={{ rotate: [0, 1, 0, -1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src={heroImage} 
                  alt="Students enjoying learning with Studybug" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                className="absolute -top-4 -right-4 p-4 bg-white rounded-2xl shadow-lg flex items-center gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Great job!</div>
                  <div className="text-xs text-muted-foreground">10/10 correct</div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-4 -left-4 p-4 bg-white rounded-2xl shadow-lg flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Times Tables</div>
                  <div className="text-xs text-muted-foreground">50 cards</div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-1/4 -right-6 p-3 bg-white rounded-xl shadow-lg flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-semibold text-foreground">7 day streak!</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
