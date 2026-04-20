'use client';

import { motion } from 'framer-motion';
import { Lamp, Moon, Wind, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MidnightLamp() {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startSleepDecree = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const decree = "Daughter of the King, the road is quiet now. Your Father is watching over you while you rest. Cast all your cares on Him, for He cares for you. May your sleep be sweet and your dreams be full of His grace. ¡Buenas noches, Hadassah!";
      const utterance = new SpeechSynthesisUtterance(decree);
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

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] p-8 text-white">
      <motion.div
        animate={{
          scale: isGlowing ? [1, 1.05, 1] : 1,
          opacity: isGlowing ? [0.8, 1, 0.8] : 0.8,
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative mb-20"
      >
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-1000 ${
          isGlowing ? 'bg-amber-500/40 scale-150' : 'bg-blue-500/10'
        }`} />
        
        <button
          onMouseDown={() => setIsGlowing(true)}
          onMouseUp={() => !isPlaying && setIsGlowing(false)}
          onClick={startSleepDecree}
          className="relative z-10 p-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl hover:bg-white/10 transition-all active:scale-95 group"
        >
          <Lamp size={80} className={`transition-all duration-1000 ${isGlowing ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(252,211,77,0.5)]' : 'text-white/20'}`} />
        </button>
        
        <div className="absolute -top-4 -right-4 p-3 bg-blue-500/20 rounded-full border border-blue-500/30">
          <Moon size={20} className="text-blue-300" />
        </div>
      </motion.div>

      <div className="text-center space-y-6">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">The Midnight Lamp</h2>
        <p className="text-white/40 max-w-xs mx-auto leading-relaxed">
          {isPlaying 
            ? "Selig is whispering a blessing over you..." 
            : "Tap the lamp to receive a Sleep Decree from Selig."
          }
        </p>
        
        <div className="flex gap-8 pt-10">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <Wind size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Soft Breeze</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-40">
            <Heart size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Peace Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
