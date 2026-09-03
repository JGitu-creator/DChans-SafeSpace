"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Bell, 
  Gift, 
  MapPin, 
  Calendar as CalendarIcon, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  LockOpen,
  MessageCircle,
  Volume2,
  VolumeX,
  Music
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
      audioRef.current.volume = 0.35; // Gentle ambient volume
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

  // 5. Flower Petal Shower Burst
  const triggerPetalBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#a855f7", "#fbbf24", "#bae6fd"];
    const petals: { x: number; y: number; size: number; color: string; speedX: number; speedY: number; rotation: number; rotSpeed: number }[] = [];

    for (let i = 0; i < 80; i++) {
      petals.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height / 2 + (Math.random() - 0.5) * 60,
        size: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 14,
        speedY: (Math.random() - 0.5) * 16 - 6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
      });
    }

    let count = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.22;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      count++;
      if (count < 130) {
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

  // 6. Download .ics Calendar Event
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

  // 7. Hidden Iframe RSVP Submission (Zero-fail)
  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(false);

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.append("name", String(formData.get("name") || ""));
    params.append("email", String(formData.get("email") || ""));
    params.append("attendance", String(formData.get("attendance") || ""));
    params.append("guestCount", String(formData.get("guestCount") || "1"));
    params.append("message", String(formData.get("message") || ""));

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyFIssp-Gfi7efBQOW0wbjMjy1AeE9lchHihGoJ_Xfo_KyChNjF4mOx3jKhP6cisGjm/exec";

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
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
    <div className="min-h-screen bg-[#f7f2e7] text-slate-900 font-sans flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* Background Audio Element */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="/wedding-music.mp3"
        onError={(e) => {
          // Fallback to high-quality royalty-free acoustic strings if local file isn't uploaded yet
          const target = e.currentTarget;
          if (!target.src.includes("pixabay.com") && !target.src.includes("archive.org")) {
            target.src = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-piano-wedding-love-10901.mp3";
            target.load();
            if (isPlayingMusic) target.play().catch(() => {});
          }
        }}
      />

      {/* Floating Music Control Widget */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="bg-white/90 backdrop-blur border border-amber-300 shadow-xl px-3 py-2 rounded-full flex items-center gap-2 text-xs font-semibold text-purple-900 hover:bg-amber-50 transition"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 text-purple-700 animate-pulse" />
              <span className="hidden sm:inline">Music Playing</span>
              <span className="flex gap-0.5">
                <span className="w-1 h-3 bg-purple-600 animate-bounce"></span>
                <span className="w-1 h-4 bg-sky-500 animate-bounce delay-75"></span>
                <span className="w-1 h-2 bg-amber-500 animate-bounce delay-150"></span>
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline text-slate-500">Play Music</span>
            </>
          )}
        </button>
      </div>

      {/* Canvas for Petal Rain */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {/* Top Personalized Greeting Bar */}
      <aside className="w-full max-w-lg bg-gradient-to-r from-sky-600 via-purple-700 to-purple-950 text-white py-3 px-5 rounded-2xl mb-3 shadow-xl text-center z-20 border border-amber-300/40">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span className="text-sm sm:text-base font-serif font-bold tracking-wide">
            {guestName ? `Karibu Sana, ${guestName}!` : "Karibu! You are warmly invited"}
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        </div>
        <p className="text-[11px] text-amber-200 uppercase tracking-[0.25em] font-semibold mt-0.5">
          The Wedding of Chan & Jim • Clothed in Faith
        </p>
      </aside>

      {/* Main Luxury 9:16 Invitation Card */}
      <main className="w-full max-w-lg bg-[#fffdfa] rounded-[2.5rem] border-4 border-amber-300/80 shadow-[0_25px_60px_-15px_rgba(90,60,30,0.25)] overflow-hidden relative min-h-[780px] flex flex-col justify-between z-10">

        {/* GATED UNLOCK OVERLAY */}
        <AnimatePresence>
          {!unlocked && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-50 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2e1065] flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Bell className="w-8 h-8 text-amber-300 animate-bounce" />
                <div className="p-3 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center gap-2 shadow-lg">
                  <span className="text-4xl animate-pulse">🐱👰</span>
                  <Heart className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
                  <span className="text-4xl animate-pulse">🐶🤵</span>
                </div>
                <Bell className="w-8 h-8 text-amber-300 animate-bounce" />
              </div>

              <p className="text-amber-200/90 uppercase tracking-[0.4em] text-xs font-bold mb-2">
                Holy Matrimony Invitation
              </p>
              
              <h1 className="text-7xl font-serif text-white font-normal mb-1 tracking-tight">
                Chan <span className="text-sky-400 italic">&</span> Jim
              </h1>
              
              <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent my-3"></div>
              
              <p className="text-amber-100 text-sm font-serif italic mb-1 px-4 leading-relaxed">
                "And over all these virtues put on love, which binds them all together in perfect unity."
              </p>
              <p className="text-amber-300/80 text-[11px] uppercase tracking-widest font-semibold mb-2">
                Colossians 3:14
              </p>
              <p className="text-sky-300 text-xs uppercase tracking-widest font-medium mb-8">
                Friday, October 30, 2026 • GracePoint Church, Kikuyu
              </p>

              <button
                onClick={handleUnlock}
                className="group relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-purple-700 via-sky-500 to-amber-300 p-1 shadow-[0_0_50px_rgba(139,92,246,0.8)] active:scale-95 transition transform hover:scale-105"
              >
                <div className="w-full h-full rounded-full bg-[#1e1b4b] flex flex-col items-center justify-center border-2 border-amber-300">
                  <LockOpen className="w-8 h-8 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span className="text-[10px] text-amber-200 uppercase tracking-widest font-bold mt-1">Unlock</span>
                </div>
              </button>
              <p className="text-amber-200/80 text-xs mt-4 tracking-widest uppercase animate-pulse flex items-center gap-1.5 justify-center">
                <Music className="w-3.5 h-3.5 text-sky-300" />
                <span>Tap to Open & Play Music ✨</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB CONTENT CONTAINER */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: FORMAL INVITATION */}
            {activeTab === "invite" && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-6 sm:p-8 text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-purple-700 animate-bounce" />
                  <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-purple-50 border border-purple-200 shadow-sm">
                    <span className="text-2xl">🐱💐</span>
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-widest">Chan + Jim</span>
                    <span className="text-2xl">🐶🎩</span>
                  </div>
                  <Bell className="w-5 h-5 text-purple-700 animate-bounce" />
                </div>

                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-bold mb-1">
                  Together With Their Families
                </p>
                <h2 className="text-xs uppercase tracking-[0.3em] text-purple-900 font-semibold mb-3">
                  The Wedding Celebration Of
                </h2>

                <div className="py-2">
                  <h1 className="font-serif text-7xl sm:text-8xl text-purple-950 font-normal leading-none tracking-tight">
                    Chan
                  </h1>
                  <div className="text-5xl text-sky-600 font-serif italic my-1 font-light">
                    &
                  </div>
                  <h1 className="font-serif text-7xl sm:text-8xl text-purple-950 font-normal leading-none tracking-tight">
                    Jim
                  </h1>
                </div>

                <p className="text-xl font-serif italic text-slate-700 mt-2 mb-3 font-medium">
                  "Clothed in Faith"
                </p>

                {/* Biblical Verse: Colossians 3:14 */}
                <div className="border-y-2 border-amber-200/90 py-3 max-w-sm mx-auto mb-4 bg-amber-50/40 rounded-xl px-4">
                  <p className="font-serif italic text-slate-800 text-sm leading-relaxed">
                    "And over all these virtues put on love, which binds them all together in perfect unity."
                  </p>
                  <p className="text-[11px] font-semibold text-purple-900 uppercase tracking-widest mt-1">
                    Colossians 3:14
                  </p>
                </div>

                {/* Date & Venue Box */}
                <div className="py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-purple-50 border-2 border-amber-200 shadow-sm max-w-sm mx-auto mb-6">
                  <p className="font-bold text-slate-950 text-base sm:text-lg tracking-wide">
                    Friday, October 30, 2026
                  </p>
                  <p className="text-purple-900 font-bold text-sm mt-0.5">
                    GracePoint Church, Kikuyu
                  </p>
                  <p className="text-slate-500 text-xs">Kiambu County, Kenya</p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4 text-center">
                  <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.days}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Days</span>
                  </div>
                  <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.hours}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Hours</span>
                  </div>
                  <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.mins}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Mins</span>
                  </div>
                  <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.secs}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Secs</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <button
                    onClick={handleDownloadIcs}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white border border-amber-300 hover:bg-amber-50 px-4 py-2 rounded-full transition shadow-sm"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-purple-800" />
                    <span>Save the Date</span>
                  </button>
                  <a
                    href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-4 py-2 rounded-full transition shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-700" />
                    <span>GracePoint Directions</span>
                  </a>
                  <button
                    onClick={triggerPetalBurst}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-full transition shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    <span>Rain Petals</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: INTERACTIVE ALBUM */}
            {activeTab === "album" && (
              <motion.div
                key="album"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-6 text-center"
              >
                <h3 className="text-xs uppercase tracking-[0.3em] text-purple-950 font-bold mb-1">
                  Our Wedding Album
                </h3>
                <p className="font-serif italic text-slate-600 text-xs mb-3">
                  Moments of faith, friendship & preparation
                </p>

                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[4/3] flex items-center justify-center">
                  <img
                    src={photoAlbum[currentSlide].src}
                    alt={photoAlbum[currentSlide].caption}
                    className="w-full h-full object-cover transition-opacity duration-700"
                  />
                  
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-white text-left">
                    <p className="font-serif text-lg font-bold text-amber-200">
                      {photoAlbum[currentSlide].caption}
                    </p>
                    <p className="text-xs text-slate-300">
                      {photoAlbum[currentSlide].sub}
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? photoAlbum.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur text-sm transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % photoAlbum.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur text-sm transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 overflow-x-auto py-3 px-1 justify-center mt-2">
                  {photoAlbum.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentSlide === idx ? "border-purple-600 scale-105 shadow-md" : "border-slate-200 opacity-60"
                      }`}
                    >
                      <img src={item.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between px-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    Photo {currentSlide + 1} of {photoAlbum.length}
                  </span>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-full"
                  >
                    {isPlaying ? "Pause Slideshow ⏸" : "Play Slideshow ▶"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: BUDGET & GIFTING */}
            {activeTab === "giving" && (
              <motion.div
                key="giving"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-6 text-center"
              >
                <h3 className="text-xs uppercase tracking-[0.3em] text-purple-950 font-bold mb-1">
                  Partnering Together
                </h3>
                <p className="font-serif italic text-slate-700 text-xs sm:text-sm mb-3 max-w-sm mx-auto leading-relaxed">
                  "We are grateful for you! You are one of the people God has placed around us as we prepare to celebrate our special day."
                </p>

                <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs text-slate-800 mb-4 leading-relaxed max-w-sm mx-auto">
                  Our wedding budget is approximately <strong className="text-purple-950 font-bold text-sm">KSh 300,000</strong>. If you feel led to stand with us in any way, no gift or prayer is too small!
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-[11px] text-slate-800 font-medium max-w-sm mx-auto">
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">💍 Attire & Rings</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">💒 Venue</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">📸 Photos & Video</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">🍽️ Food & Feast</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">🎶 Music</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">🌸 Décor</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">🎂 Cake</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">✈️ Honeymoon</div>
                  <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-sm">🚐 Transport</div>
                </div>

                {/* M-PESA Card with Explicit Family Role Clarifier */}
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-lg text-left max-w-sm mx-auto">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase font-bold text-emerald-600 tracking-wider">
                      🟢 M-PESA Contributions
                    </span>
                    <Gift className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider">0704656076</p>
                  <p className="text-xs text-slate-600">
                    Account Name: <strong>Lily Kyalo</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 italic mb-3">
                    (Family Trustee / Wedding Committee Treasurer)
                  </p>
                  <button
                    onClick={handleCopyMpesa}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
                  >
                    {copiedMpesa ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedMpesa ? "Copied to Clipboard!" : "Copy M-PESA Number"}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 4: RSVP WITH ERROR FALLBACK & DUPLICATE PROTECTION */}
            {activeTab === "rsvp" && (
              <motion.div
                key="rsvp"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-6 text-center"
              >
                <h3 className="text-xs uppercase tracking-[0.3em] text-purple-950 font-bold mb-1">
                  Kindly RSVP
                </h3>
                <p className="text-xs text-slate-500 mb-4">Please respond by September 30, 2026</p>

                {submitted || hasAlreadyRsvp ? (
                  <div className="p-6 bg-sky-50 border-2 border-sky-300 rounded-3xl text-sky-950 text-xs leading-relaxed shadow-lg max-w-sm mx-auto">
                    <Sparkles className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                    <strong className="text-base block text-purple-950 mb-1">
                      Thank you, {guestName || "cherished guest"}!
                    </strong>
                    Your RSVP has been saved. We look forward to worshiping and celebrating with you at GracePoint Church, Kikuyu!
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-3 text-left text-xs max-w-sm mx-auto">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Your Full Name</label>
                      <input
                        name="name"
                        defaultValue={guestName}
                        required
                        placeholder="e.g., Steve Kiteto"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white text-sm shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="your.email@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white text-sm shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Will You Attend?</label>
                      <select
                        name="attendance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white text-sm"
                      >
                        <option value="Attending">Delightfully Attending</option>
                        <option value="Declining">Regretfully Declining</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Party Size (+1s)</label>
                      <input
                        type="number"
                        name="guestCount"
                        min="1"
                        max="4"
                        defaultValue="1"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Blessing / Note for Chan & Jim</label>
                      <textarea
                        name="message"
                        rows={2}
                        placeholder="Leave a prayer or note for the couple..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white text-sm"
                      />
                    </div>

                    {submitError && (
                      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs">
                        <p className="font-semibold mb-1">Network notice:</p>
                        <p className="mb-2">We could not sync directly to the sheet right now. Tap below to send your RSVP directly via WhatsApp:</p>
                        <a
                          href={`https://wa.me/254704656076?text=Hi%20Chan%20%26%20Jim,%20this%20is%20${encodeURIComponent(guestName || "a guest")}.%20I%20would%20love%20to%20confirm%20my%20attendance%20for%20October%2030th!`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Send RSVP via WhatsApp</span>
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-800 to-sky-700 hover:opacity-95 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? "Recording RSVP..." : "Confirm RSVP"}</span>
                    </button>
                  </form>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM TAB NAVIGATION */}
        <nav className="p-3 bg-white border-t border-amber-200/80 flex items-center justify-around z-20">
          <button
            onClick={() => setActiveTab("invite")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "invite" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Invite
          </button>
          <button
            onClick={() => setActiveTab("album")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "album" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Album
          </button>
          <button
            onClick={() => setActiveTab("giving")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "giving" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Giving
          </button>
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "rsvp" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            RSVP
          </button>
        </nav>
      </main>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-slate-500 font-medium">
        Chan & Jim • October 30, 2026 • GracePoint Church, Kikuyu
      </footer>
    </div>
  );
}
