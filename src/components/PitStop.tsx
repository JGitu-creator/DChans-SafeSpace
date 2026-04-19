'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, AlertCircle, Puzzle } from 'lucide-react';

const RIDDLES = [
  {
    question: "I was not a queen by birth, but I saved my people from a decree of death. Who am I?",
    answer: "esther",
    hint: "Think of the scroll read during Purim."
  },
  {
    question: "I followed my mother-in-law to a land not my own, and found a redeemer in the fields. Who am I?",
    answer: "ruth",
    hint: "Where you go, I will go."
  },
  {
    question: "I am the hook of wisdom, often short but always sharp. What book of the Bible am I?",
    answer: "proverbs",
    hint: "Written mostly by Solomon."
  }
];

export default function PitStop() {
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = () => {
    if (input.toLowerCase().trim() === RIDDLES[currentRiddle].answer) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  const nextRiddle = () => {
    setCurrentRiddle((prev) => (prev + 1) % RIDDLES.length);
    setInput('');
    setStatus('idle');
    setShowHint(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 text-white">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-white/10 rounded-3xl mb-4">
          <Puzzle size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Pit Stop Puzzles</h2>
        <p className="text-white/60">Take a moment to clear your mind, Hadassah.</p>
      </div>

      <motion.div
        key={currentRiddle}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <p className="text-xl font-serif italic text-white/90 leading-relaxed mb-8">
          "{RIDDLES[currentRiddle].question}"
        </p>

        <div className="relative mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-white/30"
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          />
          <AnimatePresence>
            {status === 'correct' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-emerald-400">
                <CheckCircle2 size={24} />
              </motion.div>
            )}
            {status === 'wrong' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-red-400">
                <AlertCircle size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4">
          {status === 'correct' ? (
            <button
              onClick={nextRiddle}
              className="flex-1 bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
            >
              <RefreshCw size={18} />
              Next Riddle
            </button>
          ) : (
            <>
              <button
                onClick={checkAnswer}
                className="flex-1 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors"
              >
                Check Answer
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-6 border border-white/20 rounded-2xl text-white/60 hover:text-white transition-colors"
              >
                Hint
              </button>
            </>
          )}
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-sm text-white/40 italic text-center"
            >
              Hint: {RIDDLES[currentRiddle].hint}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
