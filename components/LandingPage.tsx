
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from "@google/genai";
import { EXPERT, RESULTS_IMAGES, HEART_IMAGES, TESTIMONIALS } from '../constants';
import { decodeAudioData, decode } from '../utils/audio';

const LandingPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const introText = "Descubra como a beleza pode ser realçada com técnica, sensibilidade e propósito. Resultados naturais e transformadores. Aperte o play e sinta a diferença de ser cuidada por quem entende que sua beleza é única, e merece atenção especial.";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleHearDra = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    setShowCaption(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Diga com voz calma, elegante e acolhedora: ${introText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Voz feminina elegante
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        // Simulação simples de legenda sincronizada
        const words = introText.split(' ');
        let wordIndex = 0;
        const interval = (audioBuffer.duration * 1000) / words.length;
        
        const captionInterval = setInterval(() => {
          if (wordIndex < words.length) {
            setCurrentCaption(words.slice(0, wordIndex + 1).join(' '));
            wordIndex++;
          } else {
            clearInterval(captionInterval);
          }
        }, interval);

        source.onended = () => {
          setIsSpeaking(false);
          setTimeout(() => {
            setShowCaption(false);
            setCurrentCaption("");
          }, 2000);
        };

        source.start();
      }
    } catch (error) {
      console.error("Erro ao gerar áudio:", error);
      setIsSpeaking(false);
      setShowCaption(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 md:px-4">
          <div className="flex items-center justify-center h-12 md:h-20 gap-2 md:gap-10 overflow-x-auto no-scrollbar whitespace-nowrap">
            <a href="#sobre-dra" onClick={(e) => scrollToSection(e, 'sobre-dra')} className="nav-link">Sobre a Dra.</a>
            <a href="#prova-visual" onClick={(e) => scrollToSection(e, 'prova-visual')} className="nav-link">Prova Visual</a>
            <a href="#harmonizacao" onClick={(e) => scrollToSection(e, 'harmonizacao')} className="nav-link">Harmonização de ❤️</a>
            <a href="#onde-encontrar" onClick={(e) => scrollToSection(e, 'onde-encontrar')} className="nav-link">Onde nos Encontrar</a>
          </div>
        </div>
      </nav>

      <style>{`
        .nav-link {
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7280;
          transition: all 0.3s;
          padding: 8px 4px;
          border-bottom: 2px solid transparent;
          flex-shrink: 0;
        }
        @media (min-width: 768px) { .nav-link { font-size: 11px; } }
        .nav-link:hover { color: #b8860b; border-color: #b8860b; }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-48 pb-10 px-6 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative z-10 order-2 md:order-1 text-center md:text-left">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <h2 className="text-premium-gold font-bold tracking-widest text-sm uppercase">Dra. {EXPERT.name} | {EXPERT.cro}</h2>
            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight">
              A sensibilidade de um olhar que valoriza a sua <span className="italic">essência única.</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Realce sua beleza natural com técnica avançada e resultados que não parecem artificiais.
            </p>
            <div className="space-y-4 pt-4">
              <a href={EXPERT.whatsapp} className="inline-block w-full md:w-auto bg-premium-gold text-white py-5 px-10 rounded-full font-bold shadow-2xl hover:brightness-110 transition-all text-center">
                Agendar consulta no WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        <div className="relative order-1 md:order-2">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
            <div className="absolute -inset-4 bg-premium-gold/10 rounded-full blur-[100px]"></div>
            <img src={EXPERT.heroImage} alt={EXPERT.name} className="relative w-full aspect-[4/5] object-cover object-top rounded-[40px] shadow-2xl z-10 grayscale-[10%]" />
          </motion.div>
        </div>
      </section>

      {/* Video Presentation Section with Audio & Captions */}
      <section className="bg-white py-12 md:py-20 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 relative">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-black group">
                <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-auto block">
                  <source src={EXPERT.introVideo} type="video/mp4" />
                </video>
                
                {/* Legendas Dinâmicas Overlay */}
                <AnimatePresence>
                  {showCaption && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-6 left-6 right-6 z-20 text-center"
                    >
                      <div className="bg-black/60 backdrop-blur-md text-white py-3 px-6 rounded-2xl inline-block border border-white/10 shadow-2xl max-w-lg">
                        <p className="text-sm md:text-base font-medium leading-relaxed">
                          {currentCaption || "..."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controles do Vídeo */}
                <div className="absolute top-4 right-4 flex gap-2">
                   <button 
                    onClick={toggleMute}
                    className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white border border-white/10 hover:bg-white/20 transition-colors"
                   >
                     {isMuted ? (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                     ) : (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                     )}
                   </button>
                </div>

                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[9px] font-black tracking-widest uppercase border border-white/10">
                  Original 720p
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="inline-block px-3 py-1 bg-gold-50 text-premium-gold text-[10px] font-black uppercase tracking-widest rounded-full">
                    Apresentação
                  </div>
                  {isSpeaking && <div className="flex gap-0.5"><div className="w-1 h-3 bg-premium-gold animate-bounce"></div><div className="w-1 h-4 bg-premium-gold animate-bounce delay-75"></div><div className="w-1 h-3 bg-premium-gold animate-bounce delay-150"></div></div>}
                </div>
                
                <h3 className="text-3xl font-serif text-gray-900 leading-snug">Técnica, sensibilidade e propósito.</h3>
                <p className="text-gray-600 leading-relaxed text-base italic border-l-4 border-premium-gold/30 pl-6">
                  {introText}
                </p>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    onClick={handleHearDra}
                    disabled={isSpeaking}
                    className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all shadow-lg ${isSpeaking ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 border-2 border-premium-gold/20 hover:border-premium-gold hover:shadow-gold-100'}`}
                  >
                    <svg className="w-5 h-5 text-premium-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/></svg>
                    {isSpeaking ? 'Narrando...' : 'Ouça a Dra. Brenda'}
                  </button>
                  <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold text-center">Narrativa Personalizada via AI</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Outras sessões permanecem as mesmas */}
      <section id="sobre-dra" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <h2 className="text-4xl font-serif">A ciência por trás do seu sorriso.</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Olá, eu sou a Dra. Brenda Pereira. Minha jornada na Harmonização Facial nasceu da paixão por revelar o que cada rosto tem de mais belo.</p>
              <ul className="space-y-3 font-semibold text-gray-800">
                <li className="flex gap-3"><span className="text-premium-gold">✓</span> Avaliação honesta e personalizada</li>
                <li className="flex gap-3"><span className="text-premium-gold">✓</span> Foco total em naturalidade</li>
                <li className="flex gap-3"><span className="text-premium-gold">✓</span> Materiais de altíssima qualidade</li>
              </ul>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <img src={EXPERT.secondaryImage} className="rounded-2xl shadow-lg mt-8 w-full object-cover aspect-[3/4]" alt="Atendimento" />
            <img src={EXPERT.tertiaryImage} className="rounded-2xl shadow-lg w-full object-cover aspect-[3/4]" alt="Dra Brenda" />
          </div>
        </div>
      </section>

      {/* Prova Visual */}
      <section id="prova-visual" className="bg-gray-900 py-24 px-6 text-white scroll-mt-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-premium-gold mb-16">Prova Visual</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {RESULTS_IMAGES.map((img, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} onClick={() => setSelectedImage(img)} className="cursor-pointer aspect-square rounded-xl overflow-hidden bg-gray-800 border border-white/5">
                <img src={img} alt={`Resultado ${i+1}`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Harmonização de Coração */}
      <section id="harmonizacao" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-24">
        <h2 className="text-4xl font-serif text-center mb-16">Harmonização de ❤️</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {HEART_IMAGES.map((img, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
               <img src={img} alt="Cuidado" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-16">O que minhas pacientes dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((img, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-xl border border-gray-50">
                <img src={img} alt="Feedback" className="w-full h-auto rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onde nos Encontrar */}
      <section id="onde-encontrar" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif">Onde nos Encontrar</h2>
            <p className="text-gray-900 font-bold text-xl">{EXPERT.address}</p>
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(EXPERT.address)}`} target="_blank" className="inline-block bg-gray-900 text-white py-5 px-10 rounded-2xl font-bold shadow-2xl">Ver no Google Maps</a>
          </div>
          <div className="rounded-3xl overflow-hidden h-[350px] shadow-2xl border border-gray-200">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.391264624135!2d-49.4891461!3d-28.941916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9522295555555555%3A0x6b8b8b8b8b8b8b8b!2sArarangu%C3%A1%2C%20SC!5e0!3m2!1spt-BR!2sbr!4v1715000000000!5m2!1spt-BR!2sbr" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 px-6 border-t border-gray-100 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="signature text-5xl text-premium-gold">{EXPERT.name}</div>
          <p className="font-black text-gray-500 uppercase tracking-widest">{EXPERT.title} | {EXPERT.cro}</p>
          <div className="flex justify-center gap-6">
             <a href={EXPERT.instagram} target="_blank" className="text-gray-900 hover:text-premium-gold transition-colors text-2xl p-2 rounded-full hover:bg-gold-50">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Zoom" />
        </div>
      )}

      {/* WhatsApp Fixed Button */}
      <a href={EXPERT.whatsapp} className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.39l-1.127 3.314 3.441-1.076a5.727 5.727 0 003.357 1.069c3.18 0 5.767-2.586 5.767-5.767 0-3.181-2.587-5.767-5.767-5.767zm3.391 8.221c-.142.399-.831.762-1.142.812-.31.05-.62.088-2.03-.487-1.696-.693-2.791-2.417-2.875-2.529-.084-.112-.684-.912-.684-1.742 0-.83.433-1.237.587-1.405.154-.167.336-.21.448-.21s.224.01.322.015c.105.005.245-.042.385.293.14.336.49 1.19.532 1.274.042.084.07.182.014.293-.056.112-.084.182-.168.28-.084.098-.168.168-.238.252-.084.084-.175.175-.077.343.098.168.433.714.931 1.155.644.57 1.183.746 1.351.83.168.084.266.07.364-.042.098-.112.42-.49.532-.658.112-.168.224-.14.378-.084.154.056.973.458 1.141.542.168.084.28.126.322.196.042.07.042.406-.1.805zM12.069 2.1c-5.467 0-9.9 4.433-9.9 9.9 0 2.007.593 3.87 1.613 5.432l-1.713 5.035 5.215-1.628a9.866 9.866 0 004.785 1.229c5.466 0 9.9-4.433 9.9-9.9 0-5.467-4.434-9.9-9.9-9.9z"/></svg>
      </a>
    </div>
  );
};

export default LandingPage;
