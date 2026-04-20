'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Book, Volume2, Bike, Save, Shield, HardHat, Footprints, Code, Palette, Zap } from 'lucide-react';
import { BibleVersion, MotorbikeType, UserSettings } from '@/lib/types';
import { useState } from 'react';

interface GarageProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export default function Garage({ settings, onUpdateSettings }: GarageProps) {
  const BIBLE_VERSIONS: BibleVersion[] = ['ESV', 'NIV', 'KJV', 'RV1960'];
  const BIKES: MotorbikeType[] = ['naked', 'cafe', 'harley', 'speed', 'futuristic', 'adventure'];
  const [designInput, setDesignInput] = useState('');
  const [activeTab, setActiveTab] = useState<'tune' | 'gear' | 'canvas'>('tune');

  const ARMOR_GEAR = [
    { icon: HardHat, name: 'Helmet', truth: 'Salvation', description: 'Protects your mind from lies.' },
    { icon: Shield, name: 'Leather Jacket', truth: 'Righteousness', description: 'Protects your heart.' },
    { icon: Footprints, name: 'Boots', truth: 'Gospel of Peace', description: 'Gives you grip on slippery trails.' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 text-white">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-white/10 rounded-3xl mb-4 shadow-2xl">
          <Settings size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">The Garage</h2>
        <p className="text-white/60">Tune your ride and prepare for the road.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        {(['tune', 'gear', 'canvas'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tune' && (
          <motion.div
            key="tune"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Bible Version */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Book className="text-emerald-400" />
                <h3 className="text-lg font-bold italic uppercase tracking-tighter">Bible Version</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BIBLE_VERSIONS.map((v) => (
                  <button
                    key={v}
                    onClick={() => onUpdateSettings({ bibleVersion: v })}
                    className={`py-4 rounded-xl text-sm font-bold transition-all ${
                      settings.bibleVersion === v 
                        ? 'bg-white text-black' 
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Volume2 className="text-blue-400" />
                <h3 className="text-lg font-bold italic uppercase tracking-tighter">Selig's Voice</h3>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Pitch</span>
                    <span className="text-xs font-bold text-blue-400">{settings.voicePitch.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.voicePitch}
                    onChange={(e) => onUpdateSettings({ voicePitch: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Speed</span>
                    <span className="text-xs font-bold text-blue-400">{settings.voiceRate.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={settings.voiceRate}
                    onChange={(e) => onUpdateSettings({ voiceRate: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gear' && (
          <motion.div
            key="gear"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Full Gear Check</h3>
              <p className="text-white/40 text-xs">Armor for the Highway of Holiness</p>
            </div>
            {ARMOR_GEAR.map((item, i) => (
              <div key={i} className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl group hover:bg-white/10 transition-all">
                <div className="p-4 bg-white/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
                  <item.icon size={32} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">{item.name}</h4>
                  <p className="text-xl font-bold italic tracking-tight">{item.truth}</p>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>
                <div className="ml-auto">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'canvas' && (
          <motion.div
            key="canvas"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
             <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center">
              <Palette className="mx-auto text-emerald-400 mb-4" size={40} />
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Design-to-Dev Canvas</h3>
              <p className="text-white/60 text-sm mb-6">Hadassah, try typing a color or style code to live-preview changes.</p>
              
              <div className="relative">
                <code className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs font-mono">.ui {'{'} color:</code>
                <input
                  value={designInput}
                  onChange={(e) => setDesignInput(e.target.value)}
                  placeholder="'blue' or '#ff0000'"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-28 pr-6 text-emerald-400 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
                />
                <code className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-xs font-mono">{'}'}</code>
              </div>
              
              <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-white/10">
                <div 
                  className="w-full h-24 rounded-xl flex items-center justify-center transition-all duration-500 shadow-2xl"
                  style={{ backgroundColor: designInput || '#10b981' }}
                >
                  <span className="font-black uppercase tracking-tighter italic text-2xl drop-shadow-lg">
                    Live Preview
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <Code className="text-white/40" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Designer Mission</h4>
                <p className="text-xs text-white/40">Selig will give you more coding tasks as you ride.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] flex flex-col items-center gap-4">
        <p>"Thus far the Lord has helped us."</p>
        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
          <Zap size={12} className="text-amber-400" />
          <span>Selah Engine v2.0 Live</span>
        </div>
      </div>
    </div>
  );
}
