'use client';

import { motion } from 'framer-motion';
import { Crown, Star } from 'lucide-react';

interface RoyalAffirmationProps {
  message: string;
  onClose: () => void;
}

export default function RoyalAffirmation({ message, onClose }: RoyalAffirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-[320px] md:max-w-sm">
        {/* The Top Scroll Rod */}
        <motion.div 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="absolute top-[-10px] inset-x-0 h-4 bg-[#b8860b] rounded-full z-20 shadow-lg border-y border-[#d4af37]/30"
        />

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-[#fdf6e3] shadow-2xl overflow-hidden border-x-[6px] border-[#d4af37]"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/parchment.png")`,
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.2), 0 15px 30px rgba(0,0,0,0.3)'
          }}
        >
          <div className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
            {/* Golden Ornament */}
            <div className="text-[#d4af37] mb-1">
              <Crown size={28} />
            </div>
            
            <h2 className="text-sm md:text-base font-serif font-black text-[#8b4513] uppercase tracking-[0.1em] border-b border-[#d4af37]/50 pb-2 text-center">
              Royal Affirmations & Prayer
            </h2>
            
            <div className="space-y-4">
              <p className="text-base md:text-lg font-serif italic text-[#5d2e0a] leading-relaxed px-2">
                &quot;{message}&quot;
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-[#d4af37]/30" />
                <p className="text-[8px] font-bold text-[#d4af37] uppercase tracking-widest">
                  Royal Word of Peace
                </p>
                <div className="h-px w-8 bg-[#d4af37]/30" />
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-[#8b4513] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#5d2e0a] transition-all shadow-md active:scale-95"
            >
              I Accept
            </button>
          </div>
        </motion.div>

        {/* The Bottom Scroll Rod */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="absolute bottom-[-10px] inset-x-0 h-4 bg-[#b8860b] rounded-full z-20 shadow-lg border-y border-[#d4af37]/30"
        />
      </div>
    </motion.div>
  );
}
