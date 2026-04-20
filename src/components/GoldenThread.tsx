'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Activity } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { useMemo } from 'react';

interface GoldenThreadProps {
  entries: JournalEntry[];
}

export default function GoldenThread({ entries }: GoldenThreadProps) {
  const commonThemes = useMemo(() => {
    // Basic theme extraction for demo - in a real app, this could use AI analysis
    const allText = entries.map(e => e.struggle).join(' ').toLowerCase();
    const themes = ['Strength', 'Grace', 'Peace', 'Courage', 'Patience', 'Love'];
    return themes.filter(theme => allText.includes(theme.toLowerCase()));
  }, [entries]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 text-zinc-800 pb-32">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-amber-500/10 rounded-3xl mb-4 border border-amber-500/20">
          <Activity size={40} className="text-amber-600" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-amber-900 handwritten">The Golden Thread</h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">God&apos;s faithfulness woven through your road</p>
      </div>

      <div className="relative bg-zinc-900 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden border-4 border-[#2c1a10]">
        <div className="absolute inset-0 canvas-texture opacity-10" />
        
        {/* The Golden Thread Visualization */}
        <div className="relative h-64 mb-12">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <motion.path
              d="M 0 100 Q 250 50 500 150 T 1000 100"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-around px-10">
            {commonThemes.map((theme, i) => (
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.5 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="p-4 bg-amber-500 text-white rounded-full shadow-lg shadow-amber-500/40">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{theme}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <p className="text-white/80 text-lg serif-italic leading-relaxed max-w-2xl mx-auto">
            &quot;Looking back at your road log, Hadassah, I see a beautiful golden thread. Even in the climbs, God has been weaving a masterpiece of {commonThemes.length > 0 ? commonThemes.join(', ') : 'Grace'} in your life.&quot;
          </p>
          <div className="flex justify-center gap-2 text-amber-500">
             <Heart size={16} fill="currentColor" />
             <Heart size={16} fill="currentColor" />
             <Heart size={16} fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  );
}
