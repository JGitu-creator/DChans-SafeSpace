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
  
  // Streamlined RSVP Form States (No Prayer Note)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [attendance, setAttendance] = useState("Attending");

  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Audio State for "Nakupenda Msichana" by Kichwatah (MUTED BY DEFAULT)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const ytPlayerRef = useRef<any>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Touch Swipe Gesture Tracking
  const touchStartY = useRef<number | null>(null);

  // 1. YouTube Background Player (Starts Strictly Muted)
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

  // 4. Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = Math.abs(touchEndY - touchStartY.current);
    if (diff > 40) {
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
      "SUMMARY:Wedding of Chan Hadassah Njoki & Jim Njuguna Gitu",
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

  // 5. Clean, Single-Beacon RSVP Submission (No Prayer Note)
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
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-800 flex flex-col items-center justify-center p-3 sm:p-6 antialiased selection:bg-purple-200 relative overflow-x-hidden font-serif">
      
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

      {/* Hidden YouTube Iframe for Music */}
      <div id="yt-player" style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: -10 }} />

      {/* Floating Music Widget (Starts Muted) */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="bg-white/85 backdrop-blur-md border border-amber-300 shadow-md px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-garamond font-semibold text-purple-950 hover:bg-white transition"
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
        <aside className="w-full max-w-xl text-center mb-3">
          <span className="text-xs uppercase tracking-[0.25em] text-purple-950 font-garamond font-semibold bg-white/75 px-5 py-1.5 rounded-full border border-amber-200 shadow-sm inline-flex items-center gap-2">
            <span className="text-purple-600">❀</span>
            Karibu Sana, {guestName}
            <span className="text-sky-600">❀</span>
          </span>
        </aside>
      )}

      {/* ================= WEDDING SCROLL CONTAINER ================= */}
      <div 
        className="w-full max-w-xl relative flex flex-col items-center select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* ================= 1. SEALED SCROLL COVER ================= */}
        <AnimatePresence>
          {!unrolled && (
            <motion.div 
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scaleY: 0.8, y: -20 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="w-full bg-[#fffdfa] rounded-[2.5rem] border-2 border-amber-300 shadow-2xl p-8 sm:p-14 text-center relative overflow-hidden z-30 cursor-pointer"
              onClick={() => setUnrolled(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-transparent to-amber-50/40 pointer-events-none" />

              <p className="font-garamond text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-500 font-medium mb-3">
                Together with our families
              </p>
              
              <p className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-900 font-semibold mb-6">
                We Invite You To Celebrate The Wedding Of
              </p>

              {/* Names in Calligraphy (Cover) */}
              <div className="py-3 space-y-1">
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Chan Hadassah Njoki
                </h1>
                <div className="text-3xl font-garamond italic text-amber-600 my-1 font-light">
                  &
                </div>
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Jim Njuguna Gitu
                </h1>
              </div>

              {/* Wax Seal Monogram */}
              <div className="my-8 flex flex-col items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-1 shadow-[0_0_35px_rgba(212,175,55,0.4)] flex items-center justify-center border-2 border-white"
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
                
                <p className="font-garamond text-xs uppercase tracking-[0.25em] text-amber-800 font-semibold mt-4 animate-pulse">
                  Tap or Swipe to Open Scroll 📜
                </p>
              </div>

              <p className="font-garamond italic text-slate-500 text-xs">
                Friday, October 30, 2026 • GracePoint Church, Kikuyu
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= 2. UNROLLED WEDDING CARD ================= */}
        <AnimatePresence>
          {unrolled && (
            <motion.main 
              initial={{ opacity: 0, scaleY: 0.85, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="w-full bg-[#fffdfa] rounded-[2.5rem] border-2 border-amber-200/90 shadow-[0_25px_60px_-15px_rgba(90,60,30,0.18)] p-6 sm:p-12 text-center relative overflow-hidden z-20 font-garamond"
            >
              
              {/* ================= REALISTIC LUSH BOTANICAL BOUQUET HEADER (MATCHING YOUR PHOTO) ================= */}
              <div className="w-full flex justify-center mb-6">
                <svg className="w-88 h-32 text-purple-950" viewBox="0 0 380 120" fill="none">
                  {/* Flowing Gold Foliage Branches */}
                  <path d="M 30 75 C 110 35, 270 35, 350 75" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 50 70 C 130 45, 250 45, 330 70" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="3 3" />

                  {/* Eucalyptus & Sage Green Leaves */}
                  <path d="M 120 40 C 105 25, 95 35, 105 50 C 115 48, 118 42, 120 40 Z" fill="#4d7c0f" opacity="0.85" />
                  <path d="M 260 40 C 275 25, 285 35, 275 50 C 265 48, 262 42, 260 40 Z" fill="#4d7c0f" opacity="0.85" />
                  <path d="M 85 55 C 70 45, 65 55, 75 68 C 82 65, 84 58, 85 55 Z" fill="#15803d" opacity="0.8" />
                  <path d="M 295 55 C 310 45, 315 55, 305 68 C 298 65, 296 58, 295 55 Z" fill="#15803d" opacity="0.8" />

                  {/* Sky-Blue Hydrangea Clusters (Left & Right Flanks) */}
                  <g transform="translate(100, 62)">
                    <path d="M -15 -5 C -25 -15, -5 -25, 0 -15 C 5 -25, 25 -15, 15 -5 C 25 5, 5 25, 0 15 C -5 25, -25 5, -15 -5 Z" fill="#7dd3fc" />
                    <circle cx="-6" cy="-4" r="5" fill="#38bdf8" />
                    <circle cx="6" cy="-4" r="5" fill="#38bdf8" />
                    <circle cx="0" cy="5" r="5" fill="#0284c7" />
                    <circle cx="0" cy="0" r="2" fill="#ffffff" />
                  </g>
                  <g transform="translate(280, 62)">
                    <path d="M -15 -5 C -25 -15, -5 -25, 0 -15 C 5 -25, 25 -15, 15 -5 C 25 5, 5 25, 0 15 C -5 25, -25 5, -15 -5 Z" fill="#7dd3fc" />
                    <circle cx="-6" cy="-4" r="5" fill="#38bdf8" />
                    <circle cx="6" cy="-4" r="5" fill="#38bdf8" />
                    <circle cx="0" cy="5" r="5" fill="#0284c7" />
                    <circle cx="0" cy="0" r="2" fill="#ffffff" />
                  </g>

                  {/* Cream & Ivory Peony Rose (Soft Center Left) */}
                  <g transform="translate(145, 52)">
                    <ellipse cx="0" cy="0" rx="20" ry="18" fill="#fef3c7" />
                    <path d="M -12 -5 C -16 -12, -4 -16, 0 -10 C 4 -16, 16 -12, 12 -5 C 16 2, 8 10, 0 12 C -8 10, -16 2, -12 -5 Z" fill="#fffbeb" />
                    <circle cx="0" cy="0" r="5" fill="#fde68a" />
                  </g>

                  {/* Soft Lilac & Lavender Garden Rose (Soft Center Right) */}
                  <g transform="translate(235, 52)">
                    <ellipse cx="0" cy="0" rx="20" ry="18" fill="#e9d5ff" />
                    <path d="M -12 -5 C -16 -12, -4 -16, 0 -10 C 4 -16, 16 -12, 12 -5 C 16 2, 8 10, 0 12 C -8 10, -16 2, -12 -5 Z" fill="#d8b4fe" />
                    <circle cx="0" cy="0" r="6" fill="#c084fc" />
                  </g>

                  {/* Center Deep Royal Purple Grand Rose */}
                  <g transform="translate(190, 46)">
                    <path d="M -24 -10 C -34 -24, -14 -36, 0 -26 C 14 -36, 34 -24, 24 -10 C 32 6, 16 26, 0 28 C -16 26, -32 6, -24 -10 Z" fill="#4a044e" />
                    <path d="M -16 -6 C -24 -16, -10 -24, 0 -18 C 10 -24, 24 -16, 16 -6 C 22 4, 10 18, 0 19 C -10 18, -22 4, -16 -6 Z" fill="#6b21a8" />
                    <path d="M -8 -3 C -13 -9, -5 -14, 0 -10 C 5 -14, 13 -9, 8 -3 C 11 2, 5 10, 0 10 C -5 10, -11 2, -8 -3 Z" fill="#d8b4fe" />
                    <circle cx="0" cy="0" r="3" fill="#faf5ff" />
                  </g>

                  {/* Gold Leaf Accents */}
                  <path d="M 170 30 C 165 20, 155 22, 158 32 Z" fill="#d4af37" />
                  <path d="M 210 30 C 215 20, 225 22, 222 32 Z" fill="#d4af37" />
                </svg>
              </div>

              {/* Top Invitation Line */}
              <p className="font-garamond text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-6 leading-relaxed">
                Together with our families,<br />we invite you to celebrate our wedding
              </p>

              {/* NAMES: Calligraphy */}
              <div className="py-2 space-y-1">
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Chan Hadassah Njoki
                </h1>
                <div className="text-3xl font-garamond italic text-amber-600 font-light my-2">
                  &
                </div>
                <h1 className="text-5xl sm:text-6xl font-calligraphy text-purple-950 font-normal leading-none drop-shadow-sm">
                  Jim Njuguna Gitu
                </h1>
              </div>

              {/* Scripture Verse: 1 John 4:19 */}
              <div className="my-6 border-y border-amber-200 py-4 max-w-sm mx-auto bg-amber-50/30 rounded-2xl px-4 shadow-sm">
                <p className="italic text-slate-800 text-base sm:text-lg leading-relaxed">
                  "We love because He first loved us."
                </p>
                <p className="font-garamond text-xs uppercase tracking-widest text-purple-900 font-bold mt-1.5">
                  1 John 4:19
                </p>
              </div>

              {/* Details Capsule (WHO, WHAT, WHEN, WHERE) */}
              <div className="my-6 p-6 rounded-3xl bg-[#faf7f2] border border-amber-200 shadow-sm max-w-sm mx-auto">
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
                <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.days}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Days</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.hours}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Hours</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.mins}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Mins</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
                  <span className="block text-xl sm:text-2xl font-bold text-purple-950">{timeLeft.secs}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Secs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 font-garamond text-xs mb-8">
                <button
                  onClick={handleDownloadIcs}
                  className="inline-flex items-center gap-1.5 text-slate-700 bg-white border border-amber-200 hover:border-amber-400 px-4 py-2 rounded-full transition shadow-sm"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-purple-900" />
                  <span>Save to Calendar</span>
                </button>
                <a
                  href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-800 bg-sky-50 border border-sky-200 hover:bg-sky-100 px-4 py-2 rounded-full transition shadow-sm font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>GracePoint Directions</span>
                </a>
              </div>

              {/* ================= BE OUR WEDDING PHOTOGRAPHER (GOOGLE PHOTOS QR CODE) ================= */}
              <section className="my-8 p-6 rounded-3xl bg-[#faf7f2] border border-amber-200 shadow-sm max-w-sm mx-auto">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-sky-100 text-sky-800 mb-2 shadow-inner">
                  <Camera className="w-5 h-5" />
                </div>
                
                <h3 className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-950 font-bold mb-1">
                  Be Our Wedding Photographer!
                </h3>
                
                <p className="italic text-slate-700 text-xs max-w-xs mx-auto leading-relaxed mb-4">
                  "Capture our day through your eyes! Scan the code or tap the button to upload wedding photos directly into our shared Google Album."
                </p>

                {/* Scannable QR Code */}
                <div className="my-3 p-3 bg-white rounded-2xl border border-amber-200 shadow-md inline-block max-w-[170px] mx-auto">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=58-28-135&data=https%3A%2F%2Fphotos.app.goo.gl%2FRnGz5kPM74uaZUQL8" 
                    alt="Scan to add photos" 
                    className="w-32 h-32 mx-auto rounded-lg"
                  />
                  <p className="font-garamond text-[10px] text-slate-400 mt-1.5 uppercase tracking-widest font-semibold">
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

              {/* ================= WEDDING GIFTS & BLESSINGS ================= */}
              <section className="my-8 p-6 rounded-3xl bg-[#faf7f2] border border-amber-200 shadow-sm max-w-sm mx-auto">
                <span className="font-garamond text-xs uppercase tracking-[0.25em] text-purple-950 font-bold block mb-2">
                  Wedding Gifts & Blessings
                </span>
                
                <p className="italic text-slate-700 text-xs max-w-xs mx-auto leading-relaxed mb-4">
                  "Your presence, love, and prayers on our special day are the greatest gifts of all. If you would like to bless us with a wedding gift as we begin our new home, cash gifts are warmly appreciated."
                </p>

                {/* M-PESA Box */}
                <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm text-left font-garamond">
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

              {/* ================= CLEAN, MINIMAL RSVP (NO PRAYER NOTE) ================= */}
              <section className="my-8 p-6 rounded-3xl bg-[#faf7f2] border border-amber-200 shadow-sm max-w-sm mx-auto text-left">
                <div className="text-center mb-5">
                  <h3 className="font-garamond text-xs uppercase tracking-[0.25em] text-slate-500 font-bold mb-1">
                    Kindly Respond
                  </h3>
                  <p className="italic text-xs text-slate-500">
                    Please RSVP by September 30, 2026
                  </p>
                </div>

                {submitted ? (
                  <div className="p-5 bg-sky-50 border border-sky-200 rounded-2xl text-center space-y-1">
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-800 outline-none bg-white text-slate-900 transition shadow-inner"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-800 outline-none bg-white text-slate-900 transition shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1">
                        Will You Attend?
                      </label>
                      <select
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-800 outline-none bg-white text-slate-900 transition"
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

              {/* ================= FOOTER ================= */}
              <footer className="mt-8 pt-4 text-center relative font-garamond">
                <p className="text-2xl font-calligraphy text-purple-950 font-normal">
                  Chan Hadassah Njoki & Jim Njuguna Gitu
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
