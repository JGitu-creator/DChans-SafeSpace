'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lamp, Moon, Sun, Wind, Heart, Bird, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function MidnightLamp() {
  const [mode, setMode] = useState<'morning' | 'night'>('night');
  const [isGlowing, setIsGlowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<'none' | 'ocean' | 'forest'>('none');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const SOUNDS = {
    ocean: 'https://www.soundjay.com/nature/ocean-wave-1.mp3',
    forest: mode === 'morning' 
      ? 'https://www.soundjay.com/nature/sounds/canary-chirping-1.mp3' 
      : 'https://www.soundjay.com/nature/sounds/cricket-chirping-1.mp3'
  };

  const toggleSound = (soundType: 'ocean' | 'forest') => {
    if (activeSound === soundType) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setActiveSound('none');
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    const url = soundType === 'ocean' ? SOUNDS.ocean : SOUNDS.forest;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.7; // SIGNIFICANTLY INCREASED VOLUME
    audio.play().catch(e => console.error("Playback blocked"));
    
    audioRef.current = audio;
    setActiveSound(soundType);
  };

  const startAffirmation = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const morningMsg = "Good morning, Hadassah! His mercies are new. Today, you ride in the King's strength.";
      const nightMsg = "Peace be with you, mi hermana. The King watches over your sleep. Rest deep in His love.";
      
      const utterance = new SpeechSynthesisUtterance(mode === 'morning' ? morningMsg : nightMsg);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Google UK')) && v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.pitch = 1.1;
      utterance.rate = 0.85;
      
      utterance.onstart = () => { setIsPlaying(true); setIsGlowing(true); };
      utterance.onend = () => { setIsPlaying(false); setIsGlowing(false); };
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-4 md:p-8 text-zinc-800 pb-32 relative">
      <div className="flex justify-center gap-2 mb-12 bg-zinc-200/50 p-1.5 rounded-2xl relative z-10 w-full max-w-[200px]">
        <button onClick={() => { setMode('morning'); setActiveSound('none'); if(audioRef.current) audioRef.current.pause(); }} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${mode === 'morning' ? 'bg-white text-amber-600 shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}><Sun size={16} /><span className="text-[9px] font-black uppercase tracking-widest">Day</span></button>
        <button onClick={() => { setMode('night'); setActiveSound('none'); if(audioRef.current) audioRef.current.pause(); }} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${mode === 'night' ? 'bg-white text-purple-600 shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}><Moon size={16} /><span className="text-[9px] font-black uppercase tracking-widest">Night</span></button>
      </div>

      <motion.div animate={{ scale: isGlowing ? [1, 1.05, 1] : 1, opacity: isGlowing ? [0.8, 1, 0.8] : 1 }} transition={{ duration: 4, repeat: Infinity }} className="relative mb-16 z-10">
        <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 ${isGlowing ? (mode === 'morning' ? 'bg-amber-400/60 scale-150' : 'bg-purple-500/60 scale-150') : 'bg-zinc-500/10'}`} />
        <button onClick={startAffirmation} className="relative z-10 p-12 md:p-16 rounded-full bg-white shadow-2xl border border-zinc-100 transition-all active:scale-95 group"><Lamp size={80} className={`transition-all duration-1000 ${isGlowing ? (mode === 'morning' ? 'text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]' : 'text-purple-500 drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]') : 'text-zinc-200'}`} /></button>
      </motion.div>

      <div className="text-center space-y-8 z-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter handwritten text-zinc-800 leading-none">{mode === 'morning' ? 'Morning Light' : 'Midnight Lamp'}</h2>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">{mode === 'morning' ? 'Rise in His Grace' : 'Rest in His Promise'}</p>
        </div>
        
        <div className="flex gap-4 pt-10">
          <button onClick={() => toggleSound('ocean')} className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all shadow-lg ${activeSound === 'ocean' ? 'bg-sky-50 border-sky-300 text-sky-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'}`}><Wind size={24} /><span className="text-[8px] font-black uppercase tracking-widest italic">Ocean Waves</span></button>
          <button onClick={() => toggleSound('forest')} className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all shadow-lg ${activeSound === 'forest' ? 'bg-emerald-50 border-emerald-300 text-emerald-600 scale-110' : 'bg-white border-zinc-100 text-zinc-300'}`}>{mode === 'morning' ? <Bird size={24} /> : <Heart size={24} />}<span className="text-[8px] font-black uppercase tracking-widest italic">{mode === 'morning' ? 'Forest Birds' : 'Peace Drone'}</span></button>
        </div>

        <AnimatePresence>
          {activeSound === 'forest' && mode === 'night' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
               <p className="text-purple-900 text-[10px] font-black uppercase tracking-widest mb-2">A Word of Peace</p>
               <p className="text-purple-800 text-sm font-medium italic">"I will both lie down in peace, and sleep; For You alone, O Lord, make me dwell in safety." — Psalm 4:8</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
