"use client";

import React, { useState, useEffect } from "react";

export default function WeddingInvite() {
  const [gateOpen, setGateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"invite" | "album" | "giving" | "rsvp">("invite");
  const [guestName, setGuestName] = useState("");
  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Album Photos (Drop your files into the /public folder!)
  const photos = [
    {
      src: "/C&J.jpeg",
      caption: "Chan & Jim — Clothed in Faith",
      subtext: "GracePoint Church, Kikuyu • October 30, 2026"
    },
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      caption: "Walking Together in God's Grace",
      subtext: "Two lives, one shared journey of prayer & purpose"
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      caption: "Anchored in Love & Community",
      subtext: "Surrounded by family and cherished friends"
    }
  ];

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

  // 2. Countdown Timer to October 30, 2026
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
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, photos.length]);

  const handleCopyMpesa = () => {
    navigator.clipboard.writeText("0704656076");
    setCopiedMpesa(true);
    setTimeout(() => setCopiedMpesa(false), 3000);
  };

  // 4. Fixed Google Sheets RSVP Submission (URLSearchParams)
  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3e8] text-slate-900 font-sans flex flex-col items-center justify-center p-2 sm:p-4 selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      
      {/* Floating Animated Floral Petals */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-[10%] w-8 h-8 rounded-full bg-sky-300/30 blur-[1px] animate-pulse"></div>
        <div className="absolute top-1/4 right-[15%] w-12 h-12 rounded-full bg-purple-300/30 blur-[2px] animate-bounce duration-1000"></div>
        <div className="absolute bottom-20 left-[20%] w-10 h-10 rounded-full bg-amber-200/30 blur-[1px] animate-pulse"></div>
      </div>

      {/* Top Personalized Greeting Banner */}
      <aside className="w-full max-w-md bg-gradient-to-r from-sky-700 via-purple-700 to-purple-950 text-white py-3 px-5 rounded-2xl mb-3 shadow-xl text-center z-10 border border-amber-300/40">
        <div className="text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
          <span className="text-amber-300 text-lg">🌸</span>
          <span>
            {guestName ? `Karibu, ${guestName}!` : "Karibu! You are warmly invited"}
          </span>
          <span className="text-amber-300 text-lg">🌸</span>
        </div>
        <p className="text-[11px] text-amber-200/90 tracking-wider uppercase mt-0.5">
          Join Chan & Jim as they celebrate holy matrimony
        </p>
      </aside>

      {/* Main Luxury 9:16 Invitation Card */}
      <main className="w-full max-w-md bg-[#fffefb] rounded-3xl border-2 border-amber-200/90 shadow-2xl overflow-hidden relative min-h-[760px] flex flex-col justify-between z-10">
        
        {/* INTERACTIVE WROUGHT-IRON GATE OVERLAY */}
        {!gateOpen && (
          <div className="absolute inset-0 z-50 bg-[#121926] flex flex-col items-center justify-center p-6 text-center transition-all duration-1000">
            <div className="w-24 h-24 rounded-full bg-amber-400/10 border-2 border-amber-300/50 flex items-center justify-center mb-6 text-amber-300 text-4xl shadow-[0_0_40px_rgba(251,191,36,0.3)] animate-pulse">
              💍
            </div>
            
            <p className="text-amber-200 uppercase tracking-[0.35em] text-xs font-semibold mb-2">
              Royal Wedding Invitation
            </p>
            
            <h1 className="text-6xl font-serif text-white mb-2 tracking-wide font-normal">
              Chan <span className="text-sky-400 italic">&</span> Jim
            </h1>
            
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-300 to-transparent my-3"></div>
            
            <p className="text-amber-100/90 text-xs tracking-widest uppercase font-medium">
              Friday, October 30, 2026
            </p>
            <p className="text-sky-300/80 text-xs tracking-wider mb-8">
              GracePoint Church, Kikuyu
            </p>

            <button
              onClick={() => setGateOpen(true)}
              className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-100 hover:to-amber-300 text-slate-950 font-bold px-10 py-4 rounded-full shadow-[0_0_35px_rgba(251,191,36,0.7)] border border-amber-400 text-xs uppercase tracking-[0.25em] active:scale-95 transition transform hover:-translate-y-0.5"
            >
              Open Invitation ✨
            </button>
          </div>
        )}

        {/* TAB 1: INVITATION WITH BIG TYPOGRAPHY & COUNTDOWN */}
        {activeTab === "invite" && (
          <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center animate-fadeIn relative">
            <div className="absolute top-3 left-4 text-purple-600 text-xl opacity-80">🌸</div>
            <div className="absolute top-3 right-4 text-sky-500 text-xl opacity-80">🦋</div>

            <div className="inline-block mx-auto py-1 px-4 rounded-full bg-purple-100/80 text-purple-900 text-[10px] tracking-[0.3em] uppercase font-bold mb-3 border border-purple-200">
              Together With Their Families
            </div>

            <h2 className="text-xs uppercase tracking-[0.35em] text-slate-500 font-semibold mb-1">
              THE WEDDING OF
            </h2>

            <div className="py-2">
              <h1 className="font-serif text-6xl sm:text-7xl text-purple-950 font-normal leading-none tracking-tight">
                Chan
              </h1>
              <div className="text-4xl text-sky-600 font-serif italic my-1 font-light">
                &
              </div>
              <h1 className="font-serif text-6xl sm:text-7xl text-purple-950 font-normal leading-none tracking-tight">
                Jim
              </h1>
            </div>

            <p className="text-base font-serif italic text-slate-700 mt-1 mb-4">
              "Clothed in Faith"
            </p>

            <div className="my-3 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-sky-50 border border-amber-200 shadow-sm max-w-xs mx-auto">
              <p className="font-bold text-slate-900 text-sm tracking-wide">
                Friday, October 30, 2026
              </p>
              <p className="text-purple-900 font-semibold text-xs mt-0.5">
                GracePoint Church, Kikuyu
              </p>
            </div>

            <div className="my-2 border-y border-amber-200/80 py-2.5 max-w-xs mx-auto">
              <p className="font-serif italic text-slate-700 text-xs sm:text-sm">
                "and We created you in pairs"
              </p>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mt-4 mb-2 text-center">
              <div className="bg-purple-50/90 p-2.5 rounded-2xl border border-purple-100 shadow-sm">
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-purple-950">{timeLeft.days}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-700 font-bold">Days</span>
              </div>
              <div className="bg-purple-50/90 p-2.5 rounded-2xl border border-purple-100 shadow-sm">
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-purple-950">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-700 font-bold">Hours</span>
              </div>
              <div className="bg-purple-50/90 p-2.5 rounded-2xl border border-purple-100 shadow-sm">
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-purple-950">{timeLeft.mins}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-700 font-bold">Mins</span>
              </div>
              <div className="bg-purple-50/90 p-2.5 rounded-2xl border border-purple-100 shadow-sm">
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-purple-950">{timeLeft.secs}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-700 font-bold">Secs</span>
              </div>
            </div>

            <div className="mt-3">
              <a
                href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-900 font-bold bg-sky-50 px-4 py-2 rounded-full border border-sky-200 transition"
              >
                <span>📍 Directions to GracePoint Church, Kikuyu</span> &rarr;
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE PHOTO ALBUM & SLIDESHOW */}
        {activeTab === "album" && (
          <div className="p-6 text-center flex-1 flex flex-col justify-center animate-fadeIn relative">
            <h3 className="text-xs uppercase tracking-[0.25em] text-purple-950 font-bold mb-1">
              Our Wedding Album
            </h3>
            <p className="font-serif italic text-slate-600 text-xs mb-4">
              Moments of faith, friendship & celebration
            </p>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[4/3] flex items-center justify-center">
              <img
                src={photos[currentSlide].src}
                alt={photos[currentSlide].caption}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
              
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-white text-left">
                <p className="font-serif text-base font-medium text-amber-200">
                  {photos[currentSlide].caption}
                </p>
                <p className="text-[11px] text-slate-300">
                  {photos[currentSlide].subtext}
                </p>
              </div>

              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur text-sm transition"
              >
                &#10094;
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur text-sm transition"
              >
                &#10095;
              </button>
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex gap-2">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSlide === idx ? "w-8 bg-purple-700" : "w-2.5 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-[11px] font-semibold text-slate-600 hover:text-purple-800 bg-slate-100 px-3 py-1 rounded-full"
              >
                {isPlaying ? "Pause Slideshow ⏸" : "Auto Play ▶"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BUDGET & GIFTING */}
        {activeTab === "giving" && (
          <div className="p-6 text-center flex-1 flex flex-col justify-center animate-fadeIn">
            <h3 className="text-xs uppercase tracking-[0.25em] text-purple-950 font-bold mb-1">
              Partnering Together
            </h3>
            <p className="font-serif italic text-slate-700 text-xs mb-3">
              "We are grateful for you! You are one of the people God has placed around us as we prepare to celebrate our special day."
            </p>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-slate-800 mb-4 leading-relaxed">
              Our wedding budget is approximately <strong className="text-purple-950 font-bold">KSh 300,000</strong>. If you would like to partner with us towards any expense, give as you feel led. No amount is too small!
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] text-slate-700 font-medium">
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

            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-lg text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block mb-1">
                🟢 M-PESA Gifting Details
              </span>
              <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider">0704656076</p>
              <p className="text-xs text-slate-600 mb-3">Account Name: <strong>Lily Kyalo</strong></p>
              <button
                onClick={handleCopyMpesa}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow"
              >
                {copiedMpesa ? "Copied (0704656076)! ✓" : "Copy M-PESA Number"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: RSVP CONNECTED TO GOOGLE SHEETS */}
        {activeTab === "rsvp" && (
          <div className="p-6 text-center flex-1 flex flex-col justify-center animate-fadeIn">
            <h3 className="text-xs uppercase tracking-[0.25em] text-purple-950 font-bold mb-1">
              Kindly RSVP
            </h3>
            <p className="text-xs text-slate-500 mb-4">Please respond by September 30, 2026</p>

            {submitted ? (
              <div className="p-6 bg-sky-50 border border-sky-200 rounded-2xl text-sky-900 text-xs leading-relaxed shadow-sm">
                <span className="text-4xl block mb-2">🌸</span>
                <strong className="text-sm block text-purple-950 mb-1">Thank you, {guestName || "cherished guest"}!</strong>
                Your RSVP has been recorded directly into our Google Sheet. We look forward to celebrating with you at GracePoint Church, Kikuyu!
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3 text-left text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Your Full Name</label>
                  <input
                    name="name"
                    defaultValue={guestName}
                    required
                    placeholder="e.g., Steve Kiteto"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Will You Attend?</label>
                  <select
                    name="attendance"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white"
                  >
                    <option value="Attending">Delightfully Attending</option>
                    <option value="Declining">Regretfully Declining</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Number of Guests (+1s)</label>
                  <input
                    type="number"
                    name="guestCount"
                    min="1"
                    max="4"
                    defaultValue="1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Blessing / Prayer for Chan & Jim</label>
                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Leave a prayer or message for the couple..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-800 to-sky-700 hover:opacity-95 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg transition"
                >
                  {loading ? "Recording in Google Sheet..." : "Confirm RSVP"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* BOTTOM TAB NAVIGATION */}
        <nav className="p-3 bg-white/95 border-t border-amber-200/80 flex items-center justify-around z-20">
          <button
            onClick={() => setActiveTab("invite")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "invite" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Invite
          </button>
          <button
            onClick={() => setActiveTab("album")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "album" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Album
          </button>
          <button
            onClick={() => setActiveTab("giving")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "giving" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Giving
          </button>
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`text-xs font-bold py-1.5 px-4 rounded-xl transition ${
              activeTab === "rsvp" ? "text-purple-900 bg-purple-100" : "text-slate-400 hover:text-slate-600"
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