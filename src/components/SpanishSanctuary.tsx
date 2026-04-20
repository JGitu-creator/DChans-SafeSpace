'use client';

import { motion } from 'framer-motion';
import { BookMarked, Volume2, Globe, Search, Flower2, Sparkles } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 text-zinc-800 pb-32">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-emerald-500/10 rounded-3xl mb-4 border border-emerald-500/20">
          <Flower2 size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-emerald-900 handwritten">The Word Sanctuary</h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Your garden of growth in Spanish &amp; English</p>
      </div>

      <div className="relative mb-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your vocabulary garden..."
            className="w-full bg-white/60 backdrop-blur-sm border border-[#2c1a10]/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all text-lg font-medium placeholder:text-zinc-300 shadow-inner"
          />
        </div>
      </div>

      {/* Word Garden - Mosaic / Tile Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords?.map((word, i) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative group rounded-2xl p-6 shadow-md border transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
              i % 3 === 0 ? 'bg-emerald-50/80 border-emerald-100/50' : 
              i % 3 === 1 ? 'bg-sky-50/80 border-sky-100/50' : 
              'bg-purple-50/80 border-purple-100/50'
            }`}
          >
            {/* Visual Flourish */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-20 transition-opacity">
              <Sparkles size={64} />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2 rounded-xl ${
                i % 3 === 0 ? 'bg-emerald-500/10 text-emerald-600' : 
                i % 3 === 1 ? 'bg-sky-500/10 text-sky-600' : 
                'bg-purple-500/10 text-purple-600'
              }`}>
                <BookMarked size={16} />
              </div>
              <button 
                onClick={() => speak(word.phrase)}
                className="p-2 bg-white/50 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-white transition-all shadow-sm"
              >
                <Volume2 size={16} />
              </button>
            </div>
            
            <h3 className="text-xl font-black text-zinc-800 mb-1 tracking-tight italic serif-italic relative z-10">
              "{word.phrase}"
            </h3>
            <p className={`font-black text-[10px] mb-4 uppercase tracking-[0.2em] relative z-10 ${
                i % 3 === 0 ? 'text-emerald-700' : 
                i % 3 === 1 ? 'text-sky-700' : 
                'text-purple-700'
            }`}>
              ({word.translation})
            </p>
            
            <div className="pt-4 border-t border-black/5 relative z-10">
              <p className="text-[10px] text-zinc-500 leading-relaxed italic font-medium">
                {word.context}
              </p>
            </div>
          </motion.div>
        ))}
        {filteredWords?.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-[#2c1a10]/10 rounded-2xl bg-white/30 backdrop-blur-sm">
            <div className="flex justify-center mb-4 text-zinc-200">
               <Globe size={48} />
            </div>
            <p className="text-zinc-300 font-black uppercase italic tracking-[0.4em] text-xs">No words found in your garden yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
