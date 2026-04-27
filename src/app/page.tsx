'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Bike, MapPin, Zap, Settings, Book, MessageSquare, Menu, X as XIcon, LogOut, Code, Sparkles, Heart, RefreshCw, Crown } from 'lucide-react';
import { ROUTES, RouteConfig, Affirmation, UserSettings, EbenezerStone, View, LOGIN_DECLARATIONS } from '@/lib/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useSupabase } from '@/components/SupabaseProvider';

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
import RoyalAffirmation from '@/components/RoyalAffirmation';
import AudioHug from '@/components/AudioHug';
import CharmBracelet from '@/components/CharmBracelet';
import LoginSequence from '@/components/LoginSequence';
import BiblicalGames from '@/components/BiblicalGames';
import GoldenThread from '@/components/GoldenThread';

const LOCK_SCREEN_BIKES = [
  'https://images.unsplash.com/photo-1558981806-ec527fa84c09?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1558981403-c5f9199a28ad?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&q=80&w=2070',
];

const getDailyAffirmation = (routeId: string): Affirmation => {
  const day = new Date().getDay();
  const affirmations: Record<number, Affirmation> = {
    0: {
      proverbHook: "A quiet heart is a royal sanctuary.",
      growthWord: { word: "Serenity", definition: "The state of being calm, peaceful, and untroubled." },
      spanishPhrase: { phrase: "Dios es mi refugio.", translation: "God is my refuge." },
      deepExegesis: "Like a calm lake reflecting the mountain, let your soul reflect the King's peace today.",
      bibleVerse: "Psalm 46:10"
    },
    1: {
      proverbHook: "A journey of a thousand miles begins with a single turn of the key.",
      growthWord: { word: "Resilience", definition: "The capacity to recover quickly from difficulties; toughness." },
      spanishPhrase: { phrase: "Eres amada y elegida.", translation: "You are loved and chosen." },
      deepExegesis: "In the story of Ruth, she faced a crossroads. She chose the road to Bethlehem. Today, Hadassah, your loyalty to your true self and your Father is your greatest 'gear'.",
      bibleVerse: "Ruth 1:16"
    },
    2: {
      proverbHook: "The hardest roads often lead to the most beautiful vistas.",
      growthWord: { word: "Persistence", definition: "Firm or obstinate continuance in a course of action in spite of difficulty." },
      spanishPhrase: { phrase: "Sigue adelante con fe.", translation: "Go forward with faith." },
      deepExegesis: "The road may be steep, but your gear is divine. Every climb is a lesson in His strength.",
      bibleVerse: "Isaiah 40:31"
    },
    3: {
      proverbHook: "True beauty is found in the brushstrokes of grace.",
      growthWord: { word: "Elegance", definition: "The quality of being graceful and stylish in appearance or manner." },
      spanishPhrase: { phrase: "Gracia sobre gracia.", translation: "Grace upon grace." },
      deepExegesis: "You are the King's masterpiece. Every detail of your life is being painted with intentional love.",
      bibleVerse: "Ephesians 2:10"
    },
    4: {
      proverbHook: "Strength isn't just about speed; it's about staying the course.",
      growthWord: { word: "Fortitude", definition: "Courage in pain or adversity." },
      spanishPhrase: { phrase: "Fuerte y valiente.", translation: "Strong and courageous." },
      deepExegesis: "Like Esther entering the court, your courage is your crown. Ride with the authority given to you.",
      bibleVerse: "Joshua 1:9"
    },
    5: {
      proverbHook: "Rest is not idleness; it is the rhythm of the soul.",
      growthWord: { word: "Restoration", definition: "The action of returning something to a former owner, place, or condition." },
      spanishPhrase: { phrase: "Descansa en su amor.", translation: "Rest in His love." },
      deepExegesis: "The King invites you to a banquet of rest. Lay down the heavy gear and just be His daughter.",
      bibleVerse: "Matthew 11:28"
    },
    6: {
      proverbHook: "Light always finds a way through the thickest forest.",
      growthWord: { word: "Luminosity", definition: "Luminous quality." },
      spanishPhrase: { phrase: "Luz en mi camino.", translation: "Light on my path." },
      deepExegesis: "Your light shines brightest in the dark valleys. Do not fear the shadows; the Sun of Righteousness is rising.",
      bibleVerse: "Psalm 119:105"
    }
  };
  return affirmations[day] || affirmations[1];
};

const NATURE_PAINTINGS: Record<string, string> = {
  mountain: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
  valley: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
  desert: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=600',
  galaxy: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=600',
};

export default function Home() {
  const { signIn, isSyncing, isSynced } = useSupabase();
  const [isLocked, setIsLocked] = useState(true);
  const [isPINAccepted, setIsPINAccepted] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeView, setActiveView] = useState<View>('affirmation');
  const [lockImageIndex, setLockImageIndex] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmationMessage, setAffirmationMessage] = useState('');
  const [affirmationRef, setAffirmationRef] = useState('');
  const [struggleInput, setStruggleInput] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    bibleVersion: 'ESV',
    voiceRate: 0.9,
    voicePitch: 1.1,
    preferredBike: 'adventure',
  });

  const currentRoute = useMemo(() => {
    return ROUTES.find(r => r.bike === settings.preferredBike) || ROUTES[1];
  }, [settings.preferredBike]);

  const stones = useLiveQuery(() => db.ebenezerStones.toArray()) || [];
  const journalEntries = useLiveQuery(() => db.journalEntries.toArray()) || [];
  const gratitudeGrains = useLiveQuery(() => db.gratitudeGrains.toArray()) || [];
  const dailyAffirmation = getDailyAffirmation(currentRoute.id);
  const [rescueMode, setRescueMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setLockImageIndex((prev) => (prev + 1) % LOCK_SCREEN_BIKES.length), 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLocked) {
      const now = new Date();
      setSettings(prev => {
        const last = prev.lastOpened ? new Date(prev.lastOpened) : now;
        const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
        
        // We handle side effects like rescueMode outside or via a check
        if (hoursSince > 48 && !rescueMode) {
          // Note: This is still technically a setState in effect, 
          // but by checking !rescueMode we prevent any potential loops.
          setRescueMode(true);
        }

        return { ...prev, lastOpened: now };
      });
    }
  }, [isLocked, rescueMode]);

  const backgroundImages: Record<string, string> = {
    mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2560',
    valley: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2560',
    forest: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=2560', 
    desert: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=2560',
    galaxy: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2560',
  };

  const handleUnlock = async () => {
    const success = await signIn(passcode);
    if (success) setIsPINAccepted(true);
    else { alert('Wrong code, mi hermana.'); setPasscode(''); }
  };

  const transformStruggle = async () => {
    if (!struggleInput.trim()) return;
    setIsTransforming(true);
    try {
      const response = await fetch('/api/selig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          struggle: struggleInput,
          settings 
        })
      });
      const data = await response.json();
      setAffirmationMessage(data.deepExegesis || "The King is with you in this valley, Hadassah.");
      setAffirmationRef(data.bibleVerse || "");
      setShowAffirmation(true);
      setStruggleInput('');
    } catch (e) {
      alert("Selig is praying for you. Try again in a moment.");
    } finally {
      setIsTransforming(false);
    }
  };

  const finishLogin = () => {
    setIsLocked(false);
    setIsPINAccepted(false);
    // Pick a random Biblical verse from the declarations list
    const randomVerse = LOGIN_DECLARATIONS[Math.floor(Math.random() * LOGIN_DECLARATIONS.length)];
    setAffirmationMessage(randomVerse.text);
    setAffirmationRef(randomVerse.reference);
    setShowAffirmation(true);
  };

  return (
    <main className="relative min-h-screen w-full font-sans text-zinc-900 bg-[#121212] overflow-x-hidden selection:bg-purple-500/30">
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div key={isLocked ? `lock-${lockImageIndex}` : currentRoute.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
            <img src={isLocked ? LOCK_SCREEN_BIKES[lockImageIndex] : backgroundImages[currentRoute.terrain]} className="w-full h-full object-cover opacity-60 grayscale-[0.2]" alt="Background" />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isPINAccepted && <LoginSequence onComplete={finishLogin} />}
        {showAffirmation && <RoyalAffirmation message={affirmationMessage} reference={affirmationRef} onClose={() => setShowAffirmation(false)} />}

        {isLocked ? (
          <motion.div key="lock-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="relative z-50 flex min-h-screen flex-col items-center justify-center p-6 text-white overflow-hidden">
            <div className="absolute top-12 left-8 md:left-12"><AudioHug /></div>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-6 w-full max-w-2xl text-center relative z-10 -mt-10">
              <div className="flex flex-col gap-0">
                <div className="flex flex-col items-center gap-0">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-amber-400 mb-1">
                    <Crown size={42} strokeWidth={1.5} className="drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                  </motion.div>
                  <h1 className="flex flex-col items-center gap-0">
                    <span className="text-5xl md:text-7xl font-garamond font-bold italic tracking-tighter uppercase text-white drop-shadow-2xl leading-none">DChan</span>
                    <span className="text-6xl md:text-[8rem] font-normal text-transparent bg-clip-text bg-gradient-to-b from-purple-400 via-purple-600 to-purple-900 font-great-vibes px-10 py-4 block drop-shadow-[0_0_20px_rgba(147,51,234,0.3)]">SafeSpace</span>
                  </h1>
                </div>
                <p className="text-[10px] font-medium tracking-[0.8em] text-white/30 uppercase -mt-4 font-playfair italic">Chantal Hadassah</p>
              </div>

              <div className="w-full flex flex-col gap-6 max-w-sm mt-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-sky-400 to-amber-400 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
                  <input 
                    type="password" 
                    value={passcode} 
                    onChange={(e) => setPasscode(e.target.value)} 
                    placeholder="ENTER PIN" 
                    className="relative w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-center text-3xl tracking-[0.8em] focus:outline-none focus:border-white/30 backdrop-blur-md text-white placeholder:text-white/10 placeholder:tracking-widest placeholder:text-[9px] transition-all font-light" 
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()} 
                  />
                </div>
                
                <button 
                  onClick={handleUnlock} 
                  className="group relative py-5 overflow-hidden transition-all active:scale-95"
                >
                  <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/40 transition-colors" />
                  <div className="absolute inset-1 border border-white/10 rounded-full" />
                  
                  <div className="relative flex items-center justify-center gap-4">
                    <div className="w-6 h-px bg-white/20 group-hover:w-10 transition-all" />
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white group-hover:text-amber-400 transition-colors">Enter Sanctuary</span>
                    <div className="w-6 h-px bg-white/20 group-hover:w-10 transition-all" />
                  </div>
                </button>
              </div>
              
              <div className="flex flex-col items-center gap-4 mt-2">
                 <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                 <div className="flex items-center gap-2 text-white/20">
                   <Lock size={8} strokeWidth={3} />
                   <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">For Her Heart Alone</p>
                 </div>
              </div>
            </motion.div>

            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none opacity-20">
               <div className="absolute inset-0 bg-radial-gradient from-purple-900/20 via-transparent to-transparent blur-3xl animate-pulse" />
            </div>
          </motion.div>
        ) : (
          <div className="relative z-10 flex flex-col min-h-screen pt-4 pb-20 px-0 md:px-8">
            <div className="flex justify-between items-center px-6 md:px-4 mb-4">
               <div className="flex items-center gap-3">
                 {isSyncing ? (
                    <div className="flex items-center gap-2 text-sky-400 bg-sky-400/10 px-3 py-1.5 rounded-full border border-sky-400/20">
                      <RefreshCw size={10} className="animate-spin" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Syncing Cloud</span>
                    </div>
                 ) : isSynced ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Cloud Secured</span>
                    </div>
                 ) : null}
               </div>
               
               <button 
                onClick={() => setIsLocked(true)} 
                className="group flex items-center gap-2 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl border border-white/5 hover:border-red-500/20 transition-all text-white/40 hover:text-red-400"
               >
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Lock & Logout</span>
                  <LogOut size={16} />
               </button>
            </div>
            <CharmBracelet activeView={activeView} onViewChange={setActiveView} accentColor={currentRoute.accentColor} />

            <div className="flex-1 mt-4 md:mt-8 pb-12 px-2 md:px-0">
              <div className="canvas-container canvas-texture">
                <div className="canvas-surface" style={{ '--canvas-bg': `${currentRoute.accentColor}10` } as React.CSSProperties}>
                  {/* Nature Painting Accent */}
                  <div className="nature-accent top-4 right-4 w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden border-2 border-[#2c1a10] shadow-md rotate-3">
                    <img src={NATURE_PAINTINGS[currentRoute.terrain]} alt="Nature Painting" className="w-full h-full object-cover" />
                  </div>

                  <AnimatePresence mode="wait">
                    {activeView === 'affirmation' && (
                      <motion.div key="affirmation-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-10">
                        {/* Proactive Greeting */}
                        <div className="flex items-center gap-4">
                          <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-purple-500 to-sky-400 rounded-full blur opacity-20"></div>
                            <span className="relative text-5xl filter drop-shadow-md cursor-help transition-transform hover:scale-110 block">
                              {currentRoute.sticker}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl rounded-tl-none border border-black/5 shadow-sm relative">
                              <p className="text-zinc-800 text-sm font-medium italic">
                                {(() => {
                                  const hour = new Date().getHours();
                                  if (hour < 11) return "The road is fresh, Hadassah. Your gear is ready.";
                                  if (hour < 17) return "Take a pit stop, mi hermana. His grace is sufficient.";
                                  if (hour < 21) return "Ride towards the sunset of His mercy.";
                                  return "Park the bike in His peace. You are well-guarded.";
                                })()}
                              </p>
                            </div>
                            <p className="text-zinc-400 text-[8px] font-black uppercase tracking-[0.4em] mt-1 ml-1">Selig&apos;s Whisper</p>
                          </div>
                        </div>

                        {/* Growth Stats Row */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                          <div className="flex-1 min-w-[140px] bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-black/5 shadow-sm">
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Ebenezer Stones</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black italic text-zinc-800">{stones.length}</span>
                              <div className="h-1 flex-1 bg-zinc-200 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(stones.length * 10, 100)}%` }}
                                  className="h-full bg-purple-500"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-[140px] bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-black/5 shadow-sm">
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Gratitude Grains</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black italic text-zinc-800">{gratitudeGrains.length}</span>
                              <div className="h-1 flex-1 bg-zinc-200 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(gratitudeGrains.length * 5, 100)}%` }}
                                  className="h-full bg-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-[140px] bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-black/5 shadow-sm">
                            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Journal Streak</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black italic text-zinc-800">{journalEntries.length > 0 ? Math.min(journalEntries.length, 7) : '0'}</span>
                              <Sparkles size={14} className="text-amber-500" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">{currentRoute.name}</p>
                              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 leading-tight italic tracking-tighter handwritten">{currentRoute.greeting}</h2>
                            </div>
                          </div>
                        </div>
                        
                        {/* Struggle Transformer */}
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-sky-400/20 rounded-2xl blur opacity-30"></div>
                          <div className="relative bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-black/5 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4 flex items-center gap-2">
                              <Zap size={10} /> Struggle Transformer
                            </p>
                            <div className="flex gap-3">
                              <input 
                                value={struggleInput}
                                onChange={(e) => setStruggleInput(e.target.value)}
                                placeholder="What's heavy on the road today?"
                                className="flex-1 bg-white/60 border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 italic font-medium"
                                onKeyDown={(e) => e.key === 'Enter' && transformStruggle()}
                              />
                              <button 
                                onClick={transformStruggle}
                                disabled={isTransforming || !struggleInput.trim()}
                                className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                              >
                                {isTransforming ? <RefreshCw size={14} className="animate-spin" /> : 'Transform'}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="relative p-8 rounded-xl shadow-inner border border-black/5 bg-white/40 backdrop-blur-sm">
                          <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-[#2c1a10] shadow-lg flex-shrink-0 -rotate-2">
                              <img src={currentRoute.image} alt="Route View" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-2">Current Route</p>
                              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-800 leading-none mb-1">{currentRoute.name}</h3>
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{currentRoute.terrain} Path</span>
                            </div>
                          </div>
                        </div>

                        <AffirmationCard affirmation={dailyAffirmation} accentColor={currentRoute.accentColor} voiceRate={settings.voiceRate} voicePitch={settings.voicePitch} />
                      </motion.div>
                    )}

                    {activeView === 'journal' && <motion.div key="journal-view" className="w-full"><Journal currentMoodId={currentRoute.id} settings={settings} /></motion.div>}
                    {activeView === 'chat' && <motion.div key="chat-view" className="w-full h-full min-h-[70vh]"><SeligChat /></motion.div>}
                    {activeView === 'trail' && <motion.div key="trail-view" className="w-full max-w-4xl"><TrailMap stones={stones} currentBike={currentRoute.bike} /></motion.div>}
                    {activeView === 'basket' && <motion.div key="basket-view" className="w-full max-w-2xl"><BlessingsJar /></motion.div>}
                    {activeView === 'spanish' && <motion.div key="spanish-view" className="w-full"><SpanishSanctuary /></motion.div>}
                    {activeView === 'midnight' && <motion.div key="midnight-view" className="w-full"><MidnightLamp /></motion.div>}
                    {activeView === 'games' && <motion.div key="games-view" className="w-full"><BiblicalGames /></motion.div>}
                    {activeView === 'thread' && <motion.div key="thread-view" className="w-full"><GoldenThread entries={journalEntries} /></motion.div>}
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
