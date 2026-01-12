
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Quiz from './components/Quiz';
import Result from './components/Result';
import LandingPage from './components/LandingPage';
import { AppState } from './types';
import { EXPERT } from './constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.GATEWAY);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  const handleQuizComplete = (answers: string[]) => {
    setQuizAnswers(answers);
    setCurrentStep(AppState.RESULT);
  };

  return (
    <div className="relative font-sans text-gray-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {/* Gateway Screen */}
        {currentStep === AppState.GATEWAY && (
          <motion.div 
            key="gateway"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#fdfaf7] flex flex-col items-center justify-center p-8 overflow-y-auto no-scrollbar"
          >
            {/* Background Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-premium-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-200/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10 text-center max-w-sm w-full space-y-10 py-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
                className="relative mx-auto w-48 h-48 md:w-56 md:h-56 group"
              >
                <div className="absolute inset-0 bg-premium-gold/30 rounded-full blur-2xl animate-pulse scale-110"></div>
                <div className="absolute inset-0 p-1 bg-gradient-to-tr from-[#d4af37] via-[#f1d27b] to-[#b8860b] rounded-full shadow-2xl">
                   <div className="w-full h-full bg-white rounded-full p-1.5 overflow-hidden">
                      <img 
                        src={EXPERT.heroImage} 
                        alt={EXPERT.name} 
                        className="w-full h-full object-cover object-top rounded-full"
                      />
                   </div>
                </div>
                <div className="absolute -bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow-lg border border-gold-200/50 flex items-center gap-1 z-20">
                  <span className="text-[8px] font-bold text-premium-gold uppercase tracking-tighter">Premium Expert</span>
                </div>
              </motion.div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="signature text-5xl text-premium-gold drop-shadow-sm">Dra. {EXPERT.name}</div>
                  <div className="h-[1px] w-24 bg-premium-gold/20 mx-auto"></div>
                </div>
                <div className="space-y-3 px-2">
                  <h1 className="text-2xl font-serif text-gray-800 leading-tight">
                    Sua melhor versão começa com uma <span className="italic">decisão.</span>
                  </h1>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Escolha como deseja iniciar sua experência exclusiva de cuidado e beleza.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentStep(AppState.QUIZ)}
                  className="bg-gray-900 text-white py-5 px-8 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-3 group"
                >
                  Fazer Avaliação Personalizada
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentStep(AppState.MAIN_SITE)}
                  className="bg-white text-gray-800 border-2 border-gray-100 py-5 px-8 rounded-2xl font-bold hover:border-premium-gold transition-all shadow-sm"
                >
                  Explorar o site completo
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quiz Flow */}
        {currentStep === AppState.QUIZ && (
          <Quiz 
            onComplete={handleQuizComplete} 
            onExit={() => setCurrentStep(AppState.MAIN_SITE)}
          />
        )}

        {/* Result Page */}
        {currentStep === AppState.RESULT && (
          <Result 
            answers={quizAnswers} 
            onContinue={() => setCurrentStep(AppState.MAIN_SITE)} 
          />
        )}

        {/* Main Site - Removido y: 50 para estabilizar o scroll das âncoras */}
        {currentStep === AppState.MAIN_SITE && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
