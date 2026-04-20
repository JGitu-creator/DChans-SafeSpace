'use client';

import { motion } from 'framer-motion';
import { Scroll, Star, Crown } from 'lucide-react';

interface RoyalDecreeProps {
  message: string;
  onClose: () => void;
}

export default function RoyalDecree({ message, onClose }: RoyalDecreeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, rotate: -2 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        className="relative w-full max-w-lg bg-[#fdf6e3] rounded-sm shadow-2xl p-12 overflow-hidden border-x-[12px] border-[#d4af37]"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/parchment.png")`,
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.3), 0 20px 40px rgba(0,0,0,0.4)'
        }}
      >
        {/* Golden Ornaments */}
        <div className="absolute top-4 left-4 text-[#d4af37]">
          <Crown size={32} />
        </div>
        <div className="absolute top-4 right-4 text-[#d4af37]">
          <Star size={32} />
        </div>
        
        <div className="flex flex-col items-center text-center gap-8">
          <h2 className="text-3xl font-serif font-black text-[#8b4513] uppercase tracking-[0.2em] border-b-2 border-[#d4af37] pb-2">
            Royal Decree
          </h2>
          
          <div className="space-y-6">
            <p className="text-2xl font-serif italic text-[#5d2e0a] leading-relaxed">
              "{message}"
            </p>
            <p className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">
              By Order of the King
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-8 px-10 py-3 bg-[#8b4513] text-white font-bold rounded-full hover:bg-[#5d2e0a] transition-colors shadow-lg active:scale-95"
          >
            I Accept my Crown
          </button>
        </div>

        {/* Scroll Rolls */}
        <div className="absolute top-0 bottom-0 left-[-6px] w-4 bg-[#b8860b] shadow-inner" />
        <div className="absolute top-0 bottom-0 right-[-6px] w-4 bg-[#b8860b] shadow-inner" />
      </motion.div>
    </motion.div>
  );
}
