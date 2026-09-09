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
  Gift,
  Send,
  Volume2,
  VolumeX,
  Camera,
  UploadCloud,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function RoyalScrollWeddingInvite() {
  const [sealBroken, setSealBroken] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [attendance, setAttendance] = useState("Attending");
  const [guestMessage, setGuestMessage] = useState("");

  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Audio State (Nakupenda Msichana - Kichwatah)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const ytPlayerRef = useRef<any>(null);

  // Guest-Uploaded Photos Storage
  const [guestPhotos, setGuestPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // 1. YouTube Audio Player Setup
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
            event.target.setVolume(50);
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

      // Load existing guest photos from localStorage
      const savedPhotos = localStorage.getItem("cj_guest_snaps");
      if (savedPhotos) {
        try {
          setGuestPhotos(JSON.parse(savedPhotos));
        } catch {}
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

  // 4. Handle Breaking the Royal Seal
  const breakSeal = () => {
    setSealBroken(true);
    if (ytPlayerRef.current && ytPlayerRef.current.playVideo) {
      ytPlayerRef.current.playVideo();
      setIsPlayingMusic(true);
    }
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

  // 5. Crowdsourced Guest Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setGuestPhotos((prev) => {
            const updated = [event.target!.result as string, ...prev];
            try {
              localStorage.setItem("cj_guest_snaps", JSON.stringify(updated.slice(0, 15)));
            } catch {}
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
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

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;
    setLoading(true);

    const params = new URLSearchParams({
      name: guestName.trim() || "Guest",
      email: guestEmail.trim() || "",
      attendance: attendance || "Attending",
      guestCount: "1",
      message: guestMessage.trim() || ""
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
    <div className="min-h-screen bg-[#f5efe6] text-slate-900 font-serif relative overflow-x-hidden antialiased selection:bg-purple-200">
      
      {/* Background YouTube Audio */}
      <div id="yt-player" style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: -10 }} />

      {/* Hidden File Input for Guest Camera Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        multiple
        capture="environment"
        style={{ display: "none" }}
      />

      {/* Floating Liquid Glass Music Pill */}
      {sealBroken && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleMusic}
            className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-sans font-semibold text-purple-950 hover:bg-white/80 transition ring-1 ring-amber-300/40"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-4 h-4 text-purple-700 animate-pulse" />
                <span className="hidden sm:inline">Playing Music</span>
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
      )}

      {/* Floating Botanical Background Watermarks */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25 overflow-hidden">
        <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300 via-purple-300 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-purple-300 via-sky-200 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/4 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-amber-200 via-purple-200 to-transparent blur-3xl"></div>
      </div>

      {/* ==================================================================== */}
      {/* 1. ROYAL SEAL GATE (THE KING'S CREST TO UNROLL THE SCROLL)          */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {!sealBroken && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#160e29]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center text-amber-50"
          >
            {/* Royal Gold Header */}
            <p className="text-[11px] font-sans uppercase tracking-[0.45em] text-amber-300/90 font-bold mb-4">
              By Royal Decree & Holy Covenant
            </p>

            <h2 className="text-4xl sm:text-5xl font-serif text-white mb-2 tracking-wide font-normal">
              Chan <span className="text-sky-300 italic">&</span> Jim
            </h2>
            <p className="text-xs text-amber-200/80 uppercase tracking-widest font-sans mb-8">
              GracePoint Church, Kikuyu • October 30, 2026
            </p>

            {/* THE IMPERIAL GOLD & WAX SEAL SHIELD */}
            <div className="relative mb-10 group">
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-1.5 shadow-[0_0_60px_rgba(245,158,11,0.5)] flex items-center justify-center animate-pulse">
                <div className="w-full h-full rounded-full bg-[#581c2f] border-4 border-amber-300/80 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                  
                  {/* Subtle Wax Pattern Texture */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                  
                  {/* Embossed Royal Monogram */}
                  <span className="text-4xl font-serif text-amber-300 font-bold tracking-tighter drop-shadow-md">
                    H & G
                  </span>
                  <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-amber-200 font-semibold mt-1">
                    SEALED
                  </span>
                </div>
              </div>
            </div>

            {/* Swipe to Break Seal Slider */}
            <div className="w-full max-w-xs bg-white/10 backdrop-blur-xl border border-amber-300/40 rounded-full p-1.5 relative flex items-center shadow-2xl">
              <div 
                className="h-11 bg-gradient-to-r from-amber-400 to-amber-200 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider rounded-full flex items-center px-4 shadow-lg cursor-pointer active:scale-95 transition-all"
                style={{ width: `${Math.max(48, sliderPosition)}%` }}
                onClick={breakSeal}
              >
                <ChevronRight className="w-5 h-5 mr-1 animate-ping" />
                <span className="whitespace-nowrap">Swipe or Tap to Open</span>
              </div>
              <span className="absolute right-6 text-[10px] uppercase tracking-widest text-amber-200 font-sans font-semibold pointer-events-none opacity-60">
                Break Seal 📜
              </span>
            </div>

            <p className="text-amber-200/60 text-xs font-sans mt-6 tracking-widest">
              Tap to break the seal and unroll the wedding scroll
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 2. THE GRAND UNROLLED SCROLL WITH WOVEN SPIRAL GLASS BINDINGS        */}
      {/* ==================================================================== */}
      <div className="relative min-h-screen py-10 px-3 sm:px-6 flex flex-col items-center justify-center z-10">
        
        {/* Personal Welcome Banner */}
        {guestName && (
          <aside className="w-full max-w-xl text-center mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-purple-950 font-sans font-semibold bg-white/80 backdrop-blur-xl px-6 py-2 rounded-full border border-amber-300/60 shadow-md inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Karibu Sana, {guestName}
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            </span>
          </aside>
        )}

        {/* TOP SCROLL ROLLER ROD (Turned Brass & Gilded Wood) */}
        <div className="w-full max-w-2xl h-8 bg-gradient-to-r from-[#5a3818] via-[#a37038] to-[#5a3818] rounded-full border-2 border-amber-300/80 shadow-[0_15px_30px_rgba(0,0,0,0.3)] relative flex items-center justify-between px-3 z-30">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 border border-amber-600 shadow" />
          <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 border border-amber-600 shadow" />
        </div>

        {/* ==================== SECTION 1: THE TITLE CARD ==================== */}
        <section className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl border-x-4 border-amber-300/70 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-14 text-center relative overflow-hidden -mt-2">
          
          {/* Top Luxurious Botanical Flower Garden Crest */}
          <div className="w-full flex justify-center mb-6">
            <svg className="w-80 h-24 text-purple-950" viewBox="0 0 320 90" fill="none">
              <path d="M 20 50 C 90 20, 230 20, 300 50" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" />
              
              {/* Deep Royal Purple Center Roses */}
              <circle cx="160" cy="32" r="16" fill="#4a044e" />
              <circle cx="160" cy="32" r="12" fill="#701a75" />
              <circle cx="160" cy="32" r="6" fill="#fdf4ff" />

              {/* Lilac Flowers */}
              <circle cx="125" cy="40" r="11" fill="#c084fc" opacity="0.95" />
              <circle cx="125" cy="40" r="6" fill="#faf5ff" />
              <circle cx="195" cy="40" r="11" fill="#c084fc" opacity="0.95" />
              <circle cx="195" cy="40" r="6" fill="#faf5ff" />

              {/* Sky Blue Garden Flowers */}
              <circle cx="95" cy="46" r="10" fill="#38bdf8" opacity="0.95" />
              <circle cx="95" cy="46" r="5" fill="#f0f9ff" />
              <circle cx="225" cy="46" r="10" fill="#38bdf8" opacity="0.95" />
              <circle cx="225" cy="46" r="5" fill="#f0f9ff" />

              {/* Deep Lavender & Sky Buds */}
              <circle cx="68" cy="52" r="6" fill="#581c87" />
              <circle cx="252" cy="52" r="6" fill="#581c87" />
              <circle cx="45" cy="53" r="4" fill="#0284c7" />
              <circle cx="275" cy="53" r="4" fill="#0284c7" />

              {/* Gold Foliage */}
              <ellipse cx="142" cy="25" rx="5" ry="8" fill="#d4af37" transform="rotate(-30 142 25)" />
              <ellipse cx="178" cy="25" rx="5" ry="8" fill="#d4af37" transform="rotate(30 178 25)" />
            </svg>
          </div>

          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.35em] text-slate-600 font-semibold mb-4 leading-relaxed">
            Together with our families,<br />we invite you to celebrate our wedding
          </p>

          {/* HUGE VISIBLE CALLIGRAPHY NAMES */}
          <div className="py-4 border-y-2 border-amber-200/90 my-4 bg-white/40 rounded-3xl p-6 shadow-sm">
            <h1 className="text-4xl sm:text-6xl text-purple-950 font-normal leading-tight tracking-tight drop-shadow-sm">
              Chan Hadassah Njoki
            </h1>
            <div className="text-4xl sm:text-5xl text-sky-600 italic my-3 font-light">
              &
            </div>
            <h1 className="text-4xl sm:text-6xl text-purple-950 font-normal leading-tight tracking-tight drop-shadow-sm">
              Jim Njuguna Gitu
            </h1>
          </div>

          {/* STANDOUT SCRIPTURE VERSE */}
          <div className="my-6 max-w-md mx-auto bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 shadow-sm">
            <p className="text-lg sm:text-xl italic text-slate-800 leading-relaxed font-medium">
              "We love because He first loved us."
            </p>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-purple-900 font-bold mt-1.5">
              1 John 4:19
            </p>
          </div>
        </section>

        {/* ================= WOVEN SPIRAL WIRE HINGE 1 ================= */}
        <div className="w-full max-w-2xl h-8 flex items-center justify-around px-8 bg-[#fdfbf7] border-x-4 border-amber-300/70 z-20 shadow-inner">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-3 h-8 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md border border-amber-900 transform -rotate-12" />
          ))}
        </div>

        {/* ==================== SECTION 2: DATE & VENUE ==================== */}
        <section className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl border-x-4 border-amber-300/70 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-12 text-center relative overflow-hidden">
          
          <div className="max-w-md mx-auto bg-gradient-to-br from-white/90 to-sky-50/80 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-md">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-purple-950 font-bold block mb-2">
              Ceremony & Celebration
            </span>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide">
              FRIDAY, OCTOBER 30, 2026
            </p>
            <div className="h-[1px] w-28 bg-amber-300 mx-auto my-3" />
            <p className="text-xl sm:text-2xl text-purple-950 font-medium">
              GracePoint Church
            </p>
            <p className="text-sm font-sans text-slate-600 mt-1">
              Kikuyu, Kenya
            </p>

            {/* Countdown Clock */}
            <div className="grid grid-cols-4 gap-2.5 mt-6 font-sans text-center">
              <div className="p-2.5 rounded-2xl bg-white border border-purple-100 shadow-sm">
                <span className="block text-2xl font-serif text-purple-950 font-bold">{timeLeft.days}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Days</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-purple-100 shadow-sm">
                <span className="block text-2xl font-serif text-purple-950 font-bold">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Hours</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-purple-100 shadow-sm">
                <span className="block text-2xl font-serif text-purple-950 font-bold">{timeLeft.mins}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Mins</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-purple-100 shadow-sm">
                <span className="block text-2xl font-serif text-purple-950 font-bold">{timeLeft.secs}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Secs</span>
              </div>
            </div>

            {/* Calendar & Map Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 font-sans text-xs mt-6">
              <button
                onClick={handleDownloadIcs}
                className="inline-flex items-center gap-1.5 text-slate-800 bg-white border border-slate-300 hover:border-purple-600 px-5 py-2.5 rounded-full transition shadow-sm font-medium"
              >
                <CalendarIcon className="w-4 h-4 text-purple-900" />
                <span>Save to Calendar</span>
              </button>
              <a
                href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sky-900 bg-sky-100/80 hover:bg-sky-200 border border-sky-300 px-5 py-2.5 rounded-full transition shadow-sm font-medium"
              >
                <MapPin className="w-4 h-4 text-sky-700" />
                <span>Directions to Church</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================= WOVEN SPIRAL WIRE HINGE 2 ================= */}
        <div className="w-full max-w-2xl h-8 flex items-center justify-around px-8 bg-[#fdfbf7] border-x-4 border-amber-300/70 z-20 shadow-inner">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-3 h-8 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md border border-amber-900 transform -rotate-12" />
          ))}
        </div>

        {/* ==================== SECTION 3: BE OUR PHOTOGRAPHER ==================== */}
        <section className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl border-x-4 border-amber-300/70 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-12 text-center relative overflow-hidden">
          
          <div className="max-w-md mx-auto text-center font-sans">
            <span className="text-[11px] uppercase tracking-[0.3em] text-purple-900 font-bold block mb-1">
              Guest Photo Album
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-purple-950 font-normal mb-2">
              Be Our Wedding Photographer 📸
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-serif italic">
              "We want to see our day through your eyes! Snap candids, blessings, and memories throughout the celebration and add them to our album."
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900 via-purple-800 to-sky-800 text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-full shadow-lg hover:opacity-95 transition active:scale-95"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Tap to Snap & Upload Photo</span>
            </button>

            {/* Polaroid Masonry Stream */}
            {guestPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 text-left">
                {guestPhotos.map((imgSrc, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-xl shadow-md border border-amber-200 transform hover:rotate-0 transition duration-300 rotate-1">
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100">
                      <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-serif text-slate-500 mt-1 text-center italic">
                      Captured with Love
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= WOVEN SPIRAL WIRE HINGE 3 ================= */}
        <div className="w-full max-w-2xl h-8 flex items-center justify-around px-8 bg-[#fdfbf7] border-x-4 border-amber-300/70 z-20 shadow-inner">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-3 h-8 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md border border-amber-900 transform -rotate-12" />
          ))}
        </div>

        {/* ==================== SECTION 4: GIFTS & BLESSINGS ==================== */}
        <section className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl border-x-4 border-amber-300/70 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-12 text-center relative overflow-hidden">
          
          <div className="max-w-md mx-auto text-center font-sans">
            <span className="text-[11px] uppercase tracking-[0.3em] text-purple-900 font-bold block mb-2">
              Love & Blessings
            </span>
            <p className="font-serif italic text-slate-700 text-sm leading-relaxed mb-6">
              "Your presence, love, and prayers on our special day are the greatest gifts of all. If you would like to bless us with a wedding gift as we begin our new home together, your contribution is warmly appreciated."
            </p>

            {/* M-PESA Card with Lily Kyalo */}
            <div className="p-6 rounded-3xl bg-white/80 border-2 border-emerald-300/80 shadow-md text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> M-PESA Gifting Details
                </span>
                <Gift className="w-4 h-4 text-emerald-700" />
              </div>

              <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider my-1">0704656076</p>
              <p className="text-xs text-slate-700">
                Account Name: <strong>Lily Kyalo</strong>
              </p>
              <p className="text-[10px] text-slate-400 italic mb-4">
                (Wedding Committee Treasurer / Family Trustee)
              </p>

              <button
                onClick={handleCopyMpesa}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
              >
                {copiedMpesa ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMpesa ? "Copied to Clipboard!" : "Copy M-PESA Number"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= WOVEN SPIRAL WIRE HINGE 4 ================= */}
        <div className="w-full max-w-2xl h-8 flex items-center justify-around px-8 bg-[#fdfbf7] border-x-4 border-amber-300/70 z-20 shadow-inner">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-3 h-8 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md border border-amber-900 transform -rotate-12" />
          ))}
        </div>

        {/* ==================== SECTION 5: RSVP ==================== */}
        <section className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl border-x-4 border-amber-300/70 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-12 text-center relative overflow-hidden -mb-2">
          
          <div className="max-w-md mx-auto text-left font-sans">
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-purple-900 font-bold block mb-1">
                Kindly RSVP
              </span>
              <p className="font-serif italic text-xs text-slate-600">
                Please respond by September 30, 2026
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-sky-50 border-2 border-sky-300 rounded-3xl text-center space-y-1">
                <span className="text-sky-700 text-3xl block mb-1">✓</span>
                <p className="font-serif text-lg text-purple-950 font-medium">
                  Thank you, {guestName || "cherished guest"}!
                </p>
                <p className="text-xs text-slate-600 font-sans">
                  Your response has been saved directly to our Google Sheet. We look forward to celebrating together!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="e.g. Steve Kiteto"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-purple-800 outline-none bg-white text-slate-900 shadow-inner"
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
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-purple-800 outline-none bg-white text-slate-900 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1">
                    Will You Attend?
                  </label>
                  <select
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-purple-800 outline-none bg-white text-slate-900"
                  >
                    <option value="Attending">Joyfully Attending</option>
                    <option value="Declining">Regretfully Declining</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-700 font-bold mb-1">
                    Prayer or Blessing for the Couple
                  </label>
                  <textarea
                    rows={2}
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Leave a word of encouragement..."
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:border-purple-800 outline-none bg-white text-slate-900 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || submitted}
                  className="w-full bg-purple-950 hover:bg-purple-900 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs transition shadow-lg disabled:opacity-50 mt-2"
                >
                  {loading ? "Recording..." : "Confirm RSVP ✨"}
                </button>
              </form>
            )}
          </div>

          {/* Bottom Botanical Garland */}
          <div className="w-full flex justify-center mt-8">
            <svg className="w-56 h-12 text-purple-950 opacity-70" viewBox="0 0 200 40" fill="none">
              <path d="M 10 20 C 60 35, 140 5, 190 20" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="100" cy="20" r="6" fill="#701a75" />
              <circle cx="80" cy="22" r="4.5" fill="#38bdf8" />
              <circle cx="120" cy="18" r="4.5" fill="#c084fc" />
            </svg>
          </div>
        </section>

        {/* BOTTOM SCROLL ROLLER ROD (Turned Brass & Gilded Wood) */}
        <div className="w-full max-w-2xl h-8 bg-gradient-to-r from-[#5a3818] via-[#a37038] to-[#5a3818] rounded-full border-2 border-amber-300/80 shadow-[0_15px_30px_rgba(0,0,0,0.3)] relative flex items-center justify-between px-3 z-30 -mt-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 border border-amber-600 shadow" />
          <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 border border-amber-600 shadow" />
        </div>

        {/* Understated Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 font-sans">
          Chan Hadassah Njoki & Jim Njuguna Gitu • October 30, 2026 • GracePoint Church, Kikuyu
        </footer>
      </div>
    </div>
  );
}
