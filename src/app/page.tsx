'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Bike, MapPin, Zap, Settings, Book, MessageSquare, Menu, X, LogOut, Code, Sparkles, Heart } from 'lucide-react';
import { MOODS, ThemeConfig, Affirmation, UserSettings, EbenezerStone } from '@/lib/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

import MoodSelector from '@/components/MoodSelector';
import AffirmationCard from '@/components/AffirmationCard';
import Journal from '@/components/Journal';
import PitStop from '@/components/PitStop';
import DevModeHint from '@/components/DevModeHint';
import SeligChat from '@/components/SeligChat';
import Garage from '@/components/Garage';
import TrailMap from '@/components/TrailMap';
import GratitudeBasket from '@/components/GratitudeBasket';
import SpanishSanctuary from '@/components/SpanishSanctuary';
import MidnightLamp from '@/components/MidnightLamp';
import RoyalDecree from '@/components/RoyalDecree';
import AudioHug from '@/components/AudioHug';

type View = 'affirmation' | 'journal' | 'study' | 'pitstop' | 'garage' | 'dev' | 'chat' | 'trail' | 'basket' | 'spanish' | 'midnight';

const LOCK_SCREEN_BIKES = [
  '/hadassah-bike.png',
  'https://images.unsplash.com/photo-1558981403-c5f9199a28ad?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&q=80&w=2070',
];

const INITIAL_AFFIRMATION: Affirmation = {
  proverbHook: "A journey of a thousand miles begins with a single turn of the key.",
  growthWord: { word: "Resilience", definition: "The capacity to recover quickly from difficulties; toughness." },
  spanishPhrase: { phrase: "Eres amada y elegida.", translation: "You are loved and chosen." },
  deepExegesis: "In the story of Ruth, she faced a crossroads. She chose the road to Bethlehem. Like a loyal 'Group Rider', she didn't leave her sister Naomi. Today, Hadassah, your loyalty to your true self and your Father is your greatest 'gear'.",
  bibleVerse: "Ruth 1:16"
};

export default function Home() {
  const [currentMood, setCurrentMood] = useState<ThemeConfig>(MOODS[1]); 
  const [isLocked, setIsLocked] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('affirmation');
  const [lockImageIndex, setLockImageIndex] = useState(0);
  const [showDecree, setShowDecree] = useState(false);
  const [decreeMessage, setDecreeMessage] = useState('');
  const [rescueMode, setRescueMode] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    bibleVersion: 'ESV',
    voiceRate: 0.9,
    voicePitch: 1.1,
    preferredBike: 'adventure',
  });

  const stones = useLiveQuery(() => db.ebenezerStones.toArray()) || [];

  useEffect(() => {
    if (isLocked) {
      const interval = setInterval(() => setLockImageIndex((prev) => (prev + 1) % LOCK_SCREEN_BIKES.length), 7000);
      return () => clearInterval(interval);
    }
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked) {
      const now = new Date();
      const last = settings.lastOpened ? new Date(settings.lastOpened) : now;
      const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
      if (hoursSince > 48) setRescueMode(true);
      setSettings(prev => ({ ...prev, lastOpened: now }));
      if (Math.random() > 0.8) {
        setDecreeMessage("Hadassah, you were called for such a time as this. Your worth is royal, and the King is well-pleased with you.");
        setShowDecree(true);
      }
    }
  }, [isLocked]);

  const backgroundImages: Record<string, string> = {
    mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2560',
    valley: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2560',
    forest: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=2560', 
    desert: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=2560',
    galaxy: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2560',
  };

  const handleUnlock = () => {
    if (passcode === '1122') setIsLocked(false);
    else { alert('Wrong code, mi hermana.'); setPasscode(''); }
  };

  return (
    <main className="relative min-h-screen w-full font-sans text-zinc-900 bg-black">
      {/* Fixed Background for Smooth Scrolling */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div key={isLocked ? `lock-${lockImageIndex}` : currentMood.terrain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
            <img src={isLocked ? LOCK_SCREEN_BIKES[lockImageIndex] : backgroundImages[currentMood.terrain]} className="w-full h-full object-cover opacity-50" alt="Background" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLocked ? (
          <motion.div key="lock-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="relative z-50 flex min-h-screen flex-col items-center justify-center p-8 text-white backdrop-blur-md">
            <div className="absolute top-12 left-8 md:left-12"><AudioHug /></div>
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center gap-12 w-full max-w-sm text-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-6xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl">Selah Ride</h1>
                <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] leading-none text-purple-400 text-sky-400">The Highway of Holiness</p>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-sky-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Enter Code" className="relative w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-center text-3xl tracking-[1em] focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-xl text-white" onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} />
                </div>
                <button onClick={handleUnlock} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl">Unlock the Road</button>
              </div>
              <div className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
                <Lock size={10} /><span>Protected for Chantal Hadassah</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
            {/* Sticky Mobile Header */}
            <header className="sticky top-0 z-50 md:hidden flex items-center justify-between p-6 bg-black/80 backdrop-blur-xl border-b border-white/5 text-white">
              <h1 className="text-xl font-black italic tracking-tighter uppercase">Selah Ride</h1>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-xl active:scale-90">{isSidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
            </header>

            {/* Navigation Aside */}
            <aside className={`fixed md:sticky top-0 h-screen z-40 w-72 md:w-80 p-8 flex flex-col gap-6 bg-black/95 md:bg-black/20 backdrop-blur-3xl transition-transform duration-500 ease-in-out border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
              <div className="hidden md:flex flex-col gap-1 mb-6"><h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Selah Ride</h1><div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-sky-400 rounded-full mt-1" /></div>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-8 pr-2">
                <MoodSelector currentMoodId={currentMood.id} onSelectMood={(mood) => { setCurrentMood(mood); setIsSidebarOpen(false); setActiveView('affirmation'); }} />
                <nav className="flex flex-col gap-1 pb-10">
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-2 ml-3">Navigation</p>
                  <button onClick={() => { setActiveView('affirmation'); setIsSidebarOpen(false); }} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === 'affirmation' ? 'bg-purple-600 text-white font-bold shadow-xl shadow-purple-900/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><MapPin size={16} /><span className="text-sm font-bold uppercase tracking-tight">The Path</span></button>
                  <button onClick={() => { setActiveView('chat'); setIsSidebarOpen(false); }} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === 'chat' ? 'bg-purple-600 text-white font-bold shadow-xl shadow-purple-900/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><Sparkles size={16} /><span className="text-sm font-bold uppercase tracking-tight text-emerald-400">Selig Chat</span></button>
                  <button onClick={() => { setActiveView('journal'); setIsSidebarOpen(false); }} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === 'journal' ? 'bg-purple-600 text-white font-bold shadow-xl shadow-purple-900/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><MessageSquare size={16} /><span className="text-sm font-bold uppercase tracking-tight">Road Log</span></button>
                  <button onClick={() => { setActiveView('trail'); setIsSidebarOpen(false); }} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === 'trail' ? 'bg-purple-600 text-white font-bold shadow-xl shadow-purple-900/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><MapPin size={16} /><span className="text-sm font-bold uppercase tracking-tight">The Trail</span></button>
                  <button onClick={() => { setActiveView('basket'); setIsSidebarOpen(false); }} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === 'basket' ? 'bg-purple-600 text-white font-bold shadow-xl shadow-purple-900/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><Book size={16} /><span className="text-sm font-bold uppercase tracking-tight">Gleaning</span></button>
                  <button onClick={() => { setActiveView('pitstop'); setIsSidebarOpen(false); }} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === 'pitstop' ? 'bg-purple-600 text-white font-bold shadow-xl shadow-purple-900/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}><Zap size={16} /><span className="text-sm font-bold uppercase tracking-tight text-sky-400">Pit Stop</span></button>
                </nav>
              </div>
              <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
                <button onClick={() => { setActiveView('garage'); setIsSidebarOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white transition-all"><Settings size={16} /><span className="text-xs font-black uppercase tracking-widest">Garage</span></button>
                <button onClick={() => setIsLocked(true)} className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 active:scale-95"><LogOut size={16} /><span className="text-xs font-black uppercase tracking-widest">Lock</span></button>
              </div>
            </aside>

            {/* Content Area - Naturally Scrolling */}
            <section className="flex-1 flex flex-col items-center p-6 md:p-12 relative min-h-screen bg-black/10">
              <AnimatePresence mode="wait">
                {rescueMode && <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-blue-500/20 border border-blue-500/30 p-6 rounded-3xl mb-8 flex items-center gap-6"><div className="p-4 bg-sky-500 rounded-2xl text-white"><Zap size={32} /></div><div><h4 className="text-lg font-black italic text-white uppercase tracking-tighter">Search & Rescue</h4><p className="text-sm text-blue-100/70 leading-relaxed font-medium">¡Hola! I went on a ride to find you. Selig is here now.</p></div><button onClick={() => setRescueMode(false)} className="ml-auto text-white/20 hover:text-white"><X /></button></motion.div>}
                {showDecree && <RoyalDecree message={decreeMessage} onClose={() => setShowDecree(false)} />}
                {activeView === 'affirmation' && (
                  <motion.div key="affirmation-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl flex flex-col gap-10">
                    <motion.div className="text-center md:text-left"><p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-4">Current Ride</p><h2 className="text-6xl md:text-7xl font-black text-white leading-none italic tracking-tighter drop-shadow-2xl">{currentMood.greeting}</h2></motion.div>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-sky-400 rounded-[3rem] blur opacity-20 transition duration-1000"></div>
                      <div className="relative flex items-center gap-6 bg-black/60 backdrop-blur-2xl rounded-[3rem] p-6 border border-white/10 shadow-2xl">
                        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl">
                          <img src="/hadassah-bike.png" alt="Hadassah" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-1 text-sky-400">Equipped Gear</p>
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">{currentMood.bike} Mode</h3>
                          <div className="flex items-center gap-2 text-white/40"><MapPin size={12} className="text-sky-400 text-purple-400" /><span className="text-[10px] font-bold uppercase tracking-widest">{currentMood.terrain} Terrain</span></div>
                        </div>
                      </div>
                    </div>
                    <AffirmationCard affirmation={INITIAL_AFFIRMATION} accentColor={currentMood.accentColor} voiceRate={settings.voiceRate} voicePitch={settings.voicePitch} />
                  </motion.div>
                )}
                {activeView === 'journal' && <motion.div key="journal-view" className="w-full"><Journal currentMoodId={currentMood.id} /></motion.div>}
                {activeView === 'chat' && <motion.div key="chat-view" className="w-full"><SeligChat /></motion.div>}
                {activeView === 'trail' && <motion.div key="trail-view" className="w-full max-w-4xl"><TrailMap stones={stones} currentBike={currentMood.bike} /></motion.div>}
                {activeView === 'basket' && <motion.div key="basket-view" className="w-full max-w-2xl"><GratitudeBasket /></motion.div>}
                {activeView === 'spanish' && <motion.div key="spanish-view" className="w-full"><SpanishSanctuary /></motion.div>}
                {activeView === 'midnight' && <motion.div key="midnight-view" className="w-full"><MidnightLamp /></motion.div>}
                {activeView === 'garage' && <motion.div key="garage-view" className="w-full"><Garage settings={settings} onUpdateSettings={(s) => setSettings(p => ({...p, ...s}))} /></motion.div>}
                {activeView === 'dev' && <motion.div key="dev-view" className="w-full"><DevModeHint /></motion.div>}
                {activeView === 'pitstop' && <motion.div key="pitstop-view" className="w-full"><PitStop /></motion.div>}
              </AnimatePresence>
              {/* Extra Padding for mobile bottom spacing */}
              <div className="h-32 md:hidden" />
            </section>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
