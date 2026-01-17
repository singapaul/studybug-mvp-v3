import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Star, Zap, ArrowRight } from 'lucide-react';

interface PricingHeroProps {
  onStartTrial: () => void;
  onLearnMore: () => void;
}

export function PricingHero({ onStartTrial, onLearnMore }: PricingHeroProps) {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-primary">
      {/* Subtle decorative circles */}
      <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-10 right-[15%] w-48 h-48 rounded-full bg-secondary/20 blur-2xl" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-foreground text-sm font-semibold mb-6 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Zap className="w-4 h-4 text-secondary" />
              14-day free trial on all paid plans
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Make Revision{' '}
              <span className="text-warning">Fun</span> with Interactive Learning Games
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0"
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
                className="bg-white text-primary hover:bg-white/90 px-8 font-semibold rounded-full shadow-lg hover-lift btn-glow"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onLearnMore}
                className="border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-full"
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Game Mockup */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main game card */}
              <motion.div 
                className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Game header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-foreground">Speed Round</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span>8/10</span>
                  </div>
                </div>

                {/* Question card */}
                <div className="bg-secondary rounded-2xl p-6 mb-4 text-center">
                  <p className="text-xs text-white/70 uppercase tracking-wide mb-2">Question 9</p>
                  <h3 className="text-2xl font-bold text-white">What is 12 × 7?</h3>
                </div>

                {/* Answer options */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {['72', '84', '96', '78'].map((answer, i) => (
                    <motion.button
                      key={answer}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                        answer === '84' 
                          ? 'bg-primary text-white shadow-md' 
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {answer}
                    </motion.button>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </motion.div>

              {/* Floating success card */}
              <motion.div 
                className="absolute -top-6 -right-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Correct!</div>
                  <div className="text-xs text-muted-foreground">+10 points</div>
                </div>
              </motion.div>

              {/* Floating streak card */}
              <motion.div 
                className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <div className="w-10 h-10 rounded-xl bg-coral flex items-center justify-center">
                  <span className="text-white font-bold">🔥</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">7 Day Streak!</div>
                  <div className="text-xs text-muted-foreground">Keep it up</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
