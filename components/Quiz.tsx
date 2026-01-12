
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS, EXPERT } from '../constants';

interface QuizProps {
  onComplete: (answers: string[]) => void;
  onExit: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsAnalyzing(true);
    }
  };

  useEffect(() => {
    if (isAnalyzing) {
      const timer = setTimeout(() => {
        onComplete(answers);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, answers, onComplete]);

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 mb-4 relative"
        >
          <img 
            src={EXPERT.heroImage} 
            alt={EXPERT.name} 
            className="w-full h-full object-cover object-top rounded-full border-2 border-premium-gold shadow-xl"
          />
        </motion.div>
        <h2 className="text-xl font-serif mb-3">Analisando seu perfil...</h2>
        <div className="w-full max-w-[200px] bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            className="bg-premium-gold h-full rounded-full"
          />
        </div>
        <p className="text-gray-400 text-[10px] animate-pulse italic uppercase tracking-widest">
          Personalizando sua experiência
        </p>
      </div>
    );
  }

  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#fdfaf7] w-full max-w-[340px] rounded-[32px] relative border border-gold-200/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        {/* Floating Header Photo - Corrigido o corte (removido overflow-hidden do pai) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="p-1 bg-gradient-to-tr from-premium-gold via-gold-200 to-premium-gold rounded-full shadow-2xl">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
              <img 
                src={EXPERT.heroImage} 
                alt={EXPERT.name} 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-6">
          <div className="text-center mb-6">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-premium-gold font-black mb-3">Dra. {EXPERT.name}</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-premium-gold"
                />
              </div>
              <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">{currentStep + 1} / {QUIZ_QUESTIONS.length}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[240px] flex flex-col justify-start"
            >
              <h2 className="text-xl font-serif text-gray-900 leading-tight mb-6 text-center">
                {QUIZ_QUESTIONS[currentStep].question}
              </h2>

              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(option)}
                    className="w-full py-4 px-5 text-center rounded-2xl border border-gray-100 bg-white hover:border-premium-gold/50 hover:bg-gold-50/20 transition-all duration-200 shadow-sm text-sm text-gray-700 font-semibold"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={onExit}
            className="mt-8 text-[11px] text-gray-400 underline w-full text-center hover:text-premium-gold transition-colors uppercase tracking-widest font-black"
          >
            Pular e ir para o site
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz;
