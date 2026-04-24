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

      const voices = window.speechSynthesis.getVoices();
      const text = `${affirmation.proverbHook}. Today&apos;s growth word is ${affirmation.growthWord.word}. ${affirmation.spanishPhrase.phrase}. ${affirmation.deepExegesis}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      const getFemaleVoice = () => {
        // High-priority specific sweet voices
        const priorityVoices = voices.filter(v => 
          (v.name.includes('Serena') || v.name.includes('Google UK English Female') || v.name.includes('Martha') || v.name.includes('Moira'))
        );
        
        if (priorityVoices.length > 0) return priorityVoices[0];

        // Fallback: any voice that is English and doesn't explicitly say "Male"
        return voices.find(v => 
          (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && 
          !v.name.toLowerCase().includes('male') &&
          (v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Soft') || v.name.includes('Google'))
        );
      };
      
      const preferredVoice = getFemaleVoice();
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-[#2c1a10]/10 text-zinc-900"
      style={{ borderTop: `8px solid ${accentColor}` }}
    >
      {/* Speech Toggle */}
      <button 
        onClick={speak}
        className="absolute top-6 right-6 p-3 bg-zinc-100/50 rounded-full text-zinc-600 hover:bg-zinc-200 transition-all active:scale-90"
        title="Listen to Selig"
      >
        {isSpeaking ? <VolumeX size={18} className="animate-pulse" /> : <Volume2 size={18} />}
      </button>

      {/* Proverb Hook */}
      <div className="mb-10 text-center">
        <div className="flex justify-center items-center gap-2 mb-4 text-zinc-400 uppercase tracking-[0.4em] text-[9px] font-black">
          <Quote size={10} />
          <span>The Hook</span>
        </div>
        <p className="text-3xl md:text-4xl font-serif italic text-zinc-800 leading-tight tracking-tight handwritten">
          &quot;{affirmation.proverbHook}&quot;
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Growth Word */}
        <div className="p-6 rounded-xl bg-zinc-50/50 border border-zinc-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-zinc-400 uppercase tracking-widest text-[9px] font-black">
            <Lightbulb size={10} />
            <span>Growth Word</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tighter uppercase italic">{affirmation.growthWord.word}</h3>
          <p className="text-zinc-600 text-sm leading-relaxed font-medium italic">
            {affirmation.growthWord.definition}
          </p>
        </div>

        {/* Spanish Phrase */}
        <div className="p-6 rounded-xl bg-purple-50/50 border border-purple-200/50 shadow-sm">
          <div className="text-purple-700/60 text-[9px] font-black uppercase tracking-widest mb-3">
            <span>Palabra del Día</span>
          </div>
          <p className="text-purple-900 text-xl font-black italic tracking-tighter leading-tight">
            &quot;{affirmation.spanishPhrase.phrase}&quot;
          </p>
          <p className="text-purple-700/60 text-[10px] font-bold mt-2 uppercase tracking-wider">
            ({affirmation.spanishPhrase.translation})
          </p>
        </div>
      </div>

      {/* Deep Road */}
      <div className="bg-zinc-100/30 p-8 rounded-xl border border-zinc-200/50">
        <div className="flex items-center gap-2 mb-4 text-zinc-400 uppercase tracking-widest text-[9px] font-black">
          <BookOpen size={10} />
          <span>The Deep Road</span>
        </div>
        <div className="text-zinc-800 text-lg leading-relaxed font-medium mb-6 serif-italic">
          {affirmation.deepExegesis}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200/50 pt-4">
          <span className="h-px w-8 bg-zinc-300"></span>
          <p className="font-black text-zinc-900 uppercase tracking-tighter text-sm italic">
            {affirmation.bibleVerse}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
