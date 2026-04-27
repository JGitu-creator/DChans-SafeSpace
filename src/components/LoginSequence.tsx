'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface LoginSequenceProps {
  onComplete: () => void;
}

export default function LoginSequence({ onComplete }: LoginSequenceProps) {
  const fanfareRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Majestic Fanfare Sound
    const fanfareUrl = 'https://assets.mixkit.co/active_storage/sfx/2747/2747-preview.mp3';
    fanfareRef.current = new Audio(fanfareUrl);
    fanfareRef.current.volume = 0.6;
    
    // Play fanfare immediately as the majestic sequence begins
    const playFanfare = setTimeout(() => {
      fanfareRef.current?.play().catch(e => console.warn("Fanfare blocked by browser - interaction needed"));
    }, 200);

    return () => {
      clearTimeout(playFanfare);
      if (fanfareRef.current) {
        fanfareRef.current.pause();
        fanfareRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative flex flex-col items-center pt-20">
          {/* Gold Illuminating Crown Animation */}
          <motion.div
            initial={{ y: -200, opacity: 0, scale: 2 }}
            animate={{ y: -65, opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.5, 
              type: "spring", 
              stiffness: 80,
              damping: 12
            }}
            className="absolute z-20"
          >
            <div className="relative">
              <Crown size={80} className="text-amber-400 fill-amber-300 drop-shadow-[0_0_40px_rgba(251,191,36,1)] stroke-[1px]" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4] 
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 blur-3xl bg-amber-300/60 rounded-full"
              />
            </div>
          </motion.div>

          {/* Majestic Name Animation */}
          <div className="flex flex-col items-center relative">
            <motion.div
              initial={{ letterSpacing: "1em", opacity: 0, filter: "blur(10px)" }}
              animate={{ letterSpacing: "-0.05em", opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black text-center leading-none"
            >
              <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Chantal</span>
              <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 via-purple-600 to-purple-900 drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                Hadassah
              </span>
            </motion.div>
            
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '120%', opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-8"
            />
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={onComplete}
              className="mt-16 flex flex-col items-center gap-4 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40 group-hover:text-purple-400 transition-all ml-[0.8em]">
                  Begin to Journal
                </span>
                <Sparkles size={16} className="text-purple-400 group-hover:animate-pulse" />
              </div>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-px h-10 bg-gradient-to-b from-purple-500 to-transparent"
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
