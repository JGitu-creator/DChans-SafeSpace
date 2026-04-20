'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from "next-auth/react";
import { Lock, Bike, MapPin, Zap, Settings, Book, MessageSquare, Menu, X, LogOut, Code, Sparkles, Heart } from 'lucide-react';
import { ROUTES, RouteConfig, Affirmation, UserSettings, EbenezerStone, View } from '@/lib/types';
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
import BlessingsJar from '@/components/BlessingsJar';
import SpanishSanctuary from '@/components/SpanishSanctuary';
import MidnightLamp from '@/components/MidnightLamp';
import RoyalDecree from '@/components/RoyalDecree';
import AudioHug from '@/components/AudioHug';
import CharmBracelet from '@/components/CharmBracelet';

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
  const { data: session, status } = useSession();
  const [currentRoute, setCurrentRoute] = useState<RouteConfig>(ROUTES[1]); 
  const [isPINLocked, setIsPINLocked] = useState(true);
  const [passcode, setPasscode] = useState('');
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
    const interval = setInterval(() => setLockImageIndex((prev) => (prev + 1) % LOCK_SCREEN_BIKES.length), 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session) {
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
  }, [session]);

  const backgroundImages: Record<string, string> = {
    mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2560',
    valley: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2560',
    forest: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=2560', 
    desert: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=2560',
    galaxy: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2560',
  };

  const handleUnlock = () => {
    if (passcode === '1122') setIsPINLocked(false);
    else { alert('Wrong code, mi hermana.'); setPasscode(''); }
  };

  // 1. Google Lock Gate
  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center"><Zap className="text-purple-500 animate-spin" size={48} /></div>;

  if (!session) {
    return (
      <main className="relative min-h-screen w-full font-sans text-zinc-900 bg-black flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 z-0">
          <img src={LOCK_SCREEN_BIKES[lockImageIndex]} className="w-full h-full object-cover opacity-60 transition-opacity duration-1000" alt="Background" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-sm p-12 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 text-center shadow-2xl">
          <div className="mb-10 flex flex-col gap-4">
            <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">Selah<br/>Ride</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Personal Sanctuary</p>
          </div>
          <p className="text-white/60 text-sm mb-10 leading-relaxed">¡Hola! This road is reserved for Chantal Hadassah.<br/>Please sign in to continue.</p>
          <button onClick={() => signIn("google")} className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all shadow-xl active:scale-95">
            <img src="https://authjs.dev/img/providers/google.svg" className="w-6 h-6" alt="Google" />
            <span className="uppercase tracking-widest text-xs">Sign In with Google</span>
          </button>
        </motion.div>
      </main>
    );
  }

  // 2. PIN Lock Gate
  if (isPINLocked) {
    return (
      <main className="relative min-h-screen w-full font-sans text-zinc-900 bg-black flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 z-0">
          <img src={LOCK_SCREEN_BIKES[lockImageIndex]} className="w-full h-full object-cover opacity-70" alt="Background" />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
        </div>
        <div className="absolute top-12 left-8 md:left-12"><AudioHug /></div>
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="relative z-10 flex flex-col items-center gap-12 w-full max-w-sm text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl leading-none">Selah<br/>Ride</h1>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] leading-none mt-4 text-sky-400">Welcome, {session.user?.name?.split(' ')[0]}</p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-sky-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="PIN" className="relative w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-center text-4xl tracking-[1em] focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-2xl text-white placeholder:text-white/10 placeholder:tracking-widest" onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} />
            </div>
            <button onClick={handleUnlock} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl">Start the Ride</button>
          </div>
          <button onClick={() => signOut()} className="text-white/20 text-[8px] font-black uppercase tracking-widest hover:text-red-400 transition-colors italic">Not you? Switch Account</button>
        </motion.div>
      </main>
    );
  }

  // 3. Main Dashboard
  return (
    <main className="relative min-h-screen w-full font-sans text-zinc-900 bg-black overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div key={currentRoute.terrain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
            <img src={backgroundImages[currentRoute.terrain]} className="w-full h-full object-cover opacity-60" alt="Background" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(circle at 20% 20%, ${currentRoute.accentColor}33 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${currentRoute.secondaryColor}33 0%, transparent 50%)` }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <CharmBracelet activeView={activeView} onViewChange={setActiveView} accentColor={currentRoute.accentColor} />
        <div className="flex flex-col md:flex-row flex-1">
          <aside className="hidden lg:flex w-80 p-8 flex-col gap-8 bg-black/20 backdrop-blur-3xl border-r border-white/5 overflow-y-auto no-scrollbar h-[calc(100vh-100px)] sticky top-[100px]">
            <MoodSelector currentMoodId={currentRoute.id} onSelectMood={setCurrentRoute} />
            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
              <button onClick={() => { setActiveView('dev'); }} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white transition-all"><Code size={16} /><span className="text-[10px] font-black uppercase tracking-widest text-sky-400">The Engine</span></button>
              <button onClick={() => setIsPINLocked(true)} className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 active:scale-95 shadow-xl"><LogOut size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Lock Sanctuary</span></button>
            </div>
          </aside>

          <section className="flex-1 flex flex-col items-center p-6 md:p-12 relative min-h-screen">
            <AnimatePresence mode="wait">
              {rescueMode && <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-blue-500/20 border border-blue-500/30 p-6 rounded-3xl mb-8 flex items-center gap-6"><div className="p-4 bg-sky-500 rounded-2xl text-white"><Zap size={32} /></div><div><h4 className="text-lg font-black italic text-white uppercase tracking-tighter">Search & Rescue</h4><p className="text-sm text-blue-100/70 leading-relaxed font-medium">¡Hola! I went on a ride to find you. Selig is here now.</p></div><button onClick={() => setRescueMode(false)} className="ml-auto text-white/20 hover:text-white"><X /></button></motion.div>}
              {showDecree && <RoyalDecree message={decreeMessage} onClose={() => setShowDecree(false)} />}
              {activeView === 'affirmation' && (
                <motion.div key="affirmation-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl flex flex-col gap-10">
                  <div className="flex flex-col gap-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4"><span className="text-4xl">{currentRoute.sticker}</span><p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">{currentRoute.name}</p></div>
                    <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.8] italic tracking-tighter drop-shadow-2xl">{currentRoute.greeting}</h2>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-sky-400 rounded-[3rem] blur opacity-30 transition duration-1000"></div>
                    <div className="relative flex items-center gap-6 bg-black/60 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/10 shadow-2xl overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 translate-x-16 -translate-y-16" />
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl flex-shrink-0">
                        <img src="/hadassah-bike.png" alt="Hadassah" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400 mb-2 font-black">Equipped for the journey</p>
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none mb-3">{currentRoute.bike} Ride</h3>
                        <div className="flex items-center gap-2 text-white/40"><MapPin size={12} className="text-purple-400" /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">{currentRoute.terrain} Route Active</span></div>
                      </div>
                    </div>
                  </div>
                  <AffirmationCard affirmation={INITIAL_AFFIRMATION} accentColor={currentRoute.accentColor} voiceRate={settings.voiceRate} voicePitch={settings.voicePitch} />
                  <div className="lg:hidden mt-10 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 text-center italic">Change the Route</h3>
                    <MoodSelector currentMoodId={currentRoute.id} onSelectMood={setCurrentRoute} />
                  </div>
                </motion.div>
              )}
              {activeView === 'journal' && <motion.div key="journal-view" className="w-full"><Journal currentMoodId={currentRoute.id} settings={settings} /></motion.div>}
              {activeView === 'chat' && <motion.div key="chat-view" className="w-full h-full min-h-[70vh]"><SeligChat /></motion.div>}
              {activeView === 'trail' && <motion.div key="trail-view" className="w-full max-w-4xl"><TrailMap stones={stones} currentBike={currentRoute.bike} /></motion.div>}
              {activeView === 'basket' && <motion.div key="basket-view" className="w-full max-w-2xl"><BlessingsJar /></motion.div>}
              {activeView === 'spanish' && <motion.div key="spanish-view" className="w-full"><SpanishSanctuary /></motion.div>}
              {activeView === 'midnight' && <motion.div key="midnight-view" className="w-full"><MidnightLamp /></motion.div>}
              {activeView === 'garage' && <motion.div key="garage-view" className="w-full"><Garage settings={settings} onUpdateSettings={(s) => setSettings(p => ({...p, ...s}))} /></motion.div>}
              {activeView === 'dev' && <motion.div key="dev-view" className="w-full"><DevModeHint /></motion.div>}
              {activeView === 'pitstop' && <motion.div key="pitstop-view" className="w-full"><PitStop /></motion.div>}
            </AnimatePresence>
            <div className="h-32" />
          </section>
        </div>
      </div>
    </main>
  );
}

function X() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
}
