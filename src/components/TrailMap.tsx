'use client';

import { motion } from 'framer-motion';
import { Mountain, MapPin, Sparkles } from 'lucide-react';
import { EbenezerStone } from '@/lib/types';

interface TrailMapProps {
  stones: EbenezerStone[];
  currentBike: string;
}

export default function TrailMap({ stones, currentBike }: TrailMapProps) {
  // Simple layout for the trail
  const trailPoints = 12; // Length of the visible trail
  
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md overflow-hidden relative shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">The Topography of Grace</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Your growth journey with Selig</p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl text-white">
          <Mountain size={24} />
        </div>
      </div>

      <div className="relative h-48 w-full flex items-end justify-between px-4">
        {/* The Winding Path */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M 0 160 Q 150 100 300 140 T 600 80 T 900 120"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>

        {/* Ebenezer Stones */}
        {stones.slice(-10).map((stone, index) => (
          <motion.div
            key={stone.id || index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            {/* The Stone */}
            <div 
              className={`w-4 h-4 rounded-full border-2 border-white/20 transition-all ${
                stone.intensity > 0.7 ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-zinc-600'
              }`}
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all bg-white text-black text-[10px] font-bold p-2 rounded-lg whitespace-nowrap shadow-xl">
              {stone.note}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
            </div>
          </motion.div>
        ))}

        {/* Current Bike Position */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-20 flex flex-col items-center"
        >
          <div className="p-2 bg-white text-black rounded-full shadow-2xl">
            <Sparkles size={16} />
          </div>
          <span className="text-[8px] font-black uppercase text-white mt-1">You Are Here</span>
        </motion.div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Victories</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-600" /> Honest Struggles</span>
        </div>
        <span>Total Miles: {stones.length * 5}</span>
      </div>
    </div>
  );
}
