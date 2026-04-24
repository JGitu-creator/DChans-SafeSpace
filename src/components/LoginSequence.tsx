'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LOGIN_DECLARATIONS, MajesticDeclaration } from '@/lib/types';

interface LoginSequenceProps {
  onComplete: () => void;
}

const Ichthys = () => (
  <svg width="60" height="30" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-700/60">
    <path d="M 0 25 Q 40 -15 80 25 Q 40 65 0 25 Z" />
    <path d="M 75 20 L 95 5 M 75 30 L 95 45" />
  </svg>
);

export default function LoginSequence({ onComplete }: LoginSequenceProps) {
  const [stage, setStage] = useState<'scroll' | 'name'>('scroll');
  const [declaration] = useState<MajesticDeclaration>(() => 
    LOGIN_DECLARATIONS[Math.floor(Math.random() * LOGIN_DECLARATIONS.length)]
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'scroll' && (
          <motion.div
            key="scroll-stage"
            initial={{ height: 0, opacity: 0, scaleY: 0 }}
            animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[95vw] md:max-w-lg bg-[#fdf6e3] rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden border-x-[12px] md:border-x-[20px] border-[#d4af37] origin-top"
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/parchment.png")` }}
          >
            {/* Scroll Rolls */}
            <div className="absolute top-0 bottom-0 left-[-8px] md:left-[-10px] w-4 md:w-6 bg-[#b8860b] shadow-inner" />
            <div className="absolute top-0 bottom-0 right-[-8px] md:right-[-10px] w-4 md:w-6 bg-[#b8860b] shadow-inner" />

            <div className="p-6 md:p-12 flex flex-col items-center text-center gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-4">
                <Ichthys />
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-serif font-black text-[#8b4513] uppercase tracking-[0.3em] md:tracking-[0.4em]">
                    Royal Affirmation & Prayer
                  </h2>
                  <p className="text-[9px] md:text-[10px] font-black text-[#d4af37] uppercase tracking-[0.5em] md:tracking-[0.6em]">King Jesus Christ</p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <p className="text-xl md:text-3xl font-serif italic text-[#5d2e0a] leading-tight tracking-tight px-2 md:px-4">
                  &quot;{declaration.text}&quot;
                </p>
                <div className="flex flex-col items-center gap-1">
                  <div className="h-px w-12 bg-[#d4af37]/30" />
                  <p className="text-[9px] md:text-[10px] font-bold text-[#8b4513]/60 uppercase tracking-widest italic">{declaration.reference}</p>
                </div>
              </div>

              <button
                onClick={() => setStage('name')}
                className="group relative mt-2 md:mt-4 px-8 md:px-14 py-3 md:py-5 bg-[#8b4513] text-white font-black rounded-full hover:bg-[#5d2e0a] transition-all shadow-2xl active:scale-95 overflow-hidden border-2 border-[#d4af37]/20"
              >
                <span className="relative z-10 uppercase tracking-widest text-[9px] md:text-[10px]">I Accept my Identity</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/40 to-amber-400/0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'name' && (
          <motion.div
            key="name-stage"
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
                  delay: 0.8, 
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
                  {/* Rays of light */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <motion.div
                      key={angle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: angle / 100 }}
                      className="absolute top-1/2 left-1/2 w-1 h-20 bg-amber-200/20 origin-top"
                      style={{ transform: `rotate(${angle}deg) translateX(-50%)` }}
                    />
                  ))}
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
                  transition={{ delay: 1.2, duration: 1.5 }}
                  className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-8"
                />
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.5 }}
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
        )}
      </AnimatePresence>
    </div>
  );
}
