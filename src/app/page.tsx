"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MapPin, 
  Calendar as CalendarIcon, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  LockOpen,
  Volume2,
  VolumeX,
  Music,
  Flower2
} from "lucide-react";

export default function WeddingInvite() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"invite" | "album" | "giving" | "rsvp">("invite");
  const [guestName, setGuestName] = useState("");
  const [copiedMpesa, setCopiedMpesa] = useState(false);
  
  // Audio State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // RSVP Form States
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasAlreadyRsvp, setHasAlreadyRsvp] = useState(false);

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Petal Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const photoAlbum = [
    { 
      src: "/C&J.jpeg", 
      caption: "Chan & Jim — Clothed in Faith", 
      sub: "GracePoint Church, Kikuyu • October 30, 2026" 
    },
    { 
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", 
      caption: "Walking in God's Grace", 
      sub: "Our shared path of prayer & commitment" 
    },
    { 
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80", 
      caption: "Joy & Fellowship", 
      sub: "Surrounded by family and dear friends" 
    }
  ];

  // 1. Check Previous RSVP & Read URL Token (?guest=Name)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRsvp = localStorage.getItem("cj_wedding_rsvp_submitted");
      if (savedRsvp) setHasAlreadyRsvp(true);

      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get("guest") || params.get("name");
      if (nameParam) {
        setGuestName(decodeURIComponent(nameParam));
      }
    }
  }, []);

  // 2. Countdown to October 30, 2026
  useEffect(() => {
    const targetDate = new Date("2026-10-30T10:00:00+03:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Slideshow Auto-advance
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photoAlbum.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, photoAlbum.length]);

  // 4. Music Playback Handler
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.35;
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  };

  // 5. Heart Petal Shower Burst
  const triggerPetalBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#e11d48", "#f43f5e", "#fda4af", "#be185d", "#fbbf24"];
    const hearts: { x: number; y: number; size: number; color: string; speedX: number; speedY: number; rotation: number; rotSpeed: number }[] = [];

    for (let i = 0; i < 60; i++) {
      hearts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        size: Math.random() * 15 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 16,
        speedY: (Math.random() - 0.5) * 18 - 8,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
      });
    }

    let count = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach((h) => {
        h.x += h.speedX;
        h.y += h.speedY;
        h.speedY += 0.25;
        h.rotation += h.rotSpeed;

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate((h.rotation * Math.PI) / 180);
        ctx.fillStyle = h.color;
        
        // Draw Heart
        ctx.beginPath();
        ctx.moveTo(0, h.size / 4);
        ctx.bezierCurveTo(0, 0, -h.size / 2, 0, -h.size / 2, h.size / 2);
        ctx.bezierCurveTo(-h.size / 2, h.size, 0, h.size * 1.5, 0, h.size * 2);
        ctx.bezierCurveTo(0, h.size * 1.5, h.size / 2, h.size, h.size / 2, h.size / 2);
        ctx.bezierCurveTo(h.size / 2, 0, 0, 0, 0, h.size / 4);
        ctx.fill();
        ctx.restore();
      });

      count++;
      if (count < 150) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  };

  const handleUnlock = () => {
    startMusic();
    triggerPetalBurst();
    setUnlocked(true);
  };

  const handleCopyMpesa = () => {
    navigator.clipboard.writeText("0704656076");
    setCopiedMpesa(true);
    setTimeout(() => setCopiedMpesa(false), 3000);
  };

  const handleDownloadIcs = () => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Chan and Jim Wedding//EN",
      "BEGIN:VEVENT",
      "UID:chan-jim-wedding-2026",
      "DTSTAMP:20260904T000000Z",
      "DTSTART:20261030T070000Z",
      "DTEND:20261030T150000Z",
      "SUMMARY:Wedding of Chan & Jim",
      "DESCRIPTION:Celebrating the holy matrimony of Chantal and Jim. Clothed in Faith.",
      "LOCATION:GracePoint Church, Kikuyu, Kenya",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Chan_and_Jim_Wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust RSVP JSON submission
  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(false);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      attendance: String(formData.get("attendance")),
      guestCount: String(formData.get("guestCount")),
      message: String(formData.get("message")),
      timestamp: new Date().toISOString()
    };

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyFIssp-Gfi7efBQOW0wbjMjy1AeE9lchHihGoJ_Xfo_KyChNjF4mOx3jKhP6cisGjm/exec";

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      localStorage.setItem("cj_wedding_rsvp_submitted", "true");
      setSubmitted(true);
      setHasAlreadyRsvp(true);
      triggerPetalBurst();
    } catch (err) {
      console.error("RSVP transmission failure:", err);
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-slate-900 font-sans flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      <audio ref={audioRef} loop preload="auto" src="/wedding-music.mp3" />

      {/* Music Control */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="bg-white/80 backdrop-blur border border-amber-200 shadow-lg p-2 rounded-full text-purple-900 hover:bg-amber-50 transition"
        >
          {isPlayingMusic ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {/* Main Luxury 9:16 Invitation Card */}
      <main className="w-full max-w-lg bg-[#fffdfa] rounded-[2.5rem] border border-amber-200 shadow-[0_10px_30px_rgba(90,60,30,0.1)] overflow-hidden relative min-h-[780px] flex flex-col justify-between z-10">

        {/* GATED UNLOCK */}
        <AnimatePresence>
          {!unlocked && (
            <motion.div 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#121926] flex flex-col items-center justify-center p-6 text-center"
            >
              <h1 className="text-6xl font-serif text-white mb-6">Chan & Jim</h1>
              <button
                onClick={handleUnlock}
                className="bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-bold px-10 py-4 rounded-full shadow-lg hover:scale-105 transition"
              >
                Open Invitation ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeTab === "invite" && (
              <motion.div
                key="invite"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <div className="inline-block p-1 rounded-full bg-purple-50 mb-6">
                    <Flower2 className="w-10 h-10 text-purple-700" />
                </div>
                
                {/* Refined Name Styling */}
                <div className="relative py-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-2 border-amber-200/50 absolute"></div>
                    <div className="w-44 h-44 rounded-full border border-amber-200/30 absolute"></div>
                  </div>
                  <h1 className="relative font-serif text-7xl font-light text-purple-950">Chan</h1>
                  <p className="relative font-serif text-4xl text-sky-700 italic">&</p>
                  <h1 className="relative font-serif text-7xl font-light text-purple-950">Jim</h1>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-b from-amber-50 to-transparent border border-amber-100 rounded-3xl">
                  <p className="font-serif text-sm text-slate-700 leading-relaxed italic">
                    "Clothed in Faith"
                  </p>
                  <p className="text-base font-semibold text-slate-900 mt-2">October 30, 2026</p>
                  <p className="text-sm text-purple-900 font-medium">GracePoint Church, Kikuyu</p>
                </div>
              </motion.div>
            )}

            {/* Other tabs remain similar but with improved styling */}
            {activeTab === "album" && (
               <motion.div key="album" className="p-6 text-center">
                 <h2 className="text-xl font-serif text-purple-950 mb-6">Our Journey</h2>
                 <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900">
                   <img src={photoAlbum[currentSlide].src} alt="" className="w-full h-full object-cover" />
                 </div>
               </motion.div>
            )}

            {/* TAB 3: GIVING */}
            {activeTab === "giving" && (
               <motion.div key="giving" className="p-6 text-center">
                 <h2 className="text-xl font-serif text-purple-950 mb-6">Partnering Together</h2>
                 <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-left">
                   <p className="text-sm font-semibold text-slate-700 mb-4">M-PESA: 0704656076</p>
                   <button onClick={handleCopyMpesa} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold text-sm">
                      {copiedMpesa ? "Copied!" : "Copy Number"}
                   </button>
                 </div>
               </motion.div>
            )}

            {/* TAB 4: RSVP */}
            {activeTab === "rsvp" && (
              <motion.div key="rsvp" className="p-6">
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <input name="name" placeholder="Full Name" required className="w-full p-3 rounded-xl border border-slate-200" />
                  <input name="email" type="email" placeholder="Email" required className="w-full p-3 rounded-xl border border-slate-200" />
                  <button type="submit" className="w-full bg-purple-900 text-white py-4 rounded-2xl font-bold">
                    {loading ? "Sending..." : "Confirm RSVP"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 bg-white border-t border-slate-100 flex justify-around">
          {(["invite", "album", "giving", "rsvp"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-xs font-bold uppercase tracking-widest ${activeTab === tab ? "text-purple-700" : "text-slate-400"}`}>
              {tab}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
