import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

interface FlashCard {
  id: number;
  question: string;
  answer: string;
}

const demoCards: FlashCard[] = [
  { id: 1, question: "What is 7 × 8?", answer: "56" },
  { id: 2, question: "Capital of France?", answer: "Paris" },
  { id: 3, question: "H₂O is the formula for?", answer: "Water" },
];

export function InteractiveDemo() {
  const { t } = useLocale();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const card = demoCards[currentCard];
  const isComplete = answered.length === demoCards.length;

  const handleAnswer = (correct: boolean) => {
    if (answered.includes(currentCard)) return;
    
    setAnswered([...answered, currentCard]);
    if (correct) {
      setScore(score + 1);
    }
    
    if (answered.length + 1 === demoCards.length) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentCard((currentCard + 1) % demoCards.length);
      }, 600);
    }
  };

  const reset = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setScore(0);
    setAnswered([]);
  };

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning text-warning-foreground text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {t('demo.badge')}
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('demo.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t('demo.subtitle')}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1">
              {demoCards.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-2 rounded-full transition-colors ${
                    answered.includes(idx)
                      ? 'bg-primary'
                      : idx === currentCard
                      ? 'bg-secondary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Trophy className="w-4 h-4 text-warning" />
              {score}/{demoCards.length}
            </div>
          </div>

          {/* Card */}
          <div className="perspective-1000 mb-6">
            <motion.div
              className="relative w-full aspect-[4/3] cursor-pointer"
              onClick={() => !answered.includes(currentCard) && setIsFlipped(!isFlipped)}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl bg-primary p-8 flex flex-col items-center justify-center backface-hidden shadow-xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-xs uppercase tracking-wider text-primary-foreground/60 mb-4">
                  {t('demo.question')} {currentCard + 1}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground text-center">
                  {card.question}
                </h3>
                <span className="text-sm text-primary-foreground/60 mt-6">
                  {t('demo.tapToReveal')}
                </span>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl bg-card border-2 border-primary p-8 flex flex-col items-center justify-center shadow-xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                  {t('demo.answer')}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                  {card.answer}
                </h3>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-warning" />
                  <span className="text-xl font-bold text-foreground">
                    {score === demoCards.length ? t('demo.perfectScore') : t('demo.greatJob')}
                  </span>
                </div>
                <Button onClick={reset} variant="outline" className="mr-2">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('demo.tryAgain')}
                </Button>
              </motion.div>
            ) : isFlipped && !answered.includes(currentCard) ? (
              <motion.div
                key="answer-buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-4 justify-center"
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleAnswer(false)}
                  className="flex-1 border-coral text-coral hover:bg-coral hover:text-white"
                >
                  <X className="w-5 h-5 mr-2" />
                  {t('demo.gotItWrong')}
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {t('demo.gotItRight')}
                </Button>
              </motion.div>
            ) : (
              <motion.p
                key="instruction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground"
              >
                {t('demo.tapCard')}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Celebration overlay */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <div className="text-6xl">🎉</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
