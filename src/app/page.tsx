'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeddingInvitation() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-10-30T10:00:00+03:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-floral min-h-screen text-slate-800">
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-2xl z-10 bg-white/70 backdrop-blur-md p-8 md:p-14 rounded-3xl border border-white/60 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-800 font-semibold mb-3">Together With Their Families</p>
          <h1 className="font-serif text-5xl md:text-7xl font-normal text-slate-900 mb-4">
            Chantal <span className="text-purple-600 font-serif italic">&</span> Jim
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-slate-600 mb-8">Request the honour of your presence at their wedding celebration</p>

          <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-sky-50 border border-sky-200 text-sky-900 text-sm font-medium mb-10">
            <span>Friday, October 30, 2026</span>
            <span>•</span>
            <span>Kivuli Gardens, Nakuru</span>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-sm mx-auto">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key} className="bg-purple-50/80 p-3 rounded-xl border border-purple-100">
                <span className="block font-serif text-2xl md:text-3xl font-bold text-purple-900">{String(value).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase tracking-wider text-purple-600">{key}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.header>
    </main>
  );
}
