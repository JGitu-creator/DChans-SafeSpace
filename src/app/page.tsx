'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Bike, MapPin, Zap, Settings, Book, MessageSquare, Menu, X, LogOut, Code, Sparkles } from 'lucide-react';
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
  'https://images.unsplash.com/photo-1558981403-c5f9199a28ad?auto=format&fit=crop&q=80&w=2070', // Harley
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=2070', // Sport
  'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=2070', // Cafe
  'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&q=80&w=2070', // Adventure
  'https://images.unsplash.com/photo-1449491023939-02c9ab99407d?auto=format&fit=crop&q=80&w=2070', // Futuristic concept
];

const INITIAL_AFFIRMATION: Affirmation = {
  proverbHook: "A journey of a thousand miles begins with a single turn of the key.",
  growthWord: {
    word: "Resilience",
    definition: "The capacity to recover quickly from difficulties; toughness. Like a well-tuned engine climbing a mountain road, you are built to endure and ascend."
  },
  spanishPhrase: {
    phrase: "Eres amada y elegida.",
    translation: "You are loved and chosen."
  },
  deepExegesis: "In the story of Ruth, she faced a crossroads. She could have stayed in the familiar, but she chose the road to Bethlehem. Like a loyal 'Group Rider', she didn't leave her sister Naomi. Her loyalty wasn't just to a person, but to the God of Israel. Today, Hadassah, your loyalty to your true self and your Father is your greatest 'gear'.",
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
      const interval = setInterval(() => {
        setLockImageIndex((prev) => (prev + 1) % LOCK_SCREEN_BIKES.length);
      }, 5000);
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
    <main className="relative min-h-screen w-full overflow-hidden font-sans text-zinc-900 bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLocked ? `lock-${lockImageIndex}` : currentMood.terrain}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${isLocked ? LOCK_SCREEN_BIKES[lockImageIndex] : backgroundImages[currentMood.terrain]})` }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLocked ? (
          <motion.div key="lock-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="relative z-50 flex min-h-screen flex-col items-center justify-center p-6 text-white backdrop-blur-3xl">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center gap-8 w-full max-w-sm text-center">
              <div className="p-6 bg-white/10 rounded-full border border-white/20 shadow-2xl"><Lock size={48} className="text-white" /></div>
              <div><h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Selah Ride</h1><p className="text-white/60 font-medium">Unlock your journey, Hadassah.</p></div>
              <div className="w-full flex flex-col gap-6">
                <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center text-2xl tracking-[1em] focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} />
                <button onClick={handleUnlock} className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl">Start Riding</button>
                <div className="pt-4"><AudioHug /></div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="relative z-10 flex flex-col md:flex-row min-h-screen h-full">
            <header className="md:hidden flex items-center justify-between p-6 bg-black/20 backdrop-blur-md border-b border-white/10 text-white"><h1 className="text-xl font-black italic tracking-tighter uppercase">Selah Ride</h1><button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? <X size={24} /> : <Menu size={24} />}</button></header>
            <aside className={`fixed md:relative inset-y-0 left-0 z-40 w-72 md:w-80 p-8 flex flex-col gap-6 bg-black/80 md:bg-black/20 backdrop-blur-2xl transition-transform duration-300 ease-in-out border-r border-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
              <div className="hidden md:flex flex-col gap-1 mb-4"><h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Selah Ride</h1><p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-none">The Highway of Holiness</p></div>
              <MoodSelector currentMoodId={currentMood.id} onSelectMood={(mood) => { setCurrentMood(mood); setIsSidebarOpen(false); setActiveView('affirmation'); }} />
              <nav className="mt-4 flex flex-col gap-1.5 overflow-y-auto">
                <button onClick={() => { setActiveView('affirmation'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'affirmation' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><MapPin size={18} /><span>The Path</span></button>
                <button onClick={() => { setActiveView('chat'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'chat' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><Sparkles size={18} className={activeView === 'chat' ? '' : 'text-emerald-400'} /><span>Talk with Selig</span></button>
                <button onClick={() => { setActiveView('journal'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'journal' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><MessageSquare size={18} /><span>Road Log</span></button>
                <button onClick={() => { setActiveView('trail'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'trail' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><MapPin size={18} /><span>The Trail</span></button>
                <button onClick={() => { setActiveView('basket'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'basket' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><Book size={18} /><span>Boaz's Field</span></button>
                <button onClick={() => { setActiveView('spanish'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'spanish' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><Sparkles size={18} className="text-emerald-400" /><span>Sanctuary</span></button>
                <button onClick={() => { setActiveView('pitstop'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'pitstop' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><Zap size={18} /><span>Pit Stop</span></button>
                <button onClick={() => { setActiveView('midnight'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'midnight' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><Zap size={18} className="text-blue-400" /><span>Midnight Lamp</span></button>
                <button onClick={() => { setActiveView('garage'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'garage' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><Settings size={18} /><span>The Garage</span></button>
                <button onClick={() => { setActiveView('dev'); setIsSidebarOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === 'dev' ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}><Code size={18} /><span>The Engine</span></button>
                <div className="h-px bg-white/10 my-2" />
                <button onClick={() => setIsLocked(true)} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"><LogOut size={18} /><span>Lock App</span></button>
              </nav>
            </aside>

            <section className="flex-1 flex flex-col items-center justify-start md:justify-center p-6 md:p-12 overflow-y-auto">
              <AnimatePresence mode="wait">
                {rescueMode && <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-blue-500/20 border border-blue-500/30 p-6 rounded-3xl mb-8 flex items-center gap-6"><div className="p-4 bg-blue-500 rounded-2xl text-white"><Zap size={32} /></div><div><h4 className="text-lg font-black italic text-white uppercase tracking-tighter">Search & Rescue</h4><p className="text-sm text-blue-100/70 leading-relaxed">¡Hola! I went on a ride to find you. Selig is here now.</p></div><button onClick={() => setRescueMode(false)} className="ml-auto text-white/40 hover:text-white"><X /></button></motion.div>}
                {showDecree && <RoyalDecree message={decreeMessage} onClose={() => setShowDecree(false)} />}
                {activeView === 'affirmation' && <motion.div key="affirmation-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl"><motion.div className="mb-12"><p className="text-white/60 text-sm font-bold uppercase tracking-[0.3em] mb-2">Greeting</p><h2 className="text-5xl md:text-6xl font-black text-white leading-tight italic tracking-tighter">{currentMood.greeting}</h2></motion.div><motion.div key={currentMood.bike} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 text-white"><div className="relative w-20 h-20 bg-white/20 rounded-2xl overflow-hidden border border-white/30"><img src="/hadassah-bike.png" alt="Hadassah" className="w-full h-full object-cover" /></div><div><p className="text-xs font-bold uppercase tracking-widest text-white/60">Current Gear</p><p className="text-xl font-black uppercase italic tracking-tight leading-tight">{currentMood.bike} Ride</p></div><div className="ml-auto flex items-center gap-2 text-xs font-bold bg-white text-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-xl"><Zap size={14} /><span>Selah Speed</span></div></motion.div><AffirmationCard affirmation={INITIAL_AFFIRMATION} accentColor={currentMood.accentColor} voiceRate={settings.voiceRate} voicePitch={settings.voicePitch} /></motion.div>}
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
            </section>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
