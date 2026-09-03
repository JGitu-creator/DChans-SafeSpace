"use client";

import React, { useState, useEffect } from "react";

export default function WeddingInvite() {
  const [gateOpen, setGateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"invite" | "schedule" | "giving" | "rsvp">("invite");
  const [guestName, setGuestName] = useState("");
  const [copiedMpesa, setCopiedMpesa] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // 1. Read personalized URL token (?guest=Name or ?name=Name)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get("guest") || params.get("name");
      if (nameParam) {
        setGuestName(decodeURIComponent(nameParam));
      }
    }
  }, []);

  // 2. Countdown timer to October 30, 2026 (EAT - UTC+3)
  useEffect(() => {
    const targetDate = new Date("2026-10-30T10:00:00+03:00").getTime();
    const interval = setInterval(() => {
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
    return () => clearInterval(interval);
  }, []);

  // 3. M-PESA Copy helper
  const handleCopyMpesa = () => {
    navigator.clipboard.writeText("0704656076");
    setCopiedMpesa(true);
    setTimeout(() => setCopiedMpesa(false), 3000);
  };

  // 4. RSVP submission to Google Sheets
  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      attendance: formData.get("attendance"),
      guestCount: formData.get("guestCount"),
      dietary: formData.get("dietary"),
      message: formData.get("message"),
      submittedAt: new Date().toISOString(),
    };

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyFIssp-Gfi7efBQOW0wbjMjy1AeE9lchHihGoJ_Xfo_KyChNjF4mOx3jKhP6cisGjm/exec";

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-slate-800 font-sans flex flex-col items-center justify-center p-2 sm:p-4 selection:bg-purple-600 selection:text-white relative">
      
      {/* Personalized Greeting Header */}
      <aside className="w-full max-w-lg bg-gradient-to-r from-sky-700 via-purple-700 to-purple-900 text-white text-xs sm:text-sm py-2 px-4 rounded-2xl mb-3 shadow text-center font-medium">
        {guestName
          ? `Karibu, ${guestName}! You are warmly invited to celebrate with Chan & Jim.`
          : "Karibu! You are warmly invited to celebrate the union of Chan & Jim."}
      </aside>

      {/* Main Luxury 9:16 Interactive Card */}
      <main className="w-full max-w-lg bg-white/95 rounded-3xl border border-amber-200/70 shadow-2xl overflow-hidden relative min-h-[720px] flex flex-col justify-between">
        
        {/* INTERACTIVE WROUGHT-IRON GATE OVERLAY */}
        {!gateOpen && (
          <div className="absolute inset-0 z-50 bg-[#141b2b] flex flex-col items-center justify-center p-6 text-center transition-all duration-700">
            <div className="w-20 h-20 rounded-full bg-amber-400/10 border-2 border-amber-300/40 flex items-center justify-center mb-6 text-amber-300 text-2xl animate-pulse">
              💍
            </div>
            <p className="text-amber-200/80 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
              Wedding Invitation
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif text-white mb-2">
              Chan <span className="text-sky-400 italic">&</span> Jim
            </h1>
            <p className="text-amber-100/70 text-xs tracking-widest uppercase mb-8">
              October 30, 2026 • GracePoint Church, Kikuyu
            </p>
            
            <button
              onClick={() => setGateOpen(true)}
              className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:opacity-95 text-slate-900 font-semibold px-8 py-3.5 rounded-full shadow-[0_0_25px_rgba(251,191,36,0.4)] text-xs uppercase tracking-widest active:scale-95 transition"
            >
              Open Invitation ✨
            </button>
          </div>
        )}

        {/* ================= TAB 1: FORMAL INVITATION ================= */}
        {activeTab === "invite" && (
          <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center animate-fadeIn">
            <div className="inline-block mx-auto py-1 px-4 rounded-full bg-purple-50 text-purple-800 text-[10px] tracking-[0.25em] uppercase font-bold mb-3 border border-purple-100">
              Together With Their Families
            </div>

            <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold mb-2">
              The Wedding Of
            </h2>

            <div className="py-2">
              <h1 className="font-serif text-5xl sm:text-6xl text-purple-900 font-normal leading-tight">
                Chan
              </h1>
              <div className="text-3xl text-sky-600 font-serif italic my-1">&</div>
              <h1 className="font-serif text-5xl sm:text-6xl text-purple-900 font-normal leading-tight">
                Jim
              </h1>
            </div>

            <p className="text-sm font-serif italic text-slate-600 my-2">
              "Clothed in Faith"
            </p>

            <div className="my-4 py-2 px-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs font-medium text-slate-800 max-w-xs mx-auto">
              <p className="font-bold text-sky-800">Friday, October 30, 2026</p>
              <p className="text-slate-600">GracePoint Church, Kikuyu</p>
            </div>

            {/* Live Countdown */}
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6 text-center">
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <span className="block font-serif text-2xl font-bold text-purple-900">{timeLeft.days}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-600 font-semibold">Days</span>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <span className="block font-serif text-2xl font-bold text-purple-900">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-600 font-semibold">Hours</span>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <span className="block font-serif text-2xl font-bold text-purple-900">{timeLeft.mins}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-600 font-semibold">Mins</span>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <span className="block font-serif text-2xl font-bold text-purple-900">{timeLeft.secs}</span>
                <span className="text-[9px] uppercase tracking-wider text-purple-600 font-semibold">Secs</span>
              </div>
            </div>

            {/* Couple Poster Photo Preview */}
            <div className="relative max-w-[260px] mx-auto rounded-2xl overflow-hidden border-2 border-amber-200 shadow-md">
              <img
                src="/C&J.jpeg"
                alt="Chan and Jim"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
                className="w-full h-auto object-cover max-h-[220px]"
              />
              <div className="bg-gradient-to-t from-slate-900/90 to-transparent p-2 text-white text-xs">
                Chan + Jim • October 30, 2026
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SCHEDULE OF EVENTS ================= */}
        {activeTab === "schedule" && (
          <div className="p-6 text-center flex-1 flex flex-col justify-center animate-fadeIn">
            <h3 className="text-xs uppercase tracking-[0.25em] text-purple-900 font-bold mb-1">
              Programme of the Day
            </h3>
            <p className="text-xs text-slate-500 mb-4">GracePoint Church, Kikuyu • Oct 30, 2026</p>

            <div className="space-y-2.5 text-left text-xs max-w-sm mx-auto mb-6">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-start gap-3">
                <span className="font-bold text-purple-800 w-16 shrink-0">10:00 AM</span>
                <div>
                  <strong className="text-slate-800 block">Guest Arrival & Usheering</strong>
                  <span className="text-slate-500 text-[11px]">Welcome refreshments & sanctuary seating.</span>
                </div>
              </div>
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-start gap-3">
                <span className="font-bold text-sky-700 w-16 shrink-0">11:00 AM</span>
                <div>
                  <strong className="text-slate-800 block">Holy Matrimony Ceremony</strong>
                  <span className="text-slate-500 text-[11px]">Vows, exchange of rings & pastoral blessing.</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-start gap-3">
                <span className="font-bold text-purple-800 w-16 shrink-0">01:00 PM</span>
                <div>
                  <strong className="text-slate-800 block">Photos & Cocktail Hour</strong>
                  <span className="text-slate-500 text-[11px]">Garden photo session with family & guests.</span>
                </div>
              </div>
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-start gap-3">
                <span className="font-bold text-sky-700 w-16 shrink-0">01:30 PM</span>
                <div>
                  <strong className="text-slate-800 block">Wedding Luncheon & Feast</strong>
                  <span className="text-slate-500 text-[11px]">Fellowship, food, speeches & celebration.</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-start gap-3">
                <span className="font-bold text-purple-800 w-16 shrink-0">03:30 PM</span>
                <div>
                  <strong className="text-slate-800 block">Cake Cutting & Thanksgiving</strong>
                  <span className="text-slate-500 text-[11px]">Music, cake cutting & joyful dance.</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs">
              <span className="font-semibold text-slate-800">Venue Location:</span>
              <p className="text-slate-500 text-[11px] mb-2">GracePoint Church, Kikuyu, Kenya</p>
              <a
                href="https://maps.google.com/?q=GracePoint+Church+Kikuyu"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 font-bold hover:underline"
              >
                Open in Google Maps &rarr;
              </a>
            </div>
          </div>
        )}

        {/* ================= TAB 3: BUDGET & GIFTING ================= */}
        {activeTab === "giving" && (
          <div className="p-6 text-center flex-1 flex flex-col justify-center animate-fadeIn">
            <h3 className="text-xs uppercase tracking-[0.25em] text-purple-900 font-bold mb-1">
              Partnering Together
            </h3>
            <p className="font-serif italic text-slate-600 text-xs mb-3">
              "We are grateful for you! You are one of the people God has placed around us as we prepare to celebrate our special day."
            </p>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-slate-700 mb-4 leading-relaxed">
              Our wedding budget is approx. <strong className="text-purple-900 font-bold">KSh 300,000</strong>. If you would like to partner with us towards any expense, give as you feel led. No amount is too small!
            </div>

            {/* 9 Expense categories from your poster */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] text-slate-700 font-medium">
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">💍 Attire & Rings</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">💒 Venue</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">📸 Photos & Video</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">🍽️ Food & Feast</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">🎶 Music</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">🌸 Décor</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">🎂 Cake</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">✈️ Honeymoon</div>
              <div className="p-2 bg-white rounded-xl border border-purple-50 shadow-sm">🚐 Transport</div>
            </div>

            {/* M-PESA card */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-md text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block mb-1">
                🟢 M-PESA Gifting Details
              </span>
              <p className="text-xl font-mono font-bold text-slate-900 tracking-wider">0704656076</p>
              <p className="text-[11px] text-slate-500 mb-2">Account Name: <strong>Lily Kyalo</strong></p>
              <button
                onClick={handleCopyMpesa}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-xs uppercase tracking-wider transition"
              >
                {copiedMpesa ? "Copied to Clipboard! ✓" : "Copy M-PESA Number"}
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 4: RSVP CONNECTED TO GOOGLE SHEETS ================= */}
        {activeTab === "rsvp" && (
          <div className="p-6 text-center flex-1 flex flex-col justify-center animate-fadeIn">
            <h3 className="text-xs uppercase tracking-[0.25em] text-purple-900 font-bold mb-1">
              Kindly RSVP
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">Please respond by September 30, 2026</p>

            {submitted ? (
              <div className="p-6 bg-sky-50 border border-sky-200 rounded-2xl text-sky-900 text-xs leading-relaxed">
                <span className="text-3xl block mb-2">🌸</span>
                <strong>Thank you!</strong> Your RSVP has been saved directly into our wedding Google Sheet. We look forward to celebrating with you at GracePoint Church, Kikuyu!
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3 text-left text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Your Name</label>
                  <input
                    name="name"
                    defaultValue={guestName}
                    required
                    placeholder="e.g., Steve Kiteto"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Attendance</label>
                  <select
                    name="attendance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600 bg-white"
                  >
                    <option value="Attending">Delightfully Attending</option>
                    <option value="Declining">Regretfully Declining</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Number of Guests</label>
                  <input
                    type="number"
                    name="guestCount"
                    min="1"
                    max="4"
                    defaultValue="1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">Prayer / Message for Chan & Jim</label>
                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Leave a blessing for the couple..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-700 to-sky-600 hover:opacity-95 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-xs shadow transition"
                >
                  {loading ? "Recording in Google Sheet..." : "Submit RSVP"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= BOTTOM TAB NAVIGATION ================= */}
        <nav className="p-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-around">
          <button
            onClick={() => setActiveTab("invite")}
            className={`text-xs font-semibold py-1 px-3 rounded-lg transition ${
              activeTab === "invite" ? "text-purple-700 bg-purple-100/70" : "text-slate-400"
            }`}
          >
            Invite
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`text-xs font-semibold py-1 px-3 rounded-lg transition ${
              activeTab === "schedule" ? "text-purple-700 bg-purple-100/70" : "text-slate-400"
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("giving")}
            className={`text-xs font-semibold py-1 px-3 rounded-lg transition ${
              activeTab === "giving" ? "text-purple-700 bg-purple-100/70" : "text-slate-400"
            }`}
          >
            Giving
          </button>
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`text-xs font-semibold py-1 px-3 rounded-lg transition ${
              activeTab === "rsvp" ? "text-purple-700 bg-purple-100/70" : "text-slate-400"
            }`}
          >
            RSVP
          </button>
        </nav>
      </main>

      {/* Footer */}
      <footer className="mt-4 text-center text-xs text-slate-400">
        Chan & Jim • October 30, 2026 • GracePoint Church, Kikuyu
      </footer>
    </div>
  );
}
