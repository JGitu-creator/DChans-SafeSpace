'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Plus, Trash2, Sparkles, ScrollText, X, Archive, ShoppingBasket, Heart, Star, Bike, Flower, Sun, Cross } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

const ORIGAMI_SHAPES = [
  { icon: Heart, color: 'text-pink-400' },
  { icon: Star, color: 'text-amber-400' },
  { icon: Bike, color: 'text-sky-400' },
  { icon: Flower, color: 'text-purple-400' },
  { icon: Sun, color: 'text-yellow-400' },
  { icon: Cross, color: 'text-zinc-400' }
];

export default function BlessingsJar() {
  const [newBlessing, setNewGrain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showJarContents, setShowJarContents] = useState(false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  
  const blessings = useLiveQuery(() => db.gratitudeGrains.orderBy('date').reverse().toArray()) || [];
  
  const todayCount = blessings.filter(b => 
    new Date(b.date).toDateString() === new Date().toDateString()
  ).length;

  const addBlessing = async () => {
    if (!newBlessing.trim() || isAdding) return;
    
    // Pick a new random shape
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * ORIGAMI_SHAPES.length);
    } while (nextIndex === currentShapeIndex);
    
    setCurrentShapeIndex(nextIndex);
    setIsAdding(true);

    // Increase delay to 1.2s to actually see the folding
    setTimeout(async () => {
      await db.gratitudeGrains.add({
        date: new Date(),
        text: newBlessing.trim(),
        type: 'gratitude'
      });
      setNewGrain('');
      setIsAdding(false);
    }, 1200); 
  };

  const foldVariants: Variants = {
    initial: { 
      scaleY: 1, 
      rotateY: 0, 
      opacity: 0, 
      y: -100 
    },
    folding: { 
      scaleY: [1, 0.4, 0.1], 
      rotateY: [0, 180, 360], 
      opacity: [0, 1, 1],
      y: [-100, 50, 300],
      transition: { duration: 1.2, ease: "easeInOut" } as any
    }
  };

  const unfoldVariants: Variants = {
    initial: { scale: 0.1, rotateY: 180, opacity: 0 },
    unfold: { 
      scale: 1, 
      rotateY: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" } as any
    }
  };

  const CurrentShapeIcon = ORIGAMI_SHAPES[currentShapeIndex].icon;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-10 text-zinc-900 pb-20 px-4 relative">
      {/* Visual Header - High Contrast */}
      <div className="text-center space-y-4 relative z-10">
        <div className="inline-block p-5 bg-purple-500/10 rounded-[2.5rem] mb-2 border-2 border-purple-500/20 shadow-2xl">
          <Sparkles size={44} className="text-purple-600" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#2d1b4d] leading-none">DChan&apos;s Blessings Jar</h2>
        <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] leading-relaxed">
          Glean 10 blessings today. <br/>
          <span className="text-purple-700 italic">&quot;Grateful on the open road.&quot;</span>
        </p>
      </div>

      <div className="relative flex justify-center py-10 scale-110 z-10">
        {/* The Visual Jar */}
        <div className="relative w-64 h-80 border-4 border-black/5 rounded-[4.5rem] bg-white/60 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-700">
          <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-zinc-800 to-zinc-900 border-b-2 border-white/10 shadow-xl z-20" />
          <div className="absolute top-12 left-8 w-3 h-56 bg-white/20 rounded-full blur-md" />
          <div className="absolute top-12 right-8 w-1 h-40 bg-white/10 rounded-full blur-[2px]" />

          <div className="absolute inset-0 flex flex-wrap-reverse content-start justify-center gap-2 p-10 overflow-hidden">
            {blessings.slice(0, 30).map((_, i) => {
              const Shape = ORIGAMI_SHAPES[i % ORIGAMI_SHAPES.length].icon;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: (i * 137.5) % 90 - 45 }}
                  className={`w-7 h-7 flex items-center justify-center bg-white shadow-md rounded-xl border border-zinc-100 ${ORIGAMI_SHAPES[i % ORIGAMI_SHAPES.length].color}`}
                >
                  <Shape size={14} strokeWidth={3} />
                </motion.div>
              );
            })}
          </div>

          <div className="absolute bottom-12 inset-x-0 flex flex-col items-center z-30">
            <motion.span 
              key={todayCount}
              initial={{ scale: 1.5, color: '#8b5cf6' }}
              animate={{ scale: 1, color: '#2d1b4d' }}
              className="text-6xl font-black italic tracking-tighter drop-shadow-md"
            >
              {todayCount}<span className="text-xl text-zinc-400 ml-1">/10</span>
            </motion.span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 mt-1">Today&apos;s Harvest</span>
          </div>

          {/* Animated Falling Origami Shape */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                variants={foldVariants}
                initial="initial"
                animate="folding"
                className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
              >
                <div className={`p-6 bg-white shadow-2xl rounded-3xl border-4 border-sky-400 ${ORIGAMI_SHAPES[currentShapeIndex].color} scale-125`}>
                  <CurrentShapeIcon size={40} strokeWidth={4} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showJarContents ? (
          <motion.div key="input-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-sky-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6">
                <textarea
                  value={newBlessing}
                  onChange={(e) => setNewGrain(e.target.value)}
                  placeholder="Glean a blessing..."
                  className="w-full bg-zinc-50 border-none rounded-2xl p-6 text-2xl font-black italic placeholder:text-zinc-200 focus:outline-none min-h-[140px] resize-none leading-tight tracking-tighter text-[#2d1b4d] shadow-inner"
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addBlessing()}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fold & Drop into Jar</span>
                  <button 
                    onClick={addBlessing}
                    disabled={isAdding || !newBlessing.trim()}
                    className="p-6 bg-zinc-900 text-white rounded-full hover:bg-black transition-all shadow-2xl active:scale-90 disabled:opacity-50"
                  >
                    <Plus size={36} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowJarContents(true)}
              className="w-full py-6 bg-white border-2 border-zinc-100 rounded-[2.5rem] flex items-center justify-center gap-4 group hover:border-purple-200 transition-all shadow-xl"
            >
              <Archive size={20} className="text-purple-600 group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 group-hover:text-purple-900 transition-colors">Open the Vault</span>
            </button>
          </motion.div>
        ) : (
          /* Archive View - Fixed for High Contrast Visibility */
          <motion.div
            key="archive-view"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[100] bg-[#fdf6e3] p-6 md:p-12 overflow-y-auto"
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")` }}
          >
            <div className="max-w-4xl mx-auto pb-24">
              <div className="flex items-center justify-between mb-16 sticky top-0 z-50 bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-black/5 shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-purple-600 rounded-[1.5rem] text-white shadow-xl shadow-purple-500/20 rotate-3">
                    <Archive size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-purple-950">Blessings Archive</h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1 italic">The King&apos;s Provision</p>

                  </div>
                </div>
                <button 
                  onClick={() => setShowJarContents(false)}
                  className="p-5 bg-zinc-900 text-white rounded-full hover:bg-black transition-all active:scale-90 border-4 border-white shadow-2xl"
                >
                  <X size={24} strokeWidth={3} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {blessings.map((b, i) => (
                  <motion.div
                    key={b.id}
                    variants={unfoldVariants}
                    initial="initial"
                    animate="unfold"
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[3rem] p-12 shadow-2xl relative group overflow-hidden border border-black/5 origin-top"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-zinc-50 rotate-45 translate-x-8 -translate-y-8" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                          <ScrollText size={20} />
                        </div>
                        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] font-mono">
                          {new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <button 
                        onClick={() => b.id && db.gratitudeGrains.delete(b.id)}
                        className="text-zinc-200 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Deep Ink Text Color */}
                    <p className="text-3xl font-hand text-[#2d1b4d] leading-snug pr-6 tracking-tight">
                      &quot;{b.text}&quot;
                    </p>
                    
                    <div className="absolute bottom-8 right-12 text-purple-500 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <Sparkles size={120} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {blessings.length === 0 && (
                <div className="text-center py-48">
                  <div className="text-zinc-100 mb-10 flex justify-center"><ShoppingBasket size={160} /></div>
                  <p className="text-zinc-300 uppercase font-black italic tracking-[0.6em] text-xs">The vault is quiet, waiting for you.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
