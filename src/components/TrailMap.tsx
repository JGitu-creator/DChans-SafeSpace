'use client';

import { motion } from 'framer-motion';
import { Sparkles, Trees, Sun, Cloud, Heart } from 'lucide-react';
import { EbenezerStone } from '@/lib/types';
import { useMemo } from 'react';

interface TrailMapProps {
  stones: EbenezerStone[];
  currentBike: string;
}

export default function TrailMap({ stones }: TrailMapProps) {
  // Sort stones by date and take last 12 for the landscape
  const displayStones = useMemo(() => {
    return [...stones].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(-12);
  }, [stones]);

  // Generate SVG path for the horizon based on stone intensities
  const horizonPath = useMemo(() => {
    if (displayStones.length < 2) return "";
    const width = 1000;
    const height = 250;
    const step = width / (displayStones.length - 1);
    
    let d = `M 0 ${height}`;
    displayStones.forEach((stone, i) => {
      const x = i * step;
      // Map intensity (0-1) to height (100-200)
      const y = height - (stone.intensity * 100 + 50);
      if (i === 0) {
        d = `M 0 ${y}`;
      } else {
        const prevX = (i - 1) * step;
        const prevY = height - (displayStones[i-1].intensity * 100 + 50);
        const cp1x = prevX + step / 2;
        const cp2x = prevX + step / 2;
        d += ` C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
      }
    });
    
    // Close the path for a fill
    const lastX = (displayStones.length - 1) * step;
    d += ` L ${lastX} ${height} L 0 ${height} Z`;
    return d;
  }, [displayStones]);

  return (
    <div className="w-full bg-white/40 backdrop-blur-md border border-[#2c1a10]/10 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden text-zinc-900">
      <div className="absolute inset-0 canvas-texture opacity-30 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-800 leading-none handwritten">Landscape of Grace</h3>
          <p className="text-zinc-400 text-[9px] font-black uppercase tracking-[0.4em] mt-2">Your journey, beautifully painted</p>
        </div>
        <div className="flex gap-2">
          <div className="p-3 bg-white/80 rounded-full shadow-sm text-amber-500">
            <Sun size={20} className="animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* The Painted Landscape */}
      <div className="relative h-64 w-full mb-8 overflow-hidden rounded-xl border border-zinc-200/50 bg-gradient-to-b from-sky-50 to-white shadow-inner">
        {/* Clouds */}
        <motion.div 
          animate={{ x: [-20, 20] }} 
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-10 left-10 text-zinc-200/50"
        >
          <Cloud size={40} />
        </motion.div>
        
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1000 250" preserveAspectRatio="none">
          <defs>
            <linearGradient id="horizonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          <motion.path
            initial={{ d: "M 0 250 L 1000 250 L 1000 250 L 0 250 Z" }}
            animate={{ d: horizonPath }}
            transition={{ duration: 2, ease: "easeInOut" }}
            fill="url(#horizonGradient)"
            stroke="#2c1a10"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
        </svg>

        {/* Journey Markers as Nature Elements */}
        <div className="absolute inset-0 flex items-end justify-between px-10">
          {displayStones.map((stone, i) => {
            const xPos = `${(i / (displayStones.length - 1)) * 100}%`;
            
            return (
              <motion.div
                key={stone.id || i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="absolute flex flex-col items-center group cursor-pointer"
                style={{ left: xPos, bottom: `calc(${100 - (stone.intensity * 40 + 20)}%)` }}
              >
                {/* Visual Marker: Tree or Flower based on intensity */}
                <div className={`transition-all duration-500 group-hover:scale-125 ${
                  stone.intensity > 0.6 ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {stone.intensity > 0.5 ? <Trees size={24 + stone.intensity * 10} /> : <Sparkles size={16 + stone.intensity * 10} />}
                </div>

                {/* Date Label */}
                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[8px] font-black py-1 px-2 rounded-full whitespace-nowrap z-50">
                  {new Date(stone.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </div>

                {/* Painting Note Pop-over */}
                <div className="absolute bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none bg-white p-4 rounded-xl shadow-2xl border border-zinc-100 w-48 z-50 text-center">
                   <p className="text-[10px] font-black uppercase text-purple-600 mb-1 tracking-widest">Ebenezer Stone</p>
                   <p className="text-xs italic text-zinc-600 leading-relaxed font-medium">&quot;{stone.note}&quot;</p>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 pt-4 border-t border-zinc-100/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trees size={14} className="text-emerald-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Tall Growth</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Quiet Moments</span>
          </div>
          <div className="flex items-center gap-2">
             <Heart size={14} className="text-rose-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Grace Horizon</span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 italic">&quot;He makes all things beautiful in His time&quot;</p>
          <div className="flex items-center justify-end gap-2">
            <span className="text-2xl font-black italic tracking-tighter text-zinc-800 leading-none">{stones.length}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Stones Laid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
