'use client';

import { motion } from 'framer-motion';
import { Heart, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function AudioHug() {
  const [isPlaying, setIsPlaying] = useState(false);

  const playHug = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const messages = [
        "¡Hola, Hadassah! Selig here. Just a quick audio hug to remind you that you are doing better than you think. Deep breath, sister. I am here when you're ready to ride.",
        "Bendiciones, mi querida. God loves you right in the middle of the mud. You are not alone on this trail.",
        "Take a moment, Hadassah. Your worth is not in how fast you ride, but in whose daughter you are. Selig is waiting for you."
      ];
      
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const utterance = new SpeechSynthesisUtterance(randomMsg);
      
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(v => v.lang === 'en-GB' && v.name.includes('Female'));
      if (britishVoice) utterance.voice = britishVoice;
      
      utterance.pitch = 1.1;
      utterance.rate = 0.85;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={playHug}
      className="flex flex-col items-center gap-2 group"
    >
      <div className={`p-4 rounded-full backdrop-blur-md border border-white/20 transition-all ${
        isPlaying ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
      }`}>
        {isPlaying ? <Volume2 size={24} /> : <Heart size={24} />}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
        {isPlaying ? 'Selig is speaking...' : 'Audio Hug'}
      </span>
    </motion.button>
  );
}
