'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Book, Volume2, Bike, Save, Shield, HardHat, Footprints, Code, Palette, Zap, Hammer, Swords, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { BibleVersion, MotorbikeType, UserSettings, ROUTES, RouteConfig } from '@/lib/types';
import { useState, useEffect } from 'react';

interface GarageProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

const NATURE_THUMBNAILS: Record<string, string> = {
  mountain: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=200',
  valley: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=200',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=200',
  desert: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=200',
  galaxy: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=200',
};

export default function Garage({ settings, onUpdateSettings }: GarageProps) {
  const BIBLE_VERSIONS: BibleVersion[] = ['ESV', 'NIV', 'KJV', 'MSG'];
  const [activeTab, setActiveTab] = useState<'tune' | 'paths' | 'gear'>('paths');
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 text-zinc-800 pb-32">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-purple-500/10 rounded-3xl mb-4 border border-purple-500/20">
          <Palette size={40} className="text-purple-600" />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter handwritten text-purple-900">Artist's Studio</h2>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2 leading-none">Choose your path and tune your gear</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10 bg-zinc-200/50 p-1.5 rounded-2xl">
        {(['paths', 'tune', 'gear'] as const).map((tab) => (
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
        {activeTab === 'paths' && (
          <motion.div key="paths" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => onUpdateSettings({ preferredBike: route.bike })}
                className={`relative group flex flex-col items-center p-6 rounded-2xl border-4 transition-all overflow-hidden ${
                  settings.preferredBike === route.bike 
                    ? 'border-[#2c1a10] bg-white shadow-xl' 
                    : 'border-transparent bg-zinc-100 hover:bg-zinc-200 opacity-60 hover:opacity-100'
                }`}
              >
                {/* Mini Nature Painting */}
                <div className="w-full h-32 rounded-lg mb-4 overflow-hidden border border-zinc-200 shadow-inner group-hover:scale-105 transition-transform">
                  <img src={NATURE_THUMBNAILS[route.terrain]} alt={route.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0" />
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{route.sticker}</span>
                    <h4 className="text-xl font-black italic uppercase tracking-tighter text-zinc-800">{route.name}</h4>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{route.terrain} Journey</p>
                </div>

                {settings.preferredBike === route.bike && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 size={12} strokeWidth={4} />
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {activeTab === 'tune' && (
          <motion.div key="tune" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-black/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-amber-500" />
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Royal Decrees</h3>
                </div>
                <button 
                  onClick={() => {
                    if ('Notification' in window) {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          new Notification("¡Bendiciones, Hadassah!", {
                            body: "Selig will now send you daily royal decrees.",
                            icon: "/favicon.ico"
                          });
                        }
                      });
                    }
                  }}
                  className="px-6 py-2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-black transition-all"
                >
                  Enable Notifications
                </button>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed italic mb-6">
                Allow Selig to send you proactive words of encouragement directly to your device.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-black/5">
              <div className="flex items-center gap-3 mb-8">
                <Book className="text-emerald-500" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Bible Version</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BIBLE_VERSIONS.map((v) => (
                  <button
                    key={v}
                    onClick={() => onUpdateSettings({ bibleVersion: v })}
                    className={`py-4 rounded-xl text-sm font-bold transition-all border-2 ${
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

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-black/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Volume2 className="text-sky-500" />
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Selig's Voice</h3>
                </div>
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
              <div key={i} className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-black/5 shadow-lg group hover:scale-[1.02] transition-all">
                <div className="p-4 bg-amber-500/10 rounded-xl text-amber-600 group-hover:rotate-6 transition-transform">
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
      </AnimatePresence>
    </div>
  );
}
