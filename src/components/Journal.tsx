'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, JournalEntry } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Calendar, RefreshCw } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto p-6 text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Your Road Log</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
        >
          {isAdding ? <Plus className="rotate-45" /> : <Plus />}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-4">Share your heart with Selah...</h3>
              <textarea
                value={newEntry.struggle}
                onChange={(e) => setNewEntry({ ...newEntry, struggle: e.target.value })}
                placeholder="What struggles are creeping in today?"
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 mb-4 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-white/30"
              />
              <textarea
                value={newEntry.thoughts}
                onChange={(e) => setNewEntry({ ...newEntry, thoughts: e.target.value })}
                placeholder="Notes for yourself..."
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 mb-4 focus:outline-none focus:ring-1 focus:ring-white/30"
              />
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                {isLoading ? 'Selig is searching the Word...' : 'Save to Log'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastAffirmation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
              <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Selig's Word for you
              </span>
            </div>
            <AffirmationCard affirmation={lastAffirmation} accentColor="#10b981" />
            <button 
              onClick={() => setLastAffirmation(null)}
              className="mt-4 text-white/40 text-xs hover:text-white transition-colors block mx-auto underline"
            >
              Continue your ride
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {entries?.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                <Calendar size={14} />
                <span>{entry.date.toLocaleDateString()}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{entry.moodId}</span>
              </div>
              <button 
                onClick={() => entry.id && db.journalEntries.delete(entry.id)}
                className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h4 className="text-xl font-bold mb-2">"{entry.struggle}"</h4>
            {entry.thoughts && (
              <p className="text-white/60 text-sm italic">{entry.thoughts}</p>
            )}
          </motion.div>
        ))}
        {entries?.length === 0 && !isAdding && (
          <div className="text-center py-20 text-white/30 italic">
            No entries yet. Start your log when you're ready.
          </div>
        )}
      </div>
    </div>
  );
}
