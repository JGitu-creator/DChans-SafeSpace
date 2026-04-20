'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Bike, MapPin, Zap, Settings, Book, MessageSquare, Menu, X as XIcon, LogOut, Code, Sparkles, Heart } from 'lucide-react';
import { ROUTES, RouteConfig, Affirmation, UserSettings, EbenezerStone, View } from '@/lib/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

import RouteSelector from '@/components/RouteSelector';
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
import LoginSequence from '@/components/LoginSequence';

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
  deepExegesis: "In the story of Ruth, she faced a crossroads. She chose the road to Bethlehem. Today, Hadassah, your loyalty to your true self and your Father is your greatest 'gear'.",
  bibleVerse: "Ruth 1:16"
};

export default function Home() {
  const [currentRoute, setCurrentRoute] = useState<RouteConfig>(ROUTES[1]); 
  const [isLocked, setIsLocked] = useState(true);
  const [isPINAccepted, setIsPINAccepted] = useState(false);
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
    if (passcode === '1122') setIsPINAccepted(true);
    else { alert('Wrong code, mi hermana.'); setPasscode(''); }
  };

  const finishLogin = () => {
    setIsLocked(false);
    setIsPINAccepted(false);
  };

  return (
    <main className="relative min-h-screen w-full font-sans text-zinc-900 bg-[#121212] overflow-x-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div key={isLocked ? `lock-${lockImageIndex}` : currentRoute.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
            <img src={isLocked ? LOCK_SCREEN_BIKES[lockImageIndex] : backgroundImages[currentRoute.terrain]} className="w-full h-full object-cover opacity-30 blur-[4px] grayscale" alt="Background" />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isPINAccepted && <LoginSequence onComplete={finishLogin} />}

        {isLocked ? (
          <motion.div key="lock-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="relative z-50 flex min-h-screen flex-col items-center justify-center p-8 text-white backdrop-blur-[1px]">
            <div className="absolute top-12 left-8 md:left-12"><AudioHug /></div>
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center gap-12 w-full max-w-sm text-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl">Selah Ride</h1>
                <p className="text-sky-400 text-[10px] font-black uppercase tracking-[0.6em] mt-2 text-sky-400">Chantal Hadassah</p>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-sky-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="PIN" className="relative w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-center text-4xl tracking-[1em] focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-md text-white placeholder:text-white/10" onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} />
                </div>
                <button onClick={handleUnlock} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl">Begin to Journal</button>
              </div>
              <div className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
                <Lock size={10} /><span>Personal & Protected</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="relative z-10 flex flex-col min-h-screen pt-4 pb-20 px-4 md:px-8">
            <CharmBracelet activeView={activeView} onViewChange={setActiveView} accentColor={currentRoute.accentColor} />

            <div className="flex-1 mt-8">
              <div className="notebook-container">
                <div className="spiral-binding">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="spiral-ring" />
                  ))}
                </div>

                <div className="notebook-page">
                  <AnimatePresence mode="wait">
                    {activeView === 'affirmation' && (
                      <motion.div key="affirmation-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-4xl filter drop-shadow-md">{currentRoute.sticker}</span>
                            <div>
                              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">{currentRoute.name}</p>
                              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 leading-tight italic tracking-tighter handwritten">{currentRoute.greeting}</h2>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative scrapbook-paper p-8 rounded-3xl shadow-xl border border-black/5 rotate-[-1deg]">
                          <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0 rotate-2">
                              <img src="/hadassah-bike.png" alt="Hadassah" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-2">My Gear</p>
                              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-800 leading-none mb-2">{currentRoute.bike} Ride</h3>
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{currentRoute.terrain} Path</span>
                            </div>
                          </div>
                        </div>

                        <AffirmationCard affirmation={INITIAL_AFFIRMATION} accentColor={currentRoute.accentColor} voiceRate={settings.voiceRate} voicePitch={settings.voicePitch} />
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
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
