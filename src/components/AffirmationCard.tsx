'use client';

import { motion } from 'framer-motion';
import { Quote, BookOpen, Lightbulb } from 'lucide-react';
import { Affirmation } from '@/lib/types';

interface AffirmationCardProps {
  affirmation: Affirmation;
  accentColor: string;
}

export default function AffirmationCard({ affirmation, accentColor }: AffirmationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20"
      style={{ borderLeft: `8px solid ${accentColor}` }}
    >
      {/* Proverb Hook */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 text-zinc-500 uppercase tracking-widest text-xs font-bold">
          <Quote size={14} />
          <span>The Hook</span>
        </div>
        <p className="text-2xl font-serif italic text-zinc-800 leading-snug">
          "{affirmation.proverbHook}"
        </p>
      </div>

      {/* Growth Word */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
        <div className="flex items-center gap-2 mb-1 text-zinc-500 uppercase tracking-widest text-xs font-bold">
          <Lightbulb size={14} />
          <span>Growth Word</span>
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-1">{affirmation.growthWord.word}</h3>
        <p className="text-zinc-600 text-sm leading-relaxed">
          {affirmation.growthWord.definition}
        </p>
      </div>

      {/* Spanish Phrase */}
      <div className="mb-8 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100/50">
        <div className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
          <span>Palabra del Día</span>
        </div>
        <p className="text-emerald-900 font-bold italic tracking-tight">
          "{affirmation.spanishPhrase.phrase}"
        </p>
        <p className="text-emerald-700/60 text-xs mt-0.5">
          ({affirmation.spanishPhrase.translation})
        </p>
      </div>

      {/* Deep Exegesis */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-zinc-500 uppercase tracking-widest text-xs font-bold">
          <BookOpen size={14} />
          <span>Deep Exegesis</span>
        </div>
        <div className="text-zinc-700 leading-relaxed whitespace-pre-wrap mb-4">
          {affirmation.deepExegesis}
        </div>
        <p className="text-right font-bold text-zinc-900 italic">
          — {affirmation.bibleVerse}
        </p>
      </div>
    </motion.div>
  );
}
