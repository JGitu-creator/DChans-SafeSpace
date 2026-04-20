'use client';

import { motion } from 'framer-motion';
import { Mountain, Sparkles, Navigation } from 'lucide-react';
import { EbenezerStone } from '@/lib/types';

interface TrailMapProps {
  stones: EbenezerStone[];
  currentBike: string;
}

export default function TrailMap({ stones, currentBike }: TrailMapProps) {
  const miles = stones.length * 5;
  
  return (
    <div className="w-full bg-white border border-black/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden text-zinc-900">
      {/* Visual Map Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')` }} />
      
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#2d1b4d] leading-none">The Route of Grace</h3>
          <p className="text-zinc-400 text-[9px] font-black uppercase tracking-[0.4em] mt-2">Visual Growth Journey</p>
        </div>
        <div className="p-4 bg-zinc-900 rounded-2xl text-white shadow-lg shadow-zinc-900/20 rotate-3">
          <Navigation size={24} />
        </div>
      </div>

      <div className="relative h-64 w-full flex items-end justify-between px-6 mb-10 overflow-hidden">
        {/* The Winding Trail - High Contrast Ink Path */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M 0 200 Q 150 120 300 180 T 600 100 T 900 160"
            fill="none"
            stroke="#2d1b4d"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8,12"
            className="opacity-20"
          />
          <path
            d="M 0 200 Q 150 120 300 180 T 600 100 T 900 160"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-60"
          />
        </svg>

        {/* Ebenezer Stones - High Contrast Pins */}
        {stones.slice(-8).map((stone, index) => (
          <motion.div
            key={stone.id || index}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            className="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            <div 
              className={`w-8 h-8 rounded-full border-4 border-white shadow-xl transition-all ${
                stone.intensity > 0.7 ? 'bg-purple-600' : 'bg-zinc-800'
              } group-hover:scale-125 group-hover:shadow-purple-500/40`}
            />
            
            {/* Tooltip - Dark background for clarity */}
            <div className="absolute bottom-12 opacity-0 group-hover:opacity-100 transition-all bg-zinc-900 text-white text-[10px] font-black p-4 rounded-2xl whitespace-nowrap shadow-2xl z-50 pointer-events-none">
              <p className="uppercase tracking-widest text-purple-400 mb-1">{new Date(stone.date).toLocaleDateString()}</p>
              <p className="italic leading-relaxed">"{stone.note}"</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900" />
            </div>
          </motion.div>
        ))}

        {/* Current Position */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative z-20 flex flex-col items-center"
        >
          <div className="p-4 bg-purple-600 text-white rounded-full shadow-[0_0_30px_rgba(139,92,246,0.6)] border-4 border-white scale-125">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <span className="text-[10px] font-black uppercase italic text-purple-600 mt-3 tracking-widest">You are here</span>
        </motion.div>
      </div>

      <div className="pt-8 border-t border-zinc-100 flex justify-between items-center relative z-10">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600 border-2 border-white shadow-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Stones of Help</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-800 border-2 border-white shadow-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">The Road</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black italic tracking-tighter text-[#2d1b4d] leading-none">{miles}</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mt-1">Miles Gained</span>
        </div>
      </div>
    </div>
  );
}
