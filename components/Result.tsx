
import React from 'react';
import { motion } from 'framer-motion';
import { EXPERT } from '../constants';

interface ResultProps {
  answers: string[];
  onContinue: () => void;
}

const Result: React.FC<ResultProps> = ({ answers, onContinue }) => {
  const whatsappUrlWithData = `${EXPERT.whatsapp}%0A%0A*Minha Avaliação:*%0A${answers.map((a, i) => `${i+1}. ${a}`).join('%0A')}`;

  return (
    <div className="fixed inset-0 z-[100] bg-[#fdfaf7] flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-premium-gold rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <img 
            src={EXPERT.heroImage} 
            alt={EXPERT.name} 
            className="w-48 h-48 object-cover object-top rounded-3xl border-4 border-white shadow-2xl relative z-10 grayscale-[30%]"
          />
        </div>

        <div className="space-y-4 mb-10">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-premium-gold font-bold tracking-[0.2em] text-xs uppercase"
          >
            Perfil Compatível
          </motion.h2>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-serif text-gray-900 leading-tight"
          >
            Você é a Paciente ideal.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 leading-relaxed px-4"
          >
            Com base nas suas respostas, o Método da <span className="font-bold text-gray-800">Dra. {EXPERT.name}</span> consegue entregar exatamente a naturalidade e segurança que você procura.
          </motion.p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={whatsappUrlWithData}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white py-5 px-6 rounded-2xl font-bold shadow-xl shadow-green-200 flex items-center justify-center gap-2"
          >
            1 - Enviar minha avaliação à Dra.
          </motion.a>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="bg-gray-900 text-white py-5 px-6 rounded-2xl font-bold shadow-xl"
          >
            2 - Não enviar e continuar no site
          </motion.button>

          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={EXPERT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-800 border-2 border-gray-100 py-5 px-6 rounded-2xl font-bold"
          >
            3 - Chamar no WhatsApp sem compromisso
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Result;
