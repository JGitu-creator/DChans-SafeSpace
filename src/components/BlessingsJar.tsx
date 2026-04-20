'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Sparkles, BookOpen, ScrollText, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export default function BlessingsJar() {
  const [newBlessing, setNewGrain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showJarContents, setShowJarContents] = useState(false);
  
  const blessings = useLiveQuery(() => db.gratitudeGrains.orderBy('date').reverse().toArray()) || [];
  
  // Count blessings added today
  const todayCount = blessings.filter(b => 
    new Date(b.date).toDateString() === new Date().toDateString()
  ).length;

  const addBlessing = async () => {
    if (!newBlessing.trim()) return;
    setIsAdding(true);

    // Simulate "dropping paper into jar" delay
    setTimeout(async () => {
      await db.gratitudeGrains.add({
        date: new Date(),
        text: newBlessing.trim(),
        type: 'gratitude'
      });
      setNewGrain('');
      setIsAdding(false);
    }, 60000); // 600ms for animation feel
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-10 text-white pb-20">
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-purple-500/10 rounded-[2rem] mb-4 border border-purple-500/20">
          <Sparkles size={40} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">DChan's Blessings Jar</h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
          Write 10 blessings today. <br/>
          <span className="text-sky-400">Glean what God has given you.</span>
        </p>
      </div>

      {/* The Visual Jar */}
      <div className="relative flex justify-center py-10">
        <div className="relative w-48 h-64 border-4 border-white/20 rounded-[3rem] bg-white/5 backdrop-blur-lg shadow-2xl overflow-hidden">
          {/* Jar Lid */}
          <div className="absolute top-0 inset-x-0 h-6 bg-white/10 border-b border-white/20 shadow-inner" />
          
          {/* Glass Reflections */}
          <div className="absolute top-10 left-4 w-2 h-32 bg-white/10 rounded-full blur-sm" />
          <div className="absolute top-10 right-4 w-1 h-20 bg-white/5 rounded-full blur-[2px]" />

          {/* Paper Scraps inside */}
          <div className="absolute inset-0 flex flex-wrap-reverse content-start gap-1 p-6 overflow-hidden">
            {blessings.slice(0, 30).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: Math.random() * 45 - 22 }}
                className="w-4 h-6 bg-white shadow-md rounded-sm border-t-2 border-purple-200"
              />
            ))}
          </div>

          {/* Today's Counter */}
          <div className="absolute bottom-6 inset-x-0 flex flex-col items-center">
            <span className="text-4xl font-black italic tracking-tighter text-white drop-shadow-lg">
              {todayCount}<span className="text-lg text-white/40">/10</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-purple-400">Today's Grains</span>
          </div>

          {/* Falling Paper Animation */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ y: -100, x: 0, rotate: 0, scale: 1 }}
                animate={{ 
                  y: 100, 
                  x: [0, -20, 20, -10, 0], 
                  rotate: [0, 180, 360, 540, 720],
                  scale: 0.5 
                }}
                transition={{ duration: 0.6, ease: "easeIn" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-10 bg-white shadow-2xl rounded-sm z-50 border-t-4 border-sky-400"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      {!showJarContents && (
        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-sky-400 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition" />
            <div className="relative bg-black/60 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 flex gap-4">
              <input
                value={newBlessing}
                onChange={(e) => setNewGrain(e.target.value)}
                placeholder="What did the King do for you today?"
                className="flex-1 bg-transparent text-lg font-medium placeholder:text-white/10 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && addBlessing()}
              />
              <button 
                onClick={addBlessing}
                disabled={isAdding || !newBlessing.trim()}
                className="p-4 bg-white text-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
          </div>

          <button 
            onClick={() => setShowJarContents(true)}
            className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            Open the Jar
          </button>
        </div>
      )}

      {/* Jar Contents View */}
      <AnimatePresence>
        {showJarContents && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-8 overflow-y-auto"
          >
            <div className="max-w-xl mx-auto space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Your Blessings Archive</h3>
                <button 
                  onClick={() => setShowJarContents(false)}
                  className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
                >
                  <X />
                </button>
              </div>

              <div className="grid gap-6">
                {blessings.map((b) => (
                  <motion.div
                    key={b.id}
                    className="p-6 bg-white/5 border border-white/10 rounded-3xl relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5"><ScrollText size={64} /></div>
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">
                      {new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-xl font-serif italic text-white/90 leading-snug pr-10">"{b.text}"</p>
                    <button 
                      onClick={() => b.id && db.gratitudeGrains.delete(b.id)}
                      className="absolute bottom-6 right-6 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {blessings.length === 0 && (
                <p className="text-center py-20 text-white/20 uppercase font-black italic tracking-widest">The jar is quiet...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

