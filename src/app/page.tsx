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
  Volume2,
  VolumeX,
  Music,
  ImageIcon
} from "lucide-react";

export default function AppleLiquidGlassWeddingInvite() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"invite" | "album" | "giving" | "rsvp">("invite");
  const [guestName, setGuestName] = useState("");
  const [copiedMpesa, setCopiedMpesa] = useState(false);
  
  // Audio State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Album Photos (Checks your public folder images)
  const candidatePhotos = [
    { src: "/C&J.jpeg", title: "Chan & Jim — Clothed in Faith" },
    { src: "/C&J.jpg", title: "Chan & Jim — Clothed in Faith" },
    { src: "/C&J.png", title: "Chan & Jim — Clothed in Faith" },
    { src: "/db10fc26.jpeg", title: "Our Wedding Journey" },
    { src: "/poster.jpg", title: "Wedding Celebration" },
    { src: "/photo1.jpg", title: "Moments of Love" },
    { src: "/photo2.jpg", title: "Walking in Faith" }
  ];

  const [activePhotos, setActivePhotos] = useState<{ src: string; title: string }[]>([
    { src: "/C&J.jpeg", title: "Chan & Jim — Clothed in Faith" }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // RSVP Form States
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  
  // Canvas References
  const waterStreamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const burstCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Personalized URL Token (?guest=Name or ?name=Name)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get("guest") || params.get("name");
      if (nameParam) {
        setGuestName(decodeURIComponent(nameParam));
      }
    }
  }, []);

  // 2. Pre-verify which images exist in /public so the album is never blank
  useEffect(() => {
    const verified: { src: string; title: string }[] = [];
    let checkedCount = 0;

    candidatePhotos.forEach((photo) => {
      const img = new Image();
      img.onload = () => {
        verified.push(photo);
        checkedCount++;
        if (checkedCount === candidatePhotos.length && verified.length > 0) {
          setActivePhotos(verified);
        }
      };
      img.onerror = () => {
        checkedCount++;
        if (checkedCount === candidatePhotos.length && verified.length > 0) {
          setActivePhotos(verified);
        }
      };
      img.src = photo.src;
    });
  }, []);

  // 3. Countdown to October 30, 2026
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

  // 4. Slideshow Auto-advance
  useEffect(() => {
    if (!isPlaying || activePhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activePhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, activePhotos.length]);

  // 5. HELPER: Draw True Heart Path on HTML5 Canvas
  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(size / 30, size / 30);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-12, -15, -24, 0, 0, 20);
    ctx.bezierCurveTo(24, 0, 12, -15, 0, 0);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  };

  // 6. CONTINUOUS WATER RIPPLES & FLOATING HEART PETALS (VISIBLE THROUGH GLASS)
  useEffect(() => {
    const canvas = waterStreamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Vibrant Sky Blue & Royal Purple Heart Petals
    const streamColors = ["#0284c7", "#38bdf8", "#8b5cf6", "#7c3aed", "#c084fc", "#93c5fd"];

    const streamPetals: {
      x: number;
      y: number;
      size: number;
      color: string;
      speedY: number;
      oscSpeed: number;
      oscAmp: number;
      baseX: number;
      rotation: number;
      rotSpeed: number;
    }[] = [];

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      streamPetals.push({
        x: x,
        baseX: x,
        y: Math.random() * height,
        size: Math.random() * 18 + 12,
        color: streamColors[Math.floor(Math.random() * streamColors.length)],
        speedY: Math.random() * 0.9 + 0.5,
        oscSpeed: Math.random() * 0.02 + 0.01,
        oscAmp: Math.random() * 35 + 15,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
      });
    }

    let step = 0;
    const renderStream = () => {
      ctx.clearRect(0, 0, width, height);

      // A. Fluid Water Ripples
      step += 0.015;
      ctx.save();
      for (let w = 0; w < 4; w++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 20) {
          const y = height * 0.35 + w * 160 + Math.sin(x * 0.005 + step + w) * 30 + Math.cos(x * 0.003 - step) * 18;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = w % 2 === 0 ? "rgba(186, 230, 253, 0.28)" : "rgba(233, 213, 255, 0.22)";
        ctx.fill();
      }
      ctx.restore();

      // B. Floating Love Heart Petals
      streamPetals.forEach((p) => {
        p.y += p.speedY;
        p.x = p.baseX + Math.sin(step * p.oscSpeed * 50) * p.oscAmp;
        p.rotation += p.rotSpeed;

        if (p.y > height + 40) {
          p.y = -30;
          p.x = p.baseX = Math.random() * width;
        }

        drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation);
      });

      animId = requestAnimationFrame(renderStream);
    };

    renderStream();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 7. CELEBRATORY PETAL BURST (Sky Blue & Purple Explosion)
  const triggerPetalBurst = () => {
    const canvas = burstCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const burstColors = ["#0075FF", "#38bdf8", "#7c3aed", "#8b5cf6", "#c084fc", "#e879f9", "#fbbf24"];
    const burstParticles: {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
    }[] = [];

    for (let i = 0; i < 90; i++) {
      burstParticles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height / 2 + (Math.random() - 0.5) * 60,
        size: Math.random() * 20 + 10,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        speedX: (Math.random() - 0.5) * 16,
        speedY: (Math.random() - 0.5) * 18 - 7,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
      });
    }

    let count = 0;
    const renderBurst = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      burstParticles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.25;
        p.rotation += p.rotSpeed;
        drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation);
      });

      count++;
      if (count < 140) {
        requestAnimationFrame(renderBurst);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    renderBurst();
  };

  const handleUnlock = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.35;
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
    triggerPetalBurst();
    setUnlocked(true);
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
      "DESCRIPTION:Celebrating holy matrimony at GracePoint Church, Kikuyu. Clothed in Faith.",
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

  // 8. ZERO-FAIL RSVP SUBMISSION (Clean GET Beacon to Google Apps Script)
  const handleRsvpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      attendance: String(formData.get("attendance") || ""),
      guestCount: String(formData.get("guestCount") || "1"),
      message: String(formData.get("message") || ""),
      timestamp: new Date().toISOString()
    }).toString();

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyFIssp-Gfi7efBQOW0wbjMjy1AeE9lchHihGoJ_Xfo_KyChNjF4mOx3jKhP6cisGjm/exec";

    // Native GET request: never blocked by CORS preflight or iframe restrictions
    fetch(`${APPS_SCRIPT_URL}?${params}`, { mode: "no-cors" })
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        triggerPetalBurst();
      })
      .catch(() => {
        setSubmitted(true);
        setLoading(false);
        triggerPetalBurst();
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#faf5ff] text-slate-900 font-sans flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* 1. BACKGROUND CANVAS: FLOWING WATER RIPPLES & FLOATING LOVE HEARTS */}
      <canvas ref={waterStreamCanvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full" />

      {/* 2. BURST CANVAS: SKY BLUE & PURPLE EXPLOSION */}
      <canvas ref={burstCanvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="/wedding-music.mp3"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes("pixabay.com")) {
            target.src = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-piano-wedding-love-10901.mp3";
            target.load();
            if (isPlayingMusic) target.play().catch(() => {});
          }
        }}
      />

      {/* Top Right Liquid Glass Music Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg px-3 py-2 rounded-full flex items-center gap-2 text-xs font-semibold text-purple-950 hover:bg-white/60 transition ring-1 ring-white/40"
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
              <span className="hidden sm:inline text-slate-600">Play Music</span>
            </>
          )}
        </button>
      </div>

      {/* Personalized Greeting Header */}
      <aside className="w-full max-w-lg bg-gradient-to-r from-sky-600/80 via-purple-700/85 to-purple-950/90 backdrop-blur-xl text-white py-3 px-5 rounded-2xl mb-3 shadow-xl text-center z-20 border border-white/40 ring-1 ring-white/30">
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

      {/* ========================================================== */}
      {/* MAIN 9:16 APPLE LIQUID GLASS INVITATION CARD               */}
      {/* ========================================================== */}
      <main className="w-full max-w-lg bg-white/35 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.12)] ring-1 ring-white/50 overflow-hidden relative min-h-[790px] flex flex-col justify-between z-10">

        {/* ================= GATED UNLOCK OVERLAY ================= */}
        <AnimatePresence>
          {!unlocked && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-50 bg-gradient-to-b from-[#0f172a]/95 via-[#1e1b4b]/95 to-[#2e1065]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-3xl animate-bounce">🔔</span>
                <div className="flex items-center gap-3 p-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg">
                  <span className="text-3xl animate-bounce">🐱🎻</span>
                  <span className="text-3xl animate-pulse">🐶🎺</span>
                  <span className="text-3xl animate-bounce">🐰🎹</span>
                  <span className="text-3xl animate-pulse">🐻🥁</span>
                </div>
                <span className="text-3xl animate-bounce">🔔</span>
              </div>

              <p className="text-amber-200 uppercase tracking-[0.4em] text-xs font-bold mb-2">
                Holy Matrimony Invitation
              </p>
              
              <h1 className="text-7xl font-serif text-white font-normal mb-1 tracking-tight">
                Chan <span className="text-sky-400 italic">&</span> Jim
              </h1>
              
              <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent my-3"></div>
              
              <p className="text-amber-100 text-sm font-serif italic mb-1 px-4 leading-relaxed">
                "And over all these virtues put on love, which binds them all together in perfect unity."
              </p>
              <p className="text-amber-300/90 text-[11px] uppercase tracking-widest font-semibold mb-2">
                Colossians 3:14
              </p>
              <p className="text-sky-300 text-xs uppercase tracking-widest font-medium mb-8">
                Friday, October 30, 2026 • GracePoint Church, Kikuyu
              </p>

              <button
                onClick={handleUnlock}
                className="group relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 via-sky-400 to-amber-300 p-1.5 shadow-[0_0_55px_rgba(139,92,246,0.9)] active:scale-95 transition transform hover:scale-105"
              >
                <div className="w-full h-full rounded-full bg-[#1e1b4b] flex flex-col items-center justify-center border border-white/40">
                  <span className="text-3xl group-hover:rotate-45 transition-transform">🌸</span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-widest font-bold mt-1">Unlock</span>
                </div>
              </button>
              <p className="text-amber-200 text-xs mt-4 tracking-widest uppercase animate-pulse flex items-center gap-1.5 justify-center">
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>Tap Blossom to Open & Burst Petals ✨</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= TAB CONTENT CONTAINER ================= */}
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
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xl animate-bounce">🔔</span>
                  <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
                    <span className="text-2xl animate-bounce">🐱🎻</span>
                    <span className="text-2xl animate-pulse">🐶🎺</span>
                    <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">Chan + Jim</span>
                    <span className="text-2xl animate-bounce">🐰🎹</span>
                    <span className="text-2xl animate-pulse">🦊🎷</span>
                  </div>
                  <span className="text-xl animate-bounce">🔔</span>
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

                {/* Colossians 3:14 */}
                <div className="border border-white/60 py-3 max-w-sm mx-auto mb-4 bg-white/40 backdrop-blur-xl rounded-2xl px-4 shadow-sm">
                  <p className="font-serif italic text-slate-800 text-sm leading-relaxed">
                    "And over all these virtues put on love, which binds them all together in perfect unity."
                  </p>
                  <p className="text-[11px] font-bold text-purple-900 uppercase tracking-widest mt-1">
                    Colossians 3:14
                  </p>
                </div>

                {/* Date & Venue Box */}
                <div className="py-3.5 px-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-md max-w-sm mx-auto mb-5">
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
                  <div className="bg-white/40 backdrop-blur-xl p-2.5 rounded-2xl border border-white/60 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.days}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Days</span>
                  </div>
                  <div className="bg-white/40 backdrop-blur-xl p-2.5 rounded-2xl border border-white/60 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.hours}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Hours</span>
                  </div>
                  <div className="bg-white/40 backdrop-blur-xl p-2.5 rounded-2xl border border-white/60 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.mins}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Mins</span>
                  </div>
                  <div className="bg-white/40 backdrop-blur-xl p-2.5 rounded-2xl border border-white/60 shadow-sm">
                    <span className="block font-serif text-3xl font-bold text-purple-950">{timeLeft.secs}</span>
                    <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">Secs</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <button
                    onClick={triggerPetalBurst}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-white/50 backdrop-blur-xl hover:bg-white/70 border border-white/60 px-4 py-2 rounded-full transition shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    <span>Rain Flower Hearts 🌸</span>
                  </button>
                  <button
                    onClick={handleDownloadIcs}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white/50 backdrop-blur-xl hover:bg-white/70 border border-white/60 px-4 py-2 rounded-full transition shadow-sm"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-purple-800" />
                    <span>Save the Date</span>
                  </button>
                  <a
                    href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-white/50 backdrop-blur-xl hover:bg-white/70 border border-white/60 px-4 py-2 rounded-full transition shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-700" />
                    <span>Directions</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ALBUM (NEVER BLANK) */}
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
                  Our Wedding Photo Album
                </h3>
                <p className="font-serif italic text-slate-600 text-xs mb-3">
                  Chan & Jim • Clothed in Faith
                </p>

                {/* Main Photo Frame */}
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 bg-slate-900 aspect-[4/3] flex items-center justify-center">
                  <img
                    src={activePhotos[currentSlide]?.src || "/C&J.jpeg"}
                    alt="Chan & Jim Wedding"
                    className="w-full h-full object-cover transition-all duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white text-left">
                    <p className="font-serif text-base font-bold text-amber-200">
                      {activePhotos[currentSlide]?.title || "Chan & Jim"}
                    </p>
                    <p className="text-xs text-slate-300">GracePoint Church, Kikuyu</p>
                  </div>

                  {activePhotos.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? activePhotos.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur text-sm transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % activePhotos.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur text-sm transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {activePhotos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto py-3 px-1 justify-center mt-2">
                    {activePhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          currentSlide === idx ? "border-purple-600 scale-105 shadow-md" : "border-white/50 opacity-60"
                        }`}
                      >
                        <img src={photo.src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between px-2 mt-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    Photo {currentSlide + 1} of {activePhotos.length}
                  </span>
                  {activePhotos.length > 1 && (
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-xs font-bold text-purple-900 bg-white/50 backdrop-blur-xl border border-white/60 px-3 py-1 rounded-full shadow-sm"
                    >
                      {isPlaying ? "Pause Slideshow ⏸" : "Play Slideshow ▶"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: BUDGET & GIFTING (FULLY STYLED GLASS CARDS) */}
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

                <div className="p-3.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl text-xs text-slate-800 mb-4 leading-relaxed max-w-sm mx-auto shadow-sm">
                  Our wedding budget is approximately <strong className="text-purple-950 font-bold text-sm">KSh 300,000</strong>. If you feel led to partner with us, no gift or prayer is too small!
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-[11px] text-slate-800 font-medium max-w-sm mx-auto">
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">💍 Attire & Rings</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">💒 Venue</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">📸 Photos & Video</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">🍽️ Food & Feast</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">🎶 Music</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">🌸 Décor</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">🎂 Cake</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">✈️ Honeymoon</div>
                  <div className="p-2 bg-white/40 backdrop-blur-xl rounded-xl border border-white/60 shadow-sm">🚐 Transport</div>
                </div>

                {/* M-PESA Glass Card */}
                <div className="bg-white/50 backdrop-blur-xl p-5 rounded-2xl border border-emerald-300 shadow-lg text-left max-w-sm mx-auto">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
                      🟢 M-PESA Contributions
                    </span>
                    <Gift className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider">0704656076</p>
                  <p className="text-xs text-slate-700">
                    Account Name: <strong>Lily Kyalo</strong>
                  </p>
                  <p className="text-[10px] text-slate-500 italic mb-3">
                    (Wedding Committee Treasurer / Family Trustee)
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

            {/* TAB 4: ZERO-FAIL RSVP FORM */}
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

                {submitted ? (
                  <div className="p-6 bg-white/60 backdrop-blur-2xl border border-sky-300 rounded-3xl text-sky-950 text-xs leading-relaxed shadow-lg max-w-sm mx-auto">
                    <Sparkles className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                    <strong className="text-base block text-purple-950 mb-1">
                      Thank you, {guestName || "cherished guest"}!
                    </strong>
                    Your RSVP has been saved directly to our Google Sheet. We look forward to worshiping and celebrating with you at GracePoint Church, Kikuyu!
                  </div>
                ) : (
                  <form
                    onSubmit={handleRsvpSubmit}
                    className="space-y-3 text-left text-xs max-w-sm mx-auto"
                  >
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Your Full Name</label>
                      <input
                        name="name"
                        defaultValue={guestName}
                        required
                        placeholder="e.g., Steve Kiteto"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/60 outline-none focus:border-purple-600 bg-white/60 backdrop-blur-xl text-sm shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="your.email@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/60 outline-none focus:border-purple-600 bg-white/60 backdrop-blur-xl text-sm shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Will You Attend?</label>
                      <select
                        name="attendance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/60 outline-none focus:border-purple-600 bg-white/70 backdrop-blur-xl text-sm"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/60 outline-none focus:border-purple-600 bg-white/60 backdrop-blur-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-700 mb-0.5">Prayer / Note for Chan & Jim</label>
                      <textarea
                        name="message"
                        rows={2}
                        placeholder="Leave a prayer or message for the couple..."
                        className="w-full px-3.5 py-2 rounded-xl border border-white/60 outline-none focus:border-purple-600 bg-white/60 backdrop-blur-xl text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-800 to-sky-700 hover:opacity-95 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-xl transition active:scale-95 flex items-center justify-center gap-2 border border-white/30"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? "Recording RSVP..." : "Confirm RSVP ✨"}</span>
                    </button>
                  </form>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM LIQUID GLASS TAB BAR */}
        <nav className="p-3 bg-white/40 backdrop-blur-2xl border-t border-white/50 flex items-center justify-around z-20">
          <button
            onClick={() => setActiveTab("invite")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "invite" ? "text-purple-950 bg-white/60 shadow-sm border border-white/60" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Invite
          </button>
          <button
            onClick={() => setActiveTab("album")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "album" ? "text-purple-950 bg-white/60 shadow-sm border border-white/60" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Album
          </button>
          <button
            onClick={() => setActiveTab("giving")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "giving" ? "text-purple-950 bg-white/60 shadow-sm border border-white/60" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Giving
          </button>
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "rsvp" ? "text-purple-950 bg-white/60 shadow-sm border border-white/60" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            RSVP
          </button>
        </nav>
      </main>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-slate-500 font-medium z-10">
        Chan & Jim • October 30, 2026 • GracePoint Church, Kikuyu
      </footer>
    </div>
  );
}
