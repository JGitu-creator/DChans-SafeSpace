'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Fixed timer: 0.6 seconds instead of 60 seconds
    setTimeout(async () => {
      await db.gratitudeGrains.add({
        date: new Date(),
        text: newBlessing.trim(),
        type: 'gratitude'
      });
      setNewGrain('');
      setIsAdding(false);
    }, 600); 
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-10 text-white pb-20 px-4">
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-purple-500/10 rounded-[2rem] mb-4 border border-purple-500/20 shadow-2xl">
          <Sparkles size={40} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">DChan's Blessings Jar</h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
          Glean 10 blessings today. <br/>
          <span className="text-sky-400 italic">"The King has brought me into His jar of love."</span>
        </p>
      </div>

      {/* The Visual Jar */}
      <div className="relative flex justify-center py-10 scale-110">
        <div className="relative w-56 h-72 border-4 border-white/20 rounded-[4rem] bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden transition-all duration-700">
          {/* Jar Lid (Wood texture look) */}
          <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#3d2b1f] to-[#2a1a10] border-b-2 border-white/10 shadow-xl z-20" />
          
          {/* Glass Reflections */}
          <div className="absolute top-10 left-6 w-3 h-48 bg-white/5 rounded-full blur-md" />
          <div className="absolute top-10 right-6 w-1 h-32 bg-white/5 rounded-full blur-[2px]" />

          {/* Paper Scraps inside */}
          <div className="absolute inset-0 flex flex-wrap-reverse content-start justify-center gap-1 p-8 overflow-hidden">
            {blessings.slice(0, 40).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0, rotate: Math.random() * 90 - 45 }}
                className="w-5 h-8 bg-[#fdf6e3] shadow-lg rounded-sm border-t-4 border-purple-300 flex-shrink-0"
              />
            ))}
          </div>

          {/* Today's Counter */}
          <div className="absolute bottom-10 inset-x-0 flex flex-col items-center z-30">
            <motion.span 
              key={todayCount}
              initial={{ scale: 1.5, color: '#0ea5e9' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,0,0,1)]"
            >
              {todayCount}<span className="text-xl text-white/30 ml-1">/10</span>
            </motion.span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 mt-1">Today's Harvest</span>
          </div>

          {/* Falling Paper Animation */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ y: -150, x: 0, rotate: 0, scale: 1.5 }}
                animate={{ 
                  y: 150, 
                  x: [0, -30, 30, -15, 0], 
                  rotate: [0, 360, 720, 1080],
                  scale: 0.6 
                }}
                transition={{ duration: 0.6, ease: "circIn" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-14 bg-white shadow-2xl rounded-sm z-50 border-t-8 border-sky-400"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <AnimatePresence mode="wait">
        {!showJarContents ? (
          <motion.div 
            key="input-view"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-sky-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-black/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 flex flex-col gap-6">
                <textarea
                  value={newBlessing}
                  onChange={(e) => setNewGrain(e.target.value)}
                  placeholder="Glean a blessing..."
                  className="w-full bg-transparent text-2xl font-black italic placeholder:text-white/10 focus:outline-none min-h-[100px] resize-none leading-tight tracking-tighter"
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addBlessing()}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Fold & Drop into Jar</span>
                  <button 
                    onClick={addBlessing}
                    disabled={isAdding || !newBlessing.trim()}
                    className="p-5 bg-white text-black rounded-full hover:scale-110 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-90 disabled:opacity-50"
                  >
                    <Plus size={32} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowJarContents(true)}
              className="w-full py-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-center gap-4 group hover:bg-white/10 transition-all"
            >
              <Archive size={20} className="text-purple-400 group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">Open the Jar</span>
            </button>
          </motion.div>
        ) : (
          /* Archive View - Beautiful Tiles */
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
                  <div className="p-3 bg-purple-500 rounded-2xl text-white shadow-lg shadow-purple-500/20">
                    <Archive size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Blessings Archive</h3>
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
                    initial={{ opacity: 0, rotate: i % 2 === 0 ? -2 : 2 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    className="scrapbook-paper rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden border border-white/10"
                  >
                    {/* Fold Animation look */}
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

                    <p className="text-2xl font-hand text-zinc-800 leading-snug pr-4">
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
