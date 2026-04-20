'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Plus, Trash2, Sparkles, ScrollText, X, Archive, ShoppingBasket } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export default function BlessingsJar() {
  const [newBlessing, setNewGrain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showJarContents, setShowJarContents] = useState(false);
  
  const blessings = useLiveQuery(() => db.gratitudeGrains.orderBy('date').reverse().toArray()) || [];
  
  const todayCount = blessings.filter(b => 
    new Date(b.date).toDateString() === new Date().toDateString()
  ).length;

  const addBlessing = async () => {
    if (!newBlessing.trim()) return;
    setIsAdding(true);

    setTimeout(async () => {
      await db.gratitudeGrains.add({
        date: new Date(),
        text: newBlessing.trim(),
        type: 'gratitude'
      });
      setNewGrain('');
      setIsAdding(false);
    }, 800); 
  };

  const foldVariants: Variants = {
    initial: { scaleY: 1, rotateX: 0, opacity: 0, y: -50 },
    folding: { 
      scaleY: [1, 0.2, 0.1], 
      rotateX: [0, 90, 180], 
      opacity: 1,
      y: [0, 50, 200],
      transition: { duration: 0.8, ease: "easeInOut" } as any
    }
  };

  const unfoldVariants: Variants = {
    initial: { scaleY: 0.1, rotateX: 180, opacity: 0 },
    unfold: { 
      scaleY: 1, 
      rotateX: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" } as any
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-10 text-zinc-900 pb-20 px-4 relative">
      <div className="text-center space-y-2 relative z-10">
        <div className="inline-block p-4 bg-purple-500/10 rounded-[2rem] mb-4 border border-purple-500/20 shadow-2xl">
          <Sparkles size={40} className="text-purple-600" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#2d1b4d] leading-none">DChan's Blessings Jar</h2>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2 leading-none">Glean your daily harvest</p>
      </div>

      <div className="relative flex justify-center py-10 scale-110 z-10">
        {/* The Visual Jar - Refined for High Contrast */}
        <div className="relative w-56 h-72 border-4 border-black/5 rounded-[4rem] bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-700">
          <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-zinc-800 to-zinc-900 border-b-2 border-white/10 shadow-xl z-20" />
          
          <div className="absolute top-10 left-6 w-3 h-48 bg-white/20 rounded-full blur-md" />
          <div className="absolute top-10 right-6 w-1 h-32 bg-white/10 rounded-full blur-[2px]" />

          <div className="absolute inset-0 flex flex-wrap-reverse content-start justify-center gap-1 p-8 overflow-hidden">
            {blessings.slice(0, 40).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: Math.random() * 90 - 45 }}
                className="w-5 h-8 bg-[#fdf6e3] shadow-lg rounded-sm border-t-4 border-purple-400 flex-shrink-0"
              />
            ))}
          </div>

          <div className="absolute bottom-10 inset-x-0 flex flex-col items-center z-30">
            <motion.span 
              key={todayCount}
              initial={{ scale: 1.5, color: '#8b5cf6' }}
              animate={{ scale: 1, color: '#2d1b4d' }}
              className="text-5xl font-black italic tracking-tighter drop-shadow-sm"
            >
              {todayCount}<span className="text-xl text-zinc-400 ml-1">/10</span>
            </motion.span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-600 mt-1">Today's Grains</span>
          </div>

          <AnimatePresence>
            {isAdding && (
              <motion.div
                variants={foldVariants}
                initial="initial"
                animate="folding"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-white shadow-2xl rounded-sm z-50 border-t-8 border-sky-400 origin-top"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showJarContents ? (
          <motion.div key="input-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-sky-400 rounded-[2.5rem] blur opacity-20 transition duration-1000" />
              <div className="relative bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6">
                <textarea
                  value={newBlessing}
                  onChange={(e) => setNewGrain(e.target.value)}
                  placeholder="What happened today?..."
                  className="w-full bg-transparent text-2xl font-black italic placeholder:text-zinc-200 focus:outline-none min-h-[120px] resize-none leading-tight tracking-tighter text-[#2d1b4d]"
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addBlessing()}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Fold & Drop into Jar</span>
                  <button 
                    onClick={addBlessing}
                    disabled={isAdding || !newBlessing.trim()}
                    className="p-5 bg-zinc-900 text-white rounded-full hover:bg-black transition-all shadow-xl active:scale-90 disabled:opacity-50"
                  >
                    <Plus size={32} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowJarContents(true)}
              className="w-full py-6 bg-white border-2 border-zinc-100 rounded-[2rem] flex items-center justify-center gap-4 group hover:border-purple-200 transition-all shadow-xl"
            >
              <Archive size={20} className="text-purple-600 group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 group-hover:text-purple-900 transition-colors">Open the Jar</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="archive-view"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-6 md:p-12 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto pb-20">
              <div className="flex items-center justify-between mb-16 sticky top-0 z-50 bg-black/80 backdrop-blur-md p-4 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/20">
                    <Archive size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Blessings Archive</h3>
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none mt-1">Unfolding your harvest</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowJarContents(false)}
                  className="p-4 bg-white/5 rounded-full hover:bg-white/10 hover:text-red-400 transition-all active:scale-90 border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blessings.map((b, i) => (
                  <motion.div
                    key={b.id}
                    variants={unfoldVariants}
                    initial="initial"
                    animate="unfold"
                    transition={{ delay: i * 0.05 }}
                    className="scrapbook-paper rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden border border-black/5 origin-top"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rotate-45 translate-x-6 -translate-y-6" />
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600">
                          <ScrollText size={18} />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                          {new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <button 
                        onClick={() => b.id && db.gratitudeGrains.delete(b.id)}
                        className="text-zinc-300 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="text-2xl font-hand text-[#2d1b4d] leading-snug pr-4">
                      "{b.text}"
                    </p>
                    
                    <div className="absolute bottom-6 right-10 text-purple-500 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Sparkles size={48} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {blessings.length === 0 && (
                <div className="text-center py-40">
                  <div className="text-white/5 mb-8 flex justify-center"><ShoppingBasket size={120} /></div>
                  <p className="text-white/20 uppercase font-black italic tracking-[0.5em] text-xs">The jar is quiet, waiting for you.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
