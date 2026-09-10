"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Copy, 
  Check, 
  Sparkles, 
  Gift,
  Camera,
  ExternalLink,
  Volume2,
  VolumeX,
  Send 
} from "lucide-react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function WeddingInvite() {
  const [unrolled, setUnrolled] = useState(false);
  
  // Clean 3-Field RSVP States
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [attendance, setAttendance] = useState("Attending");

  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Audio State for Kichwatah (Starts Strictly Muted)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const ytPlayerRef = useRef<any>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Canvases
  const waterStreamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const burstCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartY = useRef<number | null>(null);

  // 1. YouTube Player (Muted by Default)
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new window.YT.Player("yt-player", {
        height: "1",
        width: "1",
        videoId: "XHChjB1rKxI",
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: "XHChjB1rKxI",
          controls: 0,
          showinfo: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(55);
          }
        }
      });
    };
  }, []);

  // 2. Read URL Token (?guest=Name)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get("guest") || params.get("name");
      if (nameParam) {
        setGuestName(decodeURIComponent(nameParam));
      }
    }
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

  // 4. Heart Petals Canvas Helper
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
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  };

  // 5. Living Water Stream & Floating Petals (Sky Blue, Royal Purple, Lilac)
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

    const streamColors = ["#38bdf8", "#0284c7", "#581c87", "#7c3aed", "#c084fc", "#d8b4fe", "#bae6fd"];
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

    for (let i = 0; i < 45; i++) {
      const x = Math.random() * width;
      streamPetals.push({
        x,
        baseX: x,
        y: Math.random() * height,
        size: Math.random() * 18 + 12,
        color: streamColors[Math.floor(Math.random() * streamColors.length)],
        speedY: Math.random() * 0.85 + 0.45,
        oscSpeed: Math.random() * 0.02 + 0.01,
        oscAmp: Math.random() * 35 + 15,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
      });
    }

    let step = 0;
    const renderStream = () => {
      ctx.clearRect(0, 0, width, height);

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

  // 6. Petal Shower Burst
  const triggerPetalBurst = () => {
    const canvas = burstCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const burstColors = ["#0075FF", "#38bdf8", "#7c3aed", "#8b5cf6", "#c084fc", "#d8b4fe", "#fbbf24"];
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

    for (let i = 0; i < 80; i++) {
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

  // 7. Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = Math.abs(touchEndY - touchStartY.current);
    if (diff > 40) {
      triggerPetalBurst();
      setUnrolled(true);
    }
    touchStartY.current = null;
  };

  const toggleMusic = () => {
    if (ytPlayerRef.current && ytPlayerRef.current.getPlayerState) {
      const state = ytPlayerRef.current.getPlayerState();
      if (state === 1) {
        ytPlayerRef.current.pauseVideo();
        setIsPlayingMusic(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlayingMusic(true);
      }
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
      "DTSTAMP:20260910T000000Z",
      "DTSTART:20261030T070000Z",
      "DTEND:20261030T150000Z",
      "SUMMARY:Wedding of Chan Hadassah & Jim Gitu",
      "DESCRIPTION:Together with our families, we invite you to celebrate our wedding.",
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

  // 8. Single-Beacon Guaranteed RSVP Submission
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;
    setLoading(true);

    const nameToSend = guestName.trim() || "Guest";
    const emailToSend = guestEmail.trim() || "";
    const attendanceToSend = attendance || "Attending";

    const params = new URLSearchParams({
      name: nameToSend,
      email: emailToSend,
      attendance: attendanceToSend,
      guestCount: "1",
      message: ""
    }).toString();

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyg3F2Pj2rfOze7Fqjbg-YMRheqODk2q03-lair9z6yATp-buxJO0RWnFU4HWTLnoGn/exec";

    const beacon = new Image();
    beacon.src = `${APPS_SCRIPT_URL}?${params}&_t=${Date.now()}`;

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      triggerPetalBurst();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#faf5ff] text-slate-800 flex flex-col items-center justify-center p-3 sm:p-6 antialiased selection:bg-purple-200 relative overflow-x-hidden font-serif">
      
      {/* Typography: Cormorant Garamond (Body) + Cursive Calligraphy (Names) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Pinyon+Script&family=Alex+Brush&family=Great+Vibes&display=swap');
        
        .font-garamond {
          font-family: 'Cormorant Garamond', Garamond, 'Times New Roman', serif;
        }
        .font-calligraphy {
          font-family: 'Peach Cake', 'Pinyon Script', 'Alex Brush', 'Great Vibes', cursive;
        }
      `}</style>

      {/* Hidden YouTube Iframe for Audio */}
      <div id="yt-player" style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: -10 }} />

      {/* Living Water Stream & Floating Petals Canvas */}
      <canvas ref={waterStreamCanvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full" />
      <canvas ref={burstCanvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {/* Floating Music Widget (Starts Muted) */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="bg-white/50 backdrop-blur-xl border border-white/70 shadow-lg px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-garamond font-semibold text-purple-950 hover:bg-white/70 transition ring-1 ring-white/50"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 text-purple-700 animate-pulse" />
              <span className="hidden sm:inline">Nakupenda Msichana — Kichwatah 🎵</span>
              <span className="flex gap-0.5">
                <span className="w-1 h-3 bg-purple-600 animate-bounce"></span>
                <span className="w-1 h-4 bg-sky-500 animate-bounce delay-75"></span>
                <span className="w-1 h-2 bg-amber-500 animate-bounce delay-150"></span>
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline text-slate-600">Play Song 🎵</span>
            </>
          )}
        </button>
      </div>

      {/* Personalized Welcome Badge */}
      {guestName && (
        <aside className="w-full max-w-lg bg-gradient-to-r from-sky-600/80 via-purple-700/85 to-purple-950/90 backdrop-blur-xl text-white py-2 px-5 rounded-2xl mb-3 shadow-xl text-center z-20 border border-white/40 ring-1 ring-white/30">
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-300">❀</span>
            <span className="text-sm font-sans font-semibold tracking-wide">
              Karibu Sana, {guestName}!
            </span>
            <span className="text-amber-300">❀</span>
          </div>
        </aside>
      )}

      {/* Wedding Scroll Container */}
      <div 
        className="w-full max-w-xl relative flex flex-col items-center select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* SEALED SCROLL COVER */}
        <AnimatePresence>
          {!unrolled && (
            <motion.div 
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scaleY: 0.8, y: -20 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="w-full bg-white/45 backdrop-blur-2xl rounded-[2.5rem] border border-white/70 shadow-2xl p-8 sm:p-14 text-center relative overflow-hidden z-30 cursor-pointer ring-1 ring-white/50"
              onClick={() => {
                triggerPetalBurst();
                setUnrolled(true);
              }}
            >
              <p className="font-garamond text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-500 font-medium mb-3">
                Together with our families
              </p>
              
              <p className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-900 font-semibold mb-6">
                We Invite You To Celebrate The Wedding Of
              </p>

              {/* Names: Chan Hadassah & Jim Gitu */}
              <div className="py-3 space-y-1">
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Chan Hadassah
                </h1>
                <div className="text-3xl font-garamond italic text-amber-600 my-1 font-light">
                  &
                </div>
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Jim Gitu
                </h1>
              </div>

              {/* Wax Seal Monogram */}
              <div className="my-8 flex flex-col items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-sky-400 to-amber-300 p-1 shadow-[0_0_35px_rgba(212,175,55,0.4)] flex items-center justify-center border-2 border-white"
                >
                  <div className="w-full h-full rounded-full bg-[#4a044e] flex flex-col items-center justify-center border border-amber-300 shadow-inner">
                    <span className="font-garamond text-xl font-bold text-amber-200 tracking-widest">
                      C & J
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-amber-300/80 font-garamond">
                      10 • 30 • 26
                    </span>
                  </div>
                </motion.div>
                
                <p className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-900 font-bold mt-4 animate-pulse">
                  Tap or Swipe to Open Scroll 📜
                </p>
              </div>

              <p className="font-garamond italic text-slate-600 text-xs">
                Friday, October 30, 2026 • GracePoint Church, Kikuyu
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UNROLLED APPLE LIQUID GLASS CARD */}
        <AnimatePresence>
          {unrolled && (
            <motion.main 
              initial={{ opacity: 0, scaleY: 0.85, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="w-full bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/70 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.12)] ring-1 ring-white/50 p-6 sm:p-12 text-center relative overflow-hidden z-20 font-garamond"
            >
              
              {/* SEAMLESSLY BLENDED BOTANICAL FLORAL HEADER (NO HARSH BOX EDGES) */}
              <div className="w-full flex justify-center mb-6 px-2">
                <div className="relative w-full max-w-sm h-48 sm:h-56 flex items-center justify-center">
                  {/* Soft Pastel Ambient Glow Behind Flowers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-300/30 via-purple-300/35 to-pink-200/25 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Soft Feathered Floral Artwork (Seamless Vignette Blend) */}
                  <img
                    src="/floral-header.png"
                    alt="Chan & Jim Wedding Floral Centerpiece"
                    className="w-full h-full object-cover rounded-full mix-blend-multiply opacity-95 transition-opacity"
                    style={{
                      maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 80%)",
                      WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 80%)"
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("unsplash")) {
                        target.src = "https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=900&q=80";
                      }
                    }}
                  />
                </div>
              </div>

              {/* Top Line */}
              <p className="font-garamond text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-6 leading-relaxed">
                Together with our families,<br />we invite you to celebrate our wedding
              </p>

              {/* Names: Chan Hadassah & Jim Gitu */}
              <div className="py-2 space-y-1">
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Chan Hadassah
                </h1>
                <div className="text-3xl font-garamond italic text-amber-600 my-1 font-light">
                  &
                </div>
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Jim Gitu
                </h1>
              </div>

              {/* Scripture: 1 John 4:19 */}
              <div className="my-6 border-y border-white/80 py-4 max-w-sm mx-auto bg-white/30 backdrop-blur-md rounded-2xl px-4 shadow-sm">
                <p className="italic text-slate-800 text-base sm:text-lg leading-relaxed">
                  "We love because He first loved us."
                </p>
                <p className="font-garamond text-xs uppercase tracking-widest text-purple-900 font-bold mt-1.5">
                  1 John 4:19
                </p>
              </div>

              {/* Details Box */}
              <div className="my-6 p-6 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/70 shadow-sm max-w-sm mx-auto">
                <span className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-900 font-bold block mb-1">
                  Wedding Celebration
                </span>
                <p className="text-2xl sm:text-3xl text-slate-950 font-semibold tracking-wide">
                  Friday, October 30, 2026
                </p>
                <p className="text-lg text-purple-950 font-medium mt-1">
                  GracePoint Church
                </p>
                <p className="text-xs text-slate-500 font-garamond">
                  Kikuyu, Kenya
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto my-6 text-center font-garamond">
                <div className="p-2.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.days}</span>
                  <span className="text-[10px] uppercase tracking-wider text-purple-700 font-semibold">Days</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.hours}</span>
                  <span className="text-[10px] uppercase tracking-wider text-purple-700 font-semibold">Hours</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.mins}</span>
                  <span className="text-[10px] uppercase tracking-wider text-purple-700 font-semibold">Mins</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.secs}</span>
                  <span className="text-[10px] uppercase tracking-wider text-purple-700 font-semibold">Secs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 font-garamond text-xs mb-8">
                <button
                  onClick={handleDownloadIcs}
                  className="inline-flex items-center gap-1.5 text-slate-800 bg-white/60 backdrop-blur-xl border border-white/80 hover:bg-white/90 px-4 py-2 rounded-full transition shadow-sm"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-purple-800" />
                  <span>Save to Calendar</span>
                </button>
                <a
                  href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-900 bg-sky-50/70 backdrop-blur-xl border border-sky-200 hover:bg-sky-100 px-4 py-2 rounded-full transition shadow-sm font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>GracePoint Directions</span>
                </a>
              </div>

              {/* BE OUR WEDDING PHOTOGRAPHER */}
              <section className="my-8 p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm max-w-sm mx-auto">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-sky-100 text-sky-800 mb-2 shadow-inner">
                  <Camera className="w-5 h-5" />
                </div>
                
                <h3 className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-950 font-bold mb-1">
                  Be Our Wedding Photographer!
                </h3>
                
                <p className="italic text-slate-700 text-xs max-w-xs mx-auto leading-relaxed mb-4">
                  "Capture our day through your eyes! Scan the code or tap the button to upload wedding photos directly into our shared Google Album."
                </p>

                <div className="my-3 p-3 bg-white rounded-2xl border border-amber-200 shadow-md inline-block max-w-[170px] mx-auto">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=58-28-135&data=https%3A%2F%2Fphotos.app.goo.gl%2FRnGz5kPM74uaZUQL8" 
                    alt="Scan to add photos" 
                    className="w-32 h-32 mx-auto rounded-lg"
                  />
                  <p className="font-garamond text-[9px] text-slate-400 mt-1.5 uppercase tracking-widest font-semibold">
                    Point Camera to Scan
                  </p>
                </div>

                <div>
                  <a
                    href="https://photos.app.goo.gl/RnGz5kPM74uaZUQL8"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-purple-800 hover:opacity-95 text-white font-garamond font-bold px-5 py-2.5 rounded-xl shadow-md transition text-xs uppercase tracking-wider"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Album & Add Photos 📸</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </section>

              {/* WEDDING GIFTS & BLESSINGS */}
              <section className="my-8 p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm max-w-sm mx-auto">
                <span className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-950 font-bold block mb-2">
                  Wedding Gifts & Blessings
                </span>
                
                <p className="italic text-slate-700 text-xs max-w-xs mx-auto leading-relaxed mb-4">
                  "Your presence, love, and prayers on our special day are the greatest gifts of all. If you would like to bless us with a wedding gift as we begin our new home, cash gifts are warmly appreciated."
                </p>

                <div className="p-4 rounded-2xl bg-white/60 border border-emerald-300 shadow-sm text-left font-garamond">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> M-PESA Contribution
                    </span>
                    <Gift className="w-3.5 h-3.5 text-purple-900" />
                  </div>
                  
                  <p className="text-xl font-mono font-bold text-slate-900 tracking-wider">0704656076</p>
                  <p className="text-xs text-slate-600">
                    Account Name: <strong>Lily Kyalo</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 italic mb-2.5">
                    (Wedding Committee Treasurer / Family Trustee)
                  </p>

                  <button
                    onClick={handleCopyMpesa}
                    className="w-full bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 font-semibold py-2 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {copiedMpesa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-700" />}
                    <span>{copiedMpesa ? "Copied to Clipboard!" : "Copy M-PESA Number"}</span>
                  </button>
                </div>
              </section>

              {/* CLEAN 3-FIELD RSVP */}
              <section className="my-8 p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm max-w-sm mx-auto text-left">
                <div className="text-center mb-5">
                  <h3 className="font-garamond text-xs uppercase tracking-[0.25em] text-slate-500 font-bold mb-1">
                    Kindly Respond
                  </h3>
                  <p className="italic text-xs text-slate-500">
                    Please RSVP by September 30, 2026
                  </p>
                </div>

                {submitted ? (
                  <div className="p-5 bg-sky-50/90 border border-sky-200 rounded-2xl text-center space-y-1">
                    <Sparkles className="w-6 h-6 text-purple-700 mx-auto mb-1" />
                    <p className="text-base text-purple-950 font-bold">
                      Thank you, {guestName || "cherished guest"}!
                    </p>
                    <p className="text-xs text-slate-600 font-garamond">
                      Your response has been saved. We look forward to celebrating together at GracePoint Church, Kikuyu!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-3 font-garamond text-xs">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        placeholder="Your Full Name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/80 focus:border-purple-800 outline-none bg-white/70 text-slate-900 transition shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                        placeholder="your.email@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/80 focus:border-purple-800 outline-none bg-white/70 text-slate-900 transition shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1">
                        Will You Attend?
                      </label>
                      <select
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/80 focus:border-purple-800 outline-none bg-white/70 text-slate-900 transition"
                      >
                        <option value="Attending">Joyfully Attending</option>
                        <option value="Declining">Regretfully Declining</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || submitted}
                      className="w-full bg-gradient-to-r from-purple-950 to-sky-800 hover:opacity-95 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-[11px] transition shadow-md disabled:opacity-50 mt-3 flex items-center justify-center gap-2 font-garamond"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{loading ? "Recording RSVP..." : "Confirm RSVP ✨"}</span>
                    </button>
                  </form>
                )}
              </section>

              {/* Footer */}
              <footer className="mt-8 pt-4 text-center relative font-garamond">
                <p className="text-2xl font-calligraphy text-purple-950 font-normal">
                  Chan Hadassah & Jim Gitu
                </p>
                <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-garamond">
                  GracePoint Church, Kikuyu • October 30, 2026
                </p>
              </footer>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
