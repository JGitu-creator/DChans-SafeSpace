'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lamp, Moon, Wind, Heart, Sparkles, Volume2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function MidnightLamp() {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<'none' | 'breeze' | 'peace'>('none');
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleBreeze = () => {
    if (activeSound === 'breeze') {
      if (audioCtxRef.current) audioCtxRef.current.close();
      audioCtxRef.current = null;
      setActiveSound('none');
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const bufferSize = 4096;
        const whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
        whiteNoise.onaudioprocess = (e) => {
          const output = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.05; // Soft volume
          }
        };

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        whiteNoise.connect(filter);
        filter.connect(ctx.destination);
        setActiveSound('breeze');
      } catch (e) {
        console.error("Audio not supported");
      }
    }
  };

  const startSleepDecree = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const decree = "Daughter of the King, the road is quiet now. Your Father is watching over you while you rest. Cast all your cares on Him, for He cares for you. May your sleep be sweet and your dreams be full of His grace. ¡Buenas noches, Hadassah!";
      const utterance = new SpeechSynthesisUtterance(decree);
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && 
        (v.name.includes('Female') || v.name.includes('Natural'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.pitch = 0.9;
      utterance.rate = 0.7; // Very slow and soothing
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsGlowing(true);
      };
      utterance.onend = () => {
        setIsPlaying(false);
        setIsGlowing(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-8 text-zinc-900 pb-32 relative">
      {/* Visual Breathing Circle for Peace Mode */}
      <AnimatePresence>
        {activeSound === 'peace' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [1, 1.5, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-64 h-64 bg-purple-500/10 rounded-full blur-3xl border border-purple-500/20" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          scale: isGlowing ? [1, 1.05, 1] : 1,
          opacity: isGlowing ? [0.8, 1, 0.8] : 1,
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative mb-20 z-10"
      >
        <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 ${
          isGlowing ? 'bg-amber-400/60 scale-150' : 'bg-purple-500/10'
        }`} />
        
        <button
          onClick={startSleepDecree}
          className="relative z-10 p-16 rounded-full bg-white shadow-2xl border border-zinc-100 transition-all active:scale-95 group"
        >
          <Lamp size={80} className={`transition-all duration-1000 ${isGlowing ? 'text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]' : 'text-zinc-200'}`} />
        </button>
        
        <div className="absolute -top-4 -right-4 p-4 bg-purple-100 rounded-full border-4 border-white shadow-lg">
          <Moon size={24} className="text-purple-600" />
        </div>
      </motion.div>

      <div className="text-center space-y-8 z-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter handwritten text-purple-900 leading-none">The Midnight Lamp</h2>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">Rest in His Promise</p>
        </div>

        <p className="text-zinc-600 text-base max-w-xs mx-auto leading-relaxed font-medium italic">
          {isPlaying 
            ? "Selig is whispering a blessing over you..." 
            : "Tap the lamp to receive a Sleep Decree from Selig."
          }
        </p>
        
        <div className="flex gap-6 pt-10">
          <button 
            onClick={toggleBreeze}
            className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all shadow-lg ${
              activeSound === 'breeze' ? 'bg-sky-50 border-sky-300 text-sky-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'
            }`}
          >
            <Wind size={28} className={activeSound === 'breeze' ? 'animate-pulse' : ''} />
            <span className="text-[9px] font-black uppercase tracking-widest italic">Soft Breeze</span>
          </button>
          
          <button 
            onClick={() => setActiveSound(activeSound === 'peace' ? 'none' : 'peace')}
            className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all shadow-lg ${
              activeSound === 'peace' ? 'bg-purple-50 border-purple-300 text-purple-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'
            }`}
          >
            <Heart size={28} className={activeSound === 'peace' ? 'animate-bounce' : ''} />
            <span className="text-[9px] font-black uppercase tracking-widest italic">Peace Mode</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeSound === 'peace' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-12 p-8 bg-purple-50 rounded-[2.5rem] border-2 border-purple-100 text-center shadow-xl z-20"
          >
            <p className="text-purple-900 text-sm font-black uppercase tracking-widest mb-4">Breathing Guide</p>
            <p className="text-purple-800 text-base font-bold leading-loose italic">
              "Breathe in His Grace... <br/> Hold for a moment... <br/> Breathe out your cares."
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
