'use client';

import { motion } from 'framer-motion';
import { Lamp, Moon, Wind, Heart, Sparkles, Volume2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function MidnightLamp() {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<'none' | 'breeze' | 'peace'>('none');
  
  // Use a simple oscillator for "Soft Breeze" sound effect without heavy files
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);

  const toggleBreeze = () => {
    if (activeSound === 'breeze') {
      if (audioCtxRef.current) audioCtxRef.current.close();
      audioCtxRef.current = null;
      setActiveSound('none');
      return;
    }

    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      const bufferSize = 4096;
      const whiteNoise = audioCtxRef.current.createScriptProcessor(bufferSize, 1, 1);
      whiteNoise.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      };

      const filter = audioCtxRef.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 0.5;

      const gain = audioCtxRef.current.createGain();
      gain.gain.value = 0.05;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      
      noiseNodeRef.current = whiteNoise;
      setActiveSound('breeze');
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

      utterance.pitch = 0.8;
      utterance.rate = 0.75;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setIsGlowing(false);
      };
      
      setIsGlowing(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-8 text-zinc-900 pb-32">
      <motion.div
        animate={{
          scale: isGlowing ? [1, 1.05, 1] : 1,
          opacity: isGlowing ? [0.8, 1, 0.8] : 1,
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative mb-20"
      >
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 ${
          isGlowing ? 'bg-amber-400/60 scale-150' : 'bg-purple-500/10'
        }`} />
        
        <button
          onMouseDown={() => setIsGlowing(true)}
          onMouseUp={() => !isPlaying && setIsGlowing(false)}
          onClick={startSleepDecree}
          className="relative z-10 p-16 rounded-full bg-white shadow-2xl border border-zinc-100 transition-all active:scale-95 group"
        >
          <Lamp size={80} className={`transition-all duration-1000 ${isGlowing ? 'text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]' : 'text-zinc-200'}`} />
        </button>
        
        <div className="absolute -top-4 -right-4 p-4 bg-purple-100 rounded-full border-4 border-white shadow-lg">
          <Moon size={24} className="text-purple-600" />
        </div>
      </motion.div>

      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter handwritten text-purple-900 leading-none">The Midnight Lamp</h2>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">Rest in His Promise</p>
        </div>

        <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed font-medium italic">
          {isPlaying 
            ? "Selig is whispering a blessing over you..." 
            : "Tap the lamp to receive a Sleep Decree from Selig."
          }
        </p>
        
        <div className="flex gap-6 pt-10">
          <button 
            onClick={toggleBreeze}
            className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${
              activeSound === 'breeze' ? 'bg-sky-50 border-sky-200 text-sky-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'
            }`}
          >
            <Wind size={28} className={activeSound === 'breeze' ? 'animate-pulse' : ''} />
            <span className="text-[9px] font-black uppercase tracking-widest">Soft Breeze</span>
          </button>
          
          <button 
            onClick={() => setActiveSound(activeSound === 'peace' ? 'none' : 'peace')}
            className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${
              activeSound === 'peace' ? 'bg-purple-50 border-purple-200 text-purple-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'
            }`}
          >
            <Heart size={28} className={activeSound === 'peace' ? 'animate-bounce' : ''} />
            <span className="text-[9px] font-black uppercase tracking-widest">Peace Mode</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeSound === 'peace' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-12 p-6 bg-purple-50 rounded-3xl border border-purple-100 text-center"
          >
            <p className="text-purple-800 text-xs font-bold leading-loose italic">
              "Selig's Peace Guide: Breathe in His Grace... Breathe out your cares."
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
