"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MapPin, 
  Calendar as CalendarIcon, 
  Copy, 
  Check, 
  Sparkles, 
  Gift,
  Send 
} from "lucide-react";

export default function SophisticatedFloralWeddingInvite() {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [attendance, setAttendance] = useState("Attending");
  const [guestMessage, setGuestMessage] = useState("");

  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // 1. Personalized Link Token (?guest=Name)
  useEffect(() => {
    if (typeof window !== "undefined") {
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

  const handleCopyMpesa = () => {
    navigator.clipboard.writeText("0704656076");
    setCopiedMpesa(true);
    setTimeout(() => setCopiedMpesa(false), 3000);
  };

  // 3. Download .ics Calendar Event
  const handleDownloadIcs = () => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Chan and Jim Wedding//EN",
      "BEGIN:VEVENT",
      "UID:chan-jim-wedding-2026",
      "DTSTAMP:20260909T000000Z",
      "DTSTART:20261030T070000Z",
      "DTEND:20261030T150000Z",
      "SUMMARY:Wedding of Chan & Jim",
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

  // 4. RSVP Submission to Google Sheet (Single-Beacon)
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;
    setLoading(true);

    const nameToSend = guestName.trim() || "Guest";
    const emailToSend = guestEmail.trim() || "";
    const attendanceToSend = attendance || "Attending";
    const messageToSend = guestMessage.trim() || "";

    const params = new URLSearchParams({
      name: nameToSend,
      email: emailToSend,
      attendance: attendanceToSend,
      guestCount: "1",
      message: messageToSend
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
    <div className="min-h-screen bg-[#faf7f2] text-slate-800 font-serif flex flex-col items-center justify-center p-3 sm:p-6 antialiased selection:bg-purple-200">
      
      {/* Personalized Welcome Header */}
      {guestName && (
        <div className="w-full max-w-xl text-center mb-3">
          <span className="text-xs uppercase tracking-[0.25em] text-purple-950 font-sans font-semibold bg-white/80 px-5 py-1.5 rounded-full border border-purple-200 shadow-sm inline-flex items-center gap-2">
            <span className="text-purple-600">❀</span>
            Karibu Sana, {guestName}
            <span className="text-sky-600">❀</span>
          </span>
        </div>
      )}

      {/* Main Luxury Botanical Stationery Card */}
      <main className="w-full max-w-xl bg-[#fffefc] rounded-[2.5rem] border-2 border-amber-200 shadow-[0_25px_60px_-15px_rgba(90,60,30,0.15)] p-6 sm:p-12 text-center relative overflow-hidden">
        
        {/* ======================================================== */}
        {/* BOTANICAL FLORAL CREST (Sky Blue, Deep Purple & Lilac)   */}
        {/* ======================================================== */}
        <div className="w-full flex justify-center mb-6">
          <svg className="w-72 h-20 text-purple-950" viewBox="0 0 300 80" fill="none">
            {/* Elegant Flowing Foliage Stem */}
            <path d="M 30 45 C 90 20, 210 20, 270 45" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Deep Royal Purple Center Roses */}
            <circle cx="150" cy="30" r="14" fill="#581c87" />
            <circle cx="150" cy="30" r="10" fill="#7e22ce" />
            <circle cx="150" cy="30" r="5" fill="#f3e8ff" />
            
            {/* Lilac Accent Blossoms */}
            <circle cx="120" cy="36" r="9" fill="#c084fc" opacity="0.9" />
            <circle cx="120" cy="36" r="5" fill="#faf5ff" />
            <circle cx="180" cy="36" r="9" fill="#c084fc" opacity="0.9" />
            <circle cx="180" cy="36" r="5" fill="#faf5ff" />
            
            {/* Sky Blue Garden Flowers */}
            <circle cx="95" cy="42" r="8" fill="#38bdf8" opacity="0.9" />
            <circle cx="95" cy="42" r="4" fill="#f0f9ff" />
            <circle cx="205" cy="42" r="8" fill="#38bdf8" opacity="0.9" />
            <circle cx="205" cy="42" r="4" fill="#f0f9ff" />

            {/* Delicate Sky Blue & Lilac Petal Buds */}
            <circle cx="70" cy="46" r="5" fill="#0284c7" opacity="0.8" />
            <circle cx="230" cy="46" r="5" fill="#0284c7" opacity="0.8" />
            <circle cx="50" cy="47" r="3.5" fill="#c084fc" />
            <circle cx="250" cy="47" r="3.5" fill="#c084fc" />
            
            {/* Soft Gilded Leaves */}
            <ellipse cx="134" cy="24" rx="4" ry="7" fill="#d4af37" transform="rotate(-30 134 24)" />
            <ellipse cx="166" cy="24" rx="4" ry="7" fill="#d4af37" transform="rotate(30 166 24)" />
            <ellipse cx="108" cy="30" rx="3.5" ry="6" fill="#d4af37" transform="rotate(-40 108 30)" />
            <ellipse cx="192" cy="30" rx="3.5" ry="6" fill="#d4af37" transform="rotate(40 192 30)" />
          </svg>
        </div>

        {/* Top Invitation Line ("Hapo Juu") */}
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-slate-500 font-medium mb-4 leading-relaxed">
          Together with our families,<br />we invite you to celebrate our wedding
        </p>

        {/* Couple Names in Classical Luxury Script */}
        <div className="py-2">
          <h1 className="text-6xl sm:text-7xl text-purple-950 font-normal leading-none tracking-tight">
            Chan
          </h1>
          <div className="text-4xl text-sky-600 italic my-2 font-light">
            &
          </div>
          <h1 className="text-6xl sm:text-7xl text-purple-950 font-normal leading-none tracking-tight">
            Jim
          </h1>
        </div>

        {/* Scripture Verse: 1 John 4:19 */}
        <div className="my-6 border-y border-amber-200 py-3.5 max-w-xs mx-auto">
          <p className="italic text-slate-800 text-sm sm:text-base leading-relaxed">
            "We love because He first loved us."
          </p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
            1 John 4:19
          </p>
        </div>

        {/* Date & Location */}
        <div className="my-6 space-y-1">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">
            Date & Venue
          </p>
          <p className="text-xl sm:text-2xl text-slate-900 font-medium">
            Friday, October 30, 2026
          </p>
          <p className="text-base sm:text-lg text-purple-950 font-medium">
            GracePoint Church
          </p>
          <p className="text-xs text-slate-500 font-sans">
            Kikuyu, Kenya
          </p>
        </div>

        {/* Understated Floral Countdown */}
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto my-6 text-center font-sans">
          <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
            <span className="block text-xl sm:text-2xl font-serif text-purple-950 font-medium">{timeLeft.days}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Days</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
            <span className="block text-xl sm:text-2xl font-serif text-purple-950 font-medium">{timeLeft.hours}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Hours</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
            <span className="block text-xl sm:text-2xl font-serif text-purple-950 font-medium">{timeLeft.mins}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Mins</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#faf7f2] border border-amber-100 shadow-sm">
            <span className="block text-xl sm:text-2xl font-serif text-purple-950 font-medium">{timeLeft.secs}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Secs</span>
          </div>
        </div>

        {/* Action Buttons (Save Date & Directions) */}
        <div className="flex flex-wrap items-center justify-center gap-3 font-sans text-xs mb-10">
          <button
            onClick={handleDownloadIcs}
            className="inline-flex items-center gap-1.5 text-slate-700 bg-white border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-full transition shadow-sm"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-purple-900" />
            <span>Save to Calendar</span>
          </button>
          <a
            href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sky-800 bg-sky-50 border border-sky-200 hover:bg-sky-100 px-4 py-2 rounded-full transition shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-700" />
            <span>Directions</span>
          </a>
        </div>

        {/* ======================================================== */}
        {/* TASTEFUL WEDDING GIFTS & BLESSINGS SECTION               */}
        {/* ======================================================== */}
        <div className="my-10 pt-8 border-t border-amber-200/60 text-center">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-purple-900 font-semibold block mb-2">
            Wedding Gifts & Blessings
          </span>
          
          <p className="italic text-slate-700 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed mb-5">
            "Your presence, love, and prayers on our special day are the greatest gifts of all. If you would like to bless us with a wedding gift as we begin our new home together, your support is warmly appreciated."
          </p>

          {/* Clean, Discreet M-PESA Gift Card */}
          <div className="p-5 rounded-2xl bg-[#faf7f2] border border-amber-200 shadow-sm max-w-sm mx-auto text-left font-sans">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> M-PESA Contribution
              </span>
              <Gift className="w-3.5 h-3.5 text-purple-900" />
            </div>
            
            <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider">0704656076</p>
            <p className="text-xs text-slate-600">
              Account Name: <strong>Lily Kyalo</strong>
            </p>
            <p className="text-[10px] text-slate-400 italic mb-3">
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
        </div>

        {/* ======================================================== */}
        {/* CLEAN, INTIMATE RSVP FORM (PARTY SIZE REMOVED)           */}
        {/* ======================================================== */}
        <div className="pt-8 border-t border-amber-200/60 text-left">
          <div className="text-center mb-6">
            <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold mb-1">
              Kindly Respond
            </h3>
            <p className="italic text-xs text-slate-500">
              Please RSVP by September 30, 2026
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-sky-50 border border-sky-200 rounded-2xl text-center space-y-1">
              <span className="text-sky-700 text-2xl block mb-1">✓</span>
              <p className="text-base text-purple-950 font-medium">
                Thank you, {guestName || "cherished guest"}
              </p>
              <p className="text-xs text-slate-600 font-sans">
                Your response has been warmly received. We look forward to celebrating together.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-3.5 font-sans text-xs max-w-sm mx-auto">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  placeholder="Your Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-800 outline-none bg-[#faf7f2] text-slate-900 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-800 outline-none bg-[#faf7f2] text-slate-900 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-medium mb-1">
                  Will You Attend?
                </label>
                <select
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-800 outline-none bg-[#faf7f2] text-slate-900 transition"
                >
                  <option value="Attending">Joyfully Attending</option>
                  <option value="Declining">Regretfully Declining</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-600 font-medium mb-1">
                  A Prayer or Note for the Couple
                </label>
                <textarea
                  rows={2}
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  placeholder="Leave a blessing or warm message..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-800 outline-none bg-[#faf7f2] text-slate-900 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || submitted}
                className="w-full bg-purple-950 hover:bg-purple-900 text-white font-medium py-3 rounded-xl uppercase tracking-widest text-[11px] transition shadow-md disabled:opacity-50 mt-2"
              >
                {loading ? "Recording..." : "Confirm RSVP"}
              </button>
            </form>
          )}
        </div>

        {/* Bottom Floral Vine Accent */}
        <div className="w-full flex justify-center mt-8">
          <svg className="w-40 h-8 text-purple-950 opacity-60" viewBox="0 0 160 30" fill="none">
            <path d="M 10 15 C 50 25, 110 5, 150 15" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" />
            <circle cx="80" cy="15" r="4" fill="#c084fc" />
            <circle cx="65" cy="17" r="3" fill="#38bdf8" />
            <circle cx="95" cy="13" r="3" fill="#7e22ce" />
          </svg>
        </div>
      </main>

      {/* Understated Footer */}
      <footer className="mt-6 text-center text-xs text-slate-400 font-sans">
        Chan & Jim • GracePoint Church, Kikuyu • October 30, 2026
      </footer>
    </div>
  );
}
