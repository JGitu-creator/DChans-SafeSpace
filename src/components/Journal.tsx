'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Calendar as CalendarIcon, RefreshCw, BookOpen, PenTool, Palette } from 'lucide-react';
import { Affirmation, UserSettings } from '@/lib/types';
import AffirmationCard from '@/components/AffirmationCard';

const PAINTS = [
  { name: 'Emerald', color: '#10b981', mood: 'Peace' },
  { name: 'Gold', color: '#f59e0b', mood: 'Joy' },
  { name: 'Royal', color: '#8b5cf6', mood: 'Dignity' },
  { name: 'Sky', color: '#0ea5e9', mood: 'Hope' },
  { name: 'Rose', color: '#f43f5e', mood: 'Love' },
  { name: 'Midnight', color: '#312e81', mood: 'Reflection' },
];

export default function Journal({ currentMoodId, settings }: { currentMoodId: string, settings?: UserSettings }) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPaint, setSelectedPaint] = useState(PAINTS[0]);
  const [newEntry, setNewEntry] = useState({ struggle: '', thoughts: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [lastAffirmation, setLastAffirmation] = useState<Affirmation | null>(null);
  
  const entries = useLiveQuery(() => db.journalEntries.orderBy('date').reverse().toArray());

  const handleSave = async () => {
    if (!newEntry.struggle.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/selig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          struggle: newEntry.struggle,
          mood: selectedPaint.mood,
          settings: settings 
        })
      });
      
      const affirmation = await response.json();
      setLastAffirmation(affirmation);

      await db.journalEntries.add({
        date: new Date(),
        moodId: currentMoodId,
        struggle: newEntry.struggle,
        affirmation: JSON.stringify(affirmation),
        thoughts: newEntry.thoughts
      });

      await db.ebenezerStones.add({
        date: new Date(),
        note: `Honesty: ${newEntry.struggle.substring(0, 20)}...`,
        intensity: 0.5
      });

      setNewEntry({ struggle: '', thoughts: '' });
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      alert("Selig is offline for a moment, but your struggle is saved.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-zinc-800 min-h-screen">
      {/* Road Log Header */}
      <div className="flex flex-col gap-2 mb-12 border-l-4 border-purple-500/20 pl-6 py-2">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-purple-900 handwritten">
          Chantal&apos;s Road Log
        </h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
          Personal Journey &amp; Sanctuary
        </p>
      </div>

      {/* Artist's Calendar Strip */}
      <div className="bg-white/60 backdrop-blur-sm p-6 mb-12 rounded-2xl shadow-lg border border-[#2c1a10]/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-[9px] tracking-[0.3em]">
            <CalendarIcon size={12} />
            <span>DChan's Calendar</span>          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
              </span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                i === new Date().getDay() ? 'bg-purple-600 text-white border-purple-600 shadow-md rotate-2' : 'bg-zinc-50/50 border-zinc-100 text-zinc-400'
              }`}>
                {new Date().getDate() - new Date().getDay() + i}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <PenTool size={18} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold italic text-purple-900 uppercase tracking-tighter">New Entry</h3>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-zinc-900 text-white p-4 rounded-xl hover:scale-105 transition-all shadow-xl active:scale-95"
        >
          {isAdding ? <Plus className="rotate-45" /> : <Plus />}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12 overflow-hidden"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-[#2c1a10]/10 shadow-xl text-zinc-800 relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-2xl canvas-texture" />
              
              <div className="flex items-center gap-2 mb-4 text-zinc-400 uppercase tracking-widest text-[9px] font-black">
                <Palette size={10} />
                <span>Artist&apos;s Palette - Paint your mood</span>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
                {PAINTS.map((paint) => (
                  <button
                    key={paint.name}
                    onClick={() => setSelectedPaint(paint)}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${
                      selectedPaint.name === paint.name 
                        ? 'border-zinc-800 bg-zinc-50 scale-105 shadow-sm' 
                        : 'border-transparent bg-zinc-100/50 grayscale hover:grayscale-0'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: paint.color }} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{paint.mood}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-6 text-zinc-400 uppercase tracking-widest text-[9px] font-black">
                <BookOpen size={10} />
                <span>Writing with Selig</span>
              </div>
              
              <textarea
                value={newEntry.struggle}
                onChange={(e) => setNewEntry({ ...newEntry, struggle: e.target.value })}
                placeholder="What&apos;s on your heart, Hadassah?"
                className="w-full bg-transparent border-b border-zinc-100 py-4 mb-6 min-h-[120px] focus:outline-none text-xl font-medium placeholder:text-zinc-200 serif-italic"
              />
              <textarea
                value={newEntry.thoughts}
                onChange={(e) => setNewEntry({ ...newEntry, thoughts: e.target.value })}
                placeholder="Personal notes..."
                className="w-full bg-zinc-50/50 rounded-xl p-4 mb-8 focus:outline-none text-sm italic placeholder:text-zinc-300"
              />
              
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-zinc-900 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50"
              >
                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                <span className="uppercase tracking-widest text-xs font-black">
                  {isLoading ? 'Selig is reflecting...' : 'Seal the entry'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastAffirmation && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-16">
            <div className="text-center mb-6">
              <span className="bg-emerald-500 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-emerald-500/20">
                Selig&apos;s Word for you
              </span>
            </div>
            <AffirmationCard affirmation={lastAffirmation} accentColor="#10b981" />
            <button onClick={() => setLastAffirmation(null)} className="mt-6 text-zinc-400 text-[10px] font-black hover:text-purple-600 transition-colors block mx-auto uppercase tracking-[0.4em] border-b border-zinc-100 pb-1">
              Dismiss and continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 pb-20">
        {entries?.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 border border-[#2c1a10]/5 rounded-2xl p-8 hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => entry.id && db.journalEntries.delete(entry.id)} className="text-zinc-300 hover:text-red-500 p-2">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-zinc-50/50 px-4 py-2 rounded-full text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border border-zinc-100/50">
                <CalendarIcon size={10} />
                <span>{entry.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <span className="text-purple-600/40 text-[8px] font-black uppercase italic tracking-tighter">
                {entry.moodId.replace('-', ' ')}
              </span>
            </div>
            
            <h4 className="text-2xl font-black text-zinc-800 italic tracking-tight leading-tight mb-4 pr-12 serif-italic">
              &quot;{entry.struggle}&quot;
            </h4>
            
            {entry.thoughts && (
              <div className="pt-4 border-t border-zinc-100/50">
                <p className="text-zinc-500 text-sm italic font-medium leading-relaxed">
                  {entry.thoughts}
                </p>
              </div>
            )}
          </motion.div>
        ))}
        {entries?.length === 0 && !isAdding && (
          <div className="text-center py-32 border-2 border-dashed border-[#2c1a10]/10 rounded-2xl bg-white/30 backdrop-blur-sm">
            <div className="text-zinc-200 mb-4 flex justify-center"><PenTool size={40} /></div>
            <p className="text-zinc-300 text-[10px] font-black uppercase italic tracking-[0.4em]">
              The road is open, Chantal. Start your log when you&apos;re ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
