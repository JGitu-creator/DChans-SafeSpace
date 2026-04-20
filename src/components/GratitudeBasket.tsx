'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export default function GratitudeBasket() {
  const [newGrain, setNewGrain] = useState('');
  const grains = useLiveQuery(() => db.gratitudeGrains.orderBy('date').reverse().limit(5).toArray());

  const addGrain = async () => {
    if (!newGrain.trim()) return;
    await db.gratitudeGrains.add({
      date: new Date(),
      text: newGrain.trim()
    });
    setNewGrain('');
  };

  return (
    <div className="w-full bg-[#3d2b1f]/40 border border-[#d4af37]/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative Wheat Background */}
      <div className="absolute -bottom-10 -right-10 text-[#d4af37]/5 rotate-12">
        <ShoppingBasket size={200} />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-[#d4af37]">Boaz's Field</h3>
          <p className="text-[#d4af37]/40 text-[10px] font-bold uppercase tracking-widest">Glean your daily blessings</p>
        </div>
        <div className="p-3 bg-[#d4af37]/10 rounded-2xl text-[#d4af37]">
          <ShoppingBasket size={24} />
        </div>
      </div>

      <div className="flex gap-2 mb-6 relative z-10">
        <input
          value={newGrain}
          onChange={(e) => setNewGrain(e.target.value)}
          placeholder="I am grateful for..."
          className="flex-1 bg-black/20 border border-[#d4af37]/20 rounded-xl px-4 py-3 text-sm text-[#fdf6e3] placeholder-[#d4af37]/30 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50"
          onKeyDown={(e) => e.key === 'Enter' && addGrain()}
        />
        <button 
          onClick={addGrain}
          className="p-3 bg-[#d4af37] text-black rounded-xl hover:bg-[#b8860b] transition-colors shadow-lg active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        <AnimatePresence>
          {grains?.map((grain) => (
            <motion.div
              key={grain.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="group flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <p className="text-xs text-white/80 font-medium italic">"{grain.text}"</p>
              </div>
              <button 
                onClick={() => grain.id && db.gratitudeGrains.delete(grain.id)}
                className="text-white/10 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {grains?.length === 0 && (
          <p className="text-center py-4 text-[#d4af37]/20 text-[10px] font-bold uppercase italic">
            Your basket is empty, Hadassah. Start gleaning.
          </p>
        )}
      </div>
    </div>
  );
}
