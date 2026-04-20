'use client';

import { motion } from 'framer-motion';
import { Settings, Book, Volume2, Bike, Save, Shield, HardHat, Footprints, Code, Palette, Zap, Hammer, Swords, CheckCircle2 } from 'lucide-react';
import { BibleVersion, MotorbikeType, UserSettings } from '@/lib/types';
import { useState, useEffect } from 'react';

interface GarageProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export default function Garage({ settings, onUpdateSettings }: GarageProps) {
  const BIBLE_VERSIONS: BibleVersion[] = ['ESV', 'NIV', 'KJV', 'MSG'];
  const BIKES: MotorbikeType[] = ['naked', 'cafe', 'harley', 'speed', 'futuristic', 'adventure'];
  const [designInput, setDesignInput] = useState('');
  const [activeTab, setActiveTab] = useState<'tune' | 'gear' | 'canvas'>('tune');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const ARMOR_GEAR = [
    { icon: Hammer, name: 'Belt', truth: 'Truth', description: 'Keeps everything together.' },
    { icon: Shield, name: 'Breastplate', truth: 'Righteousness', description: 'Protects your heart.' },
    { icon: Footprints, name: 'Shoes', truth: 'Gospel of Peace', description: 'Gives you grip on the road.' },
    { icon: CheckCircle2, name: 'Shield', truth: 'Faith', description: 'Extinguishes fiery arrows.' },
    { icon: HardHat, name: 'Helmet', truth: 'Salvation', description: 'Protects your mind.' },
    { icon: Swords, name: 'Sword', truth: 'The Word of God', description: 'Your offensive gear.' },
  ];

  const testVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("¡Hola, Hadassah! Selig is ready for the road.");
      const preferredVoice = voices.find(v => (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && v.name.includes('Female'));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.pitch = settings.voicePitch;
      utterance.rate = settings.voiceRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 text-zinc-800 pb-32">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-purple-500/10 rounded-3xl mb-4 border border-purple-500/20">
          <Settings size={40} className="text-purple-600" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter handwritten text-purple-900">The Garage</h2>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2 leading-none">Tune your ride and Selig's voice</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10 bg-zinc-200/50 p-1.5 rounded-2xl">
        {(['tune', 'gear', 'canvas'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tune' && (
          <motion.div key="tune" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
              <div className="flex items-center gap-3 mb-8">
                <Book className="text-emerald-500" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Bible Version</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BIBLE_VERSIONS.map((v) => (
                  <button
                    key={v}
                    onClick={() => onUpdateSettings({ bibleVersion: v })}
                    className={`py-4 rounded-2xl text-sm font-bold transition-all border-2 ${
                      settings.bibleVersion === v 
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-transparent border-zinc-100 text-zinc-400 hover:border-zinc-200'
                    }`}
                  >
                    {v === 'MSG' ? 'The Message' : v}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Volume2 className="text-sky-500" />
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Selig's Voice</h3>
                </div>
                <button 
                  onClick={testVoice}
                  className="p-3 bg-sky-500 text-white rounded-2xl hover:bg-sky-600 transition-all active:scale-90"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Pitch</span>
                    <span className="text-xs font-black text-sky-600">{settings.voicePitch.toFixed(1)}</span>
                  </div>
                  <input type="range" min="0.5" max="2" step="0.1" value={settings.voicePitch} onChange={(e) => onUpdateSettings({ voicePitch: parseFloat(e.target.value) })} className="w-full h-1.5 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-sky-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Speed</span>
                    <span className="text-xs font-black text-sky-600">{settings.voiceRate.toFixed(1)}</span>
                  </div>
                  <input type="range" min="0.5" max="1.5" step="0.1" value={settings.voiceRate} onChange={(e) => onUpdateSettings({ voiceRate: parseFloat(e.target.value) })} className="w-full h-1.5 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-sky-500" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gear' && (
          <motion.div key="gear" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid gap-4">
            {ARMOR_GEAR.map((item, i) => (
              <div key={i} className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-black/5 shadow-lg group hover:scale-[1.02] transition-all">
                <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-600 group-hover:rotate-6 transition-transform">
                  <item.icon size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{item.name}</p>
                  <h4 className="text-xl font-black italic tracking-tighter text-zinc-800 leading-none mb-1">{item.truth}</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">{item.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-zinc-100 flex items-center justify-center text-emerald-500 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 size={16} strokeWidth={3} />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'canvas' && (
          <motion.div key="canvas" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
             <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-2xl text-center">
              <Palette className="mx-auto text-purple-600 mb-6" size={48} />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Design Canvas</h3>
              <p className="text-zinc-400 text-sm mb-10 leading-relaxed font-medium">Try typing a color to live-preview changes.</p>
              
              <div className="relative mb-10">
                <input value={designInput} onChange={(e) => setDesignInput(e.target.value)} placeholder="'royalpurple' or '#8b5cf6'" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-5 px-8 text-center text-purple-700 font-mono font-bold focus:outline-none focus:border-purple-500 transition-all shadow-inner" />
              </div>
              
              <div className="w-full h-32 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl overflow-hidden relative" style={{ backgroundColor: designInput || '#8b5cf6' }}>
                <div className="absolute inset-0 bg-white/10 opacity-30" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')` }} />
                <span className="relative z-10 font-black uppercase tracking-[0.2em] italic text-2xl text-white drop-shadow-lg">Luminous Preview</span>
              </div>
            </div>

            <div className="p-8 bg-zinc-900 rounded-[3rem] text-white flex flex-col items-center text-center gap-6 shadow-2xl">
               <Code className="text-sky-400" size={32} />
               <div>
                 <h4 className="text-lg font-black uppercase italic tracking-tighter mb-2">Want to see the logic?</h4>
                 <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto mb-8">Dive into the full source code on GitHub to practice your development skills.</p>
                 <a href="https://github.com/JGitu-creator/Selah-Ride" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-black rounded-full uppercase text-[10px] tracking-widest hover:bg-sky-400 hover:text-white transition-all">
                   Master Blueprint <Code size={14} />
                 </a>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
