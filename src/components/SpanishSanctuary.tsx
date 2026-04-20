'use client';

import { motion } from 'framer-motion';
import { BookMarked, Volume2, Globe, Search } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useState } from 'react';

export default function SpanishSanctuary() {
  const [searchTerm, setSearchTerm] = useState('');
  const words = useLiveQuery(() => db.spanishWords.toArray());

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredWords = words?.filter(w => 
    w.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-8 text-white">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-emerald-500/10 rounded-3xl mb-4 border border-emerald-500/20">
          <Globe size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic">The Spanish Sanctuary</h2>
        <p className="text-white/60">Your collection of God's Word in Spanish, Hadassah.</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your vocabulary..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredWords?.map((word) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                <BookMarked size={20} />
              </div>
              <button 
                onClick={() => speak(word.phrase)}
                className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <Volume2 size={18} />
              </button>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight italic">
              "{word.phrase}"
            </h3>
            <p className="text-emerald-400 font-bold text-sm mb-4 uppercase tracking-widest">
              {word.translation}
            </p>
            
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-white/50 leading-relaxed italic">
                {word.context}
              </p>
            </div>
          </motion.div>
        ))}
        {filteredWords?.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 italic">No phrases found. Selig will teach you more soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
