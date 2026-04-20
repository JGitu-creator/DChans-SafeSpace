'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, JournalEntry } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Calendar as CalendarIcon, RefreshCw, BookOpen, PenTool } from 'lucide-react';
import { Affirmation } from '@/lib/types';
import AffirmationCard from '@/components/AffirmationCard';

export default function Journal({ currentMoodId }: { currentMoodId: string }) {
  const [isAdding, setIsAdding] = useState(false);
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
        body: JSON.stringify({ struggle: newEntry.struggle })
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

      // Add an Ebenezer stone for this entry
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
    <div className="w-full max-w-4xl mx-auto p-6 text-white min-h-screen">
      {/* Diary Header */}
      <div className="flex flex-col gap-2 mb-12 border-l-4 border-white/20 pl-6 py-2">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white/90">
          Chantal's Road Log
        </h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
          Personal Journal & Calendar
        </p>
      </div>

      {/* Calendar Strip (Simplified) */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-12 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white/60 font-bold uppercase text-[10px] tracking-widest">
            <CalendarIcon size={14} />
            <span>Selah Calendar</span>
          </div>
          <span className="text-xs font-bold text-white/20 uppercase">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border transition-all ${
                i === new Date().getDay() ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white/40'
              }`}>
                {new Date().getDate() - new Date().getDay() + i}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl">
            <PenTool size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold italic text-white/80 uppercase tracking-tighter">New Entry</h3>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white text-black p-4 rounded-2xl hover:scale-105 transition-all shadow-2xl active:scale-95"
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
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl text-zinc-900 relative">
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[2.5rem]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')` }} />
              
              <div className="flex items-center gap-2 mb-6 text-zinc-400 uppercase tracking-widest text-[10px] font-black">
                <BookOpen size={12} />
                <span>Writing with Selig</span>
              </div>
              
              <textarea
                value={newEntry.struggle}
                onChange={(e) => setNewEntry({ ...newEntry, struggle: e.target.value })}
                placeholder="What's on your heart, Hadassah?"
                className="w-full bg-transparent border-b border-zinc-100 py-4 mb-6 min-h-[120px] focus:outline-none text-xl font-medium placeholder:text-zinc-200"
              />
              <textarea
                value={newEntry.thoughts}
                onChange={(e) => setNewEntry({ ...newEntry, thoughts: e.target.value })}
                placeholder="Personal notes..."
                className="w-full bg-zinc-50 rounded-2xl p-4 mb-8 focus:outline-none text-sm italic placeholder:text-zinc-300"
              />
              
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-zinc-900 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50"
              >
                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                <span className="uppercase tracking-widest text-sm font-black">
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
              <span className="bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20">
                Selig's Word for you
              </span>
            </div>
            <AffirmationCard affirmation={lastAffirmation} accentColor="#10b981" />
            <button onClick={() => setLastAffirmation(null)} className="mt-6 text-white/30 text-xs font-bold hover:text-white transition-colors block mx-auto uppercase tracking-widest border-b border-white/10 pb-1">
              Dismiss and continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {entries?.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-[2rem] p-8 hover:bg-white/10 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => entry.id && db.journalEntries.delete(entry.id)} className="text-white/20 hover:text-red-400 p-2">
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/10 px-4 py-2 rounded-full text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <CalendarIcon size={12} />
                <span>{entry.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <span className="bg-white/5 px-3 py-1 rounded-full text-white/20 text-[8px] font-bold uppercase italic tracking-tighter">
                {entry.moodId.replace('-', ' ')}
              </span>
            </div>
            
            <h4 className="text-2xl font-black text-white/90 italic tracking-tight leading-tight mb-4 pr-12">
              "{entry.struggle}"
            </h4>
            
            {entry.thoughts && (
              <div className="pt-4 border-t border-white/5">
                <p className="text-white/40 text-sm italic font-medium leading-relaxed">
                  {entry.thoughts}
                </p>
              </div>
            )}
          </motion.div>
        ))}
        {entries?.length === 0 && !isAdding && (
          <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
            <div className="text-white/10 mb-4 flex justify-center"><PenTool size={48} /></div>
            <p className="text-white/20 text-sm font-bold uppercase italic tracking-widest">
              The road is open, Chantal. Start your log when you're ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
