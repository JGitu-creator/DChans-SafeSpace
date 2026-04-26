'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, Activity, Shield, Anchor, Sun } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { useMemo } from 'react';

interface GoldenThreadProps {
  entries: JournalEntry[];
}

export default function GoldenThread({ entries }: GoldenThreadProps) {
  const threadData = useMemo(() => {
    if (!entries || entries.length === 0) return null;

    // Extract growth words and themes from affirmations
    const themes = entries.map(e => {
      try {
        const aff = JSON.parse(e.affirmation);
        return {
          word: aff.growthWord?.word || 'Grace',
          date: e.date,
          verse: aff.bibleVerse
        };
      } catch {
        return { word: 'Grace', date: e.date, verse: 'Psalm 23' };
      }
    }).slice(0, 5); // Show last 5 major points in the thread

    return themes;
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

      <div className="relative bg-zinc-900 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden border-4 border-[#2c1a10]">
        <div className="absolute inset-0 canvas-texture opacity-10" />
        
        {!threadData ? (
          <div className="relative z-10 py-20 text-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <Sun className="text-amber-500 animate-pulse" />
            </div>
            <p className="text-amber-200/40 text-sm italic font-medium max-w-xs mx-auto">
              Start your road log, Hadassah. As you write, Selig will help me weave the golden thread of God&apos;s grace here.
            </p>
          </div>
        ) : (
          <>
            {/* The Golden Thread Visualization */}
            <div className="relative h-64 mb-12">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <motion.path
                  d="M 0 120 Q 250 40 500 180 T 1000 120"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]"
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-around px-4">
                {threadData.map((node, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.4 }}
                    className="flex flex-col items-center gap-4 relative"
                  >
                    <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/40 rotate-3 hover:rotate-0 transition-transform cursor-help group">
                      <Sparkles size={20} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-32 p-2 bg-white text-zinc-900 rounded-lg text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none">
                        {node.verse}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-amber-400">{node.word}</span>
                      <span className="block text-[7px] text-amber-200/30 uppercase mt-1 font-bold">
                        {new Date(node.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative z-10 text-center space-y-8">
              <div className="h-px w-24 bg-amber-500/30 mx-auto" />
              <p className="text-white/90 text-2xl serif-italic leading-relaxed max-w-2xl mx-auto italic font-medium">
                &quot;Looking back at your road log, Hadassah, I see a beautiful golden thread. God has been weaving a masterpiece of <span className="text-amber-400">{threadData[0].word}</span> and <span className="text-amber-400">{threadData[threadData.length-1].word}</span> through your journey.&quot;
              </p>
              <div className="flex justify-center gap-4">
                 <div className="p-3 bg-white/5 rounded-xl text-amber-500"><Shield size={20} /></div>
                 <div className="p-3 bg-white/5 rounded-xl text-amber-500"><Anchor size={20} /></div>
                 <div className="p-3 bg-white/5 rounded-xl text-amber-500"><Heart size={20} fill="currentColor" /></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
