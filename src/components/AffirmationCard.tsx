'use client';

import { motion } from 'framer-motion';
import { Quote, BookOpen, Lightbulb, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { Affirmation } from '@/lib/types';
import { useState, useEffect } from 'react';

interface AffirmationCardProps {
  affirmation: Affirmation;
  accentColor: string;
  voiceRate?: number;
  voicePitch?: number;
}

export default function AffirmationCard({ 
  affirmation, 
  accentColor, 
  voiceRate = 0.9, 
  voicePitch = 1.1 
}: AffirmationCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const text = `${affirmation.proverbHook}. Today's growth word is ${affirmation.growthWord.word}. ${affirmation.spanishPhrase.phrase}. ${affirmation.deepExegesis}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      
      // Look for a sweet, soft British Female voice
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && 
        (v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Serena') || v.name.includes('Martha'))
      );
      
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.pitch = voicePitch;
      utterance.rate = voiceRate;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Chrome needs this to load voices
    window.speechSynthesis.getVoices();
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/20 text-zinc-900"
      style={{ borderLeft: `12px solid ${accentColor}` }}
    >
      {/* Royal Seal if Decree */}
      {affirmation.isRoyalDecree && (
        <div className="absolute -top-4 -left-4 bg-amber-400 text-black p-3 rounded-full shadow-2xl border-4 border-white rotate-[-15deg] z-10">
          <ShieldCheck size={24} />
        </div>
      )}

      {/* Speech Toggle */}
      <button 
        onClick={speak}
        className="absolute top-8 right-8 p-4 bg-zinc-100 rounded-2xl text-zinc-600 hover:bg-zinc-200 transition-all active:scale-90 shadow-sm"
        title="Listen to Selig"
      >
        {isSpeaking ? <VolumeX size={20} className="animate-pulse" /> : <Volume2 size={20} />}
      </button>

      {/* Proverb Hook */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3 text-zinc-400 uppercase tracking-[0.3em] text-[10px] font-black">
          <Quote size={12} />
          <span>The Hook</span>
        </div>
        <p className="text-3xl font-serif italic text-zinc-800 leading-tight tracking-tight">
          "{affirmation.proverbHook}"
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Growth Word */}
        <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 uppercase tracking-widest text-[9px] font-black">
            <Lightbulb size={12} />
            <span>Growth Word</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 mb-1 tracking-tighter uppercase italic">{affirmation.growthWord.word}</h3>
          <p className="text-zinc-500 text-xs leading-relaxed font-medium">
            {affirmation.growthWord.definition}
          </p>
        </div>

        {/* Spanish Phrase */}
        <div className="px-6 py-6 rounded-[2rem] bg-purple-50 border border-purple-100/50 shadow-inner">
          <div className="text-purple-700/40 text-[9px] font-black uppercase tracking-widest mb-2">
            <span>Palabra del Día</span>
          </div>
          <p className="text-purple-900 text-xl font-black italic tracking-tighter leading-tight">
            "{affirmation.spanishPhrase.phrase}"
          </p>
          <p className="text-purple-700/60 text-[10px] font-bold mt-1 uppercase tracking-wider">
            {affirmation.spanishPhrase.translation}
          </p>
        </div>
      </div>

      {/* Deep Exegesis */}
      <div className="bg-zinc-50/50 p-8 rounded-[2rem] border border-zinc-100">
        <div className="flex items-center gap-2 mb-4 text-zinc-400 uppercase tracking-widest text-[9px] font-black">
          <BookOpen size={12} />
          <span>The Deep Road</span>
        </div>
        <div className="text-zinc-700 text-lg leading-relaxed font-medium mb-6 italic">
          {affirmation.deepExegesis}
        </div>
        <p className="text-right font-black text-zinc-900 uppercase tracking-tighter text-sm italic border-t border-zinc-200 pt-4">
          — {affirmation.bibleVerse}
        </p>
      </div>
    </motion.div>
  );
}
