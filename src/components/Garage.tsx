'use client';

import { motion } from 'framer-motion';
import { Settings, Book, Volume2, Bike, Save } from 'lucide-react';
import { BibleVersion, MotorbikeType, UserSettings } from '@/lib/types';

interface GarageProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export default function Garage({ settings, onUpdateSettings }: GarageProps) {
  const BIBLE_VERSIONS: BibleVersion[] = ['ESV', 'NIV', 'KJV', 'RV1960'];
  const BIKES: MotorbikeType[] = ['naked', 'cafe', 'harley', 'speed', 'futuristic', 'adventure'];

  return (
    <div className="w-full max-w-2xl mx-auto p-8 text-white">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-white/10 rounded-3xl mb-4">
          <Settings size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic tracking-widest">The Garage</h2>
        <p className="text-white/60">Tune your ride and Selig's voice.</p>
      </div>

      <div className="space-y-8">
        {/* Bible Version */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Book className="text-emerald-400" />
            <h3 className="text-lg font-bold">Bible Version</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BIBLE_VERSIONS.map((v) => (
              <button
                key={v}
                onClick={() => onUpdateSettings({ bibleVersion: v })}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
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
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="text-blue-400" />
            <h3 className="text-lg font-bold">Selig's Voice</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-white/60 uppercase">Pitch</span>
                <span className="text-xs font-bold">{settings.voicePitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voicePitch}
                onChange={(e) => onUpdateSettings({ voicePitch: parseFloat(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-white/60 uppercase">Speed</span>
                <span className="text-xs font-bold">{settings.voiceRate.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.voiceRate}
                onChange={(e) => onUpdateSettings({ voiceRate: parseFloat(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
        </div>

        {/* Preferred Bike */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bike className="text-amber-400" />
            <h3 className="text-lg font-bold">Default Bike</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BIKES.map((b) => (
              <button
                key={b}
                onClick={() => onUpdateSettings({ preferredBike: b })}
                className={`py-3 px-4 rounded-xl text-xs font-bold uppercase transition-all ${
                  settings.preferredBike === b 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-white/40 text-xs flex flex-col items-center gap-4">
        <p className="italic">"A well-tuned heart is like a well-tuned engine—it runs smooth on the Word."</p>
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
          <Save size={16} />
          <span className="font-bold">Settings Auto-Saved to the Cloud</span>
        </div>
      </div>
    </div>
  );
}
