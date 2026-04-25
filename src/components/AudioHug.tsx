'use client';

import { motion } from 'framer-motion';
import { Heart, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

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
      
      // Strict selection for a soft, sweet British Female voice - Sync with Lamp
      const preferredVoice = voices.find(v => 
        (v.name.includes('Google UK English Female') || v.name.includes('Natural') || v.name.includes('Soft')) && 
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en-GB') && v.name.includes('Female'))
        || voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Female'));
      
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.pitch = 1.1; // Slightly higher for a sweeter tone
      utterance.rate = 0.85; // Slower for a softer feel
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.9 }}
      onClick={playHug}
      className="flex flex-col items-center gap-2 group relative"
    >
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all" />
      
      <div className={`relative z-10 p-5 rounded-full backdrop-blur-md border border-white/20 transition-all ${
        isPlaying ? 'bg-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)] border-white/40' : 'bg-black/40 text-white/60 hover:bg-white/10 hover:text-white'
      }`}>
        {isPlaying ? <Volume2 size={28} /> : <Heart size={28} fill={isPlaying ? "white" : "none"} />}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/60 transition-colors italic">
        {isPlaying ? 'Selig is speaking...' : 'Audio Hug'}
      </span>
    </motion.button>
  );
}
