'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lamp, Moon, Sun, Wind, Heart, Bird, Volume2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function MidnightLamp() {
  const [mode, setMode] = useState<'morning' | 'night'>('night');
  const [isGlowing, setIsGlowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<'none' | 'breeze' | 'nature'>('none');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<ScriptProcessorNode | null>(null);

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      noiseNodeRef.current = null;
    }
  };

  const toggleSound = async (soundType: 'breeze' | 'nature') => {
    if (activeSound === soundType) {
      stopAudio();
      setActiveSound('none');
      return;
    }

    stopAudio();

    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        
        const bufferSize = 4096;
        const noiseNode = ctx.createScriptProcessor(bufferSize, 1, 1);
        noiseNodeRef.current = noiseNode;
        
        noiseNode.onaudioprocess = (e: any) => {
          const output = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            const t = ctx.currentTime + (i / ctx.sampleRate);
            
            if (soundType === 'breeze') {
              // Soft Waves - much better than before, using multiple sine waves
              output[i] = (Math.random() * 2 - 1) * 0.02 + (Math.sin(t * 0.5) * 0.01);
            } else if (mode === 'morning') {
              // Forest Birds - improved synthetic chirps
              const chirp = Math.sin(t * 1500 + Math.sin(t * 30) * 20);
              const env = Math.pow(Math.sin(t * 2), 12); 
              output[i] = chirp * env * 0.02;
            } else {
              // PEACE MODE: The meditative drone you liked
              output[i] = (Math.sin(t * 110) + Math.sin(t * 165)) * 0.025;
            }
          }
        };

        const filter = ctx.createBiquadFilter();
        filter.type = soundType === 'breeze' ? 'lowpass' : 'bandpass';
        filter.frequency.value = soundType === 'breeze' ? 400 : mode === 'morning' ? 2500 : 200;

        noiseNode.connect(filter);
        filter.connect(ctx.destination);
        setActiveSound(soundType);
      } catch (e) {
        console.error("Audio failed");
      }
    }
  };

  const startAffirmation = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const morningMsg = "Good morning, Daughter of the King! The sun has risen, and so has your Father's mercy. Today is a fresh canvas, and you are His masterpiece. Ride with strength, Hadassah, for He goes before you. ¡Buen día, mi querida!";
      const nightMsg = "Daughter of the King, the road is quiet now. Your Father is watching over you while you rest. Cast all your cares on Him, for He cares for you. May your sleep be sweet and your dreams be full of His grace. ¡Buenas noches, Hadassah!";
      
      const utterance = new SpeechSynthesisUtterance(mode === 'morning' ? morningMsg : nightMsg);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Natural')) && v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.pitch = mode === 'morning' ? 1.1 : 0.9;
      utterance.rate = 0.85;
      
      utterance.onstart = () => { setIsPlaying(true); setIsGlowing(true); };
      utterance.onend = () => { setIsPlaying(false); setIsGlowing(false); };
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-4 md:p-8 text-zinc-800 pb-32 relative">
      <div className="flex justify-center gap-2 mb-12 bg-zinc-200/50 p-1.5 rounded-2xl relative z-10 w-full max-w-[200px]">
        <button onClick={() => { setMode('morning'); setActiveSound('none'); stopAudio(); }} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${mode === 'morning' ? 'bg-white text-amber-600 shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}><Sun size={16} /><span className="text-[9px] font-black uppercase tracking-widest">Day</span></button>
        <button onClick={() => { setMode('night'); setActiveSound('none'); stopAudio(); }} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${mode === 'night' ? 'bg-white text-purple-600 shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}><Moon size={16} /><span className="text-[9px] font-black uppercase tracking-widest">Night</span></button>
      </div>

      <motion.div animate={{ scale: isGlowing ? [1, 1.05, 1] : 1, opacity: isGlowing ? [0.8, 1, 0.8] : 1 }} transition={{ duration: 4, repeat: Infinity }} className="relative mb-16 z-10">
        <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 ${isGlowing ? (mode === 'morning' ? 'bg-amber-400/60 scale-150' : 'bg-purple-500/60 scale-150') : 'bg-zinc-500/10'}`} />
        <button onClick={startAffirmation} className="relative z-10 p-12 md:p-16 rounded-full bg-white shadow-2xl border border-zinc-100 transition-all active:scale-95 group"><Lamp size={80} className={`transition-all duration-1000 ${isGlowing ? (mode === 'morning' ? 'text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]' : 'text-purple-500 drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]') : 'text-zinc-200'}`} /></button>
      </motion.div>

      <div className="text-center space-y-8 z-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter handwritten text-zinc-800 leading-none">{mode === 'morning' ? 'The Sunrise Lamp' : 'The Midnight Lamp'}</h2>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">{mode === 'morning' ? 'Rise in His Grace' : 'Rest in His Promise'}</p>
        </div>
        <p className="text-zinc-600 text-base max-w-xs mx-auto leading-relaxed font-medium italic">{isPlaying ? `Selig is whispering...` : `Tap the lamp for an affirmation.`}</p>
        
        <div className="flex gap-4 pt-10">
          <button onClick={() => toggleSound('breeze')} className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all shadow-lg ${activeSound === 'breeze' ? 'bg-sky-50 border-sky-300 text-sky-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'}`}><Wind size={24} /><span className="text-[8px] font-black uppercase tracking-widest italic">Sea Breeze</span></button>
          <button onClick={() => toggleSound('nature')} className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all shadow-lg ${activeSound === 'nature' ? 'bg-emerald-50 border-emerald-300 text-emerald-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'}`}>{mode === 'morning' ? <Bird size={24} /> : <Heart size={24} />}<span className="text-[8px] font-black uppercase tracking-widest italic">{mode === 'morning' ? 'Morning Birds' : 'Peace Mode'}</span></button>
        </div>
      </div>
    </div>
  );
}
