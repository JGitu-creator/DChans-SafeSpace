'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Sparkles, Plus, Trash2, BookMarked, Quote } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useSupabase } from './SupabaseProvider';

export default function GratitudeBasket() {
  const { syncData } = useSupabase();
  const [newGrain, setNewGrain] = useState('');
  const [activeTab, setActiveTab] = useState<'gratitude' | 'words'>('gratitude');
  
  const grains = useLiveQuery(() => db.gratitudeGrains.orderBy('date').reverse().toArray());
  const words = useLiveQuery(() => db.spanishWords.orderBy('id').reverse().toArray());

  const addGrain = async () => {
    if (!newGrain.trim()) return;
    await db.gratitudeGrains.add({
      date: new Date(),
      text: newGrain.trim(),
      type: 'gratitude'
    });
    syncData();
    setNewGrain('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 text-white">
      <div className="text-center">
        <div className="inline-block p-4 bg-purple-500/10 rounded-3xl mb-4 border border-purple-500/20">
          <ShoppingBasket size={40} className="text-purple-400" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Boaz&apos;s Field</h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Glean your daily blessings & words</p>
      </div>

      <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        <button 
          onClick={() => setActiveTab('gratitude')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'gratitude' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Blessings
        </button>
        <button 
          onClick={() => setActiveTab('words')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'words' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Words Learnt
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'gratitude' ? (
          <motion.div key="gratitude" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex gap-2 mb-8">
              <input
                value={newGrain}
                onChange={(e) => setNewGrain(e.target.value)}
                placeholder="I am grateful for..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && addGrain()}
              />
              <button 
                onClick={addGrain}
                className="p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all shadow-xl active:scale-95"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {grains?.map((grain) => (
                <motion.div
                  key={grain.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group flex items-center justify-between bg-black/20 border border-white/5 p-5 rounded-3xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                    <p className="text-sm text-white/80 font-medium italic">&quot;{grain.text}&quot;</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (grain.id) {
                        await db.gratitudeGrains.delete(grain.id);
                        syncData();
                      }
                    }} 
                    className="text-white/10 hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
              {grains?.length === 0 && (
                <p className="text-center py-20 text-white/10 text-xs font-black uppercase tracking-widest italic">Your basket is empty, Hadassah.</p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="words" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {words?.map((word) => (
              <div key={word.id} className="bg-black/20 border border-white/5 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><BookMarked size={48} /></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${word.type === 'Spanish' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {word.type}
                  </span>
                </div>
                <h4 className="text-xl font-black italic text-white mb-1">&quot;{word.phrase}&quot;</h4>
                <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">{word.translation}</p>
              </div>
            ))}
            {words?.length === 0 && (
              <p className="text-center py-20 text-white/10 text-xs font-black uppercase tracking-widest italic">No words collected yet. Selig is preparing lessons.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
