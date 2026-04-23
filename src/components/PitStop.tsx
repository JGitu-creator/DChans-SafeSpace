'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, AlertCircle, Puzzle } from 'lucide-react';
import Sudoku from './Sudoku';

const RIDDLES = [
  {
    question: "I was not a queen by birth, but I saved my people from a sentence of death. Who am I?",
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
  const [activeTab, setActiveTab] = useState<'riddles' | 'sudoku' | 'cube'>('riddles');
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
    <div className="w-full max-w-xl mx-auto p-4 md:p-8 text-zinc-800 pb-32">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-purple-500/10 rounded-3xl mb-4 border border-purple-500/20">
          <Puzzle size={40} className="text-purple-600" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-purple-900 handwritten">Pit Stop</h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Take a moment to clear your mind, Hadassah.</p>
      </div>

      <div className="flex gap-2 mb-10 bg-zinc-200/50 p-1.5 rounded-2xl border border-black/5">
        <button 
          onClick={() => setActiveTab('riddles')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'riddles' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Riddles
        </button>
        <button 
          onClick={() => setActiveTab('sudoku')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'sudoku' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Sudoku
        </button>
        <button 
          onClick={() => setActiveTab('cube')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'cube' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Selah Cube
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'riddles' && (
          <motion.div
            key="riddles"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/60 backdrop-blur-md border border-[#2c1a10]/10 rounded-2xl p-8 shadow-xl"
          >
            <p className="text-2xl font-serif italic text-zinc-800 leading-relaxed mb-8 serif-italic">
              &quot;{RIDDLES[currentRiddle].question}&quot;
            </p>

            <div className="relative mb-6">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                className="w-full bg-white/50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-800 placeholder:text-zinc-300"
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              />
              <AnimatePresence>
                {status === 'correct' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-emerald-500">
                    <CheckCircle2 size={24} />
                  </motion.div>
                )}
                {status === 'wrong' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-red-500">
                    <AlertCircle size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {status === 'correct' ? (
                <button
                  onClick={nextRiddle}
                  className="flex-1 bg-emerald-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg uppercase text-[10px] tracking-widest"
                >
                  <RefreshCw size={16} />
                  Next Riddle
                </button>
              ) : (
                <>
                  <button
                    onClick={checkAnswer}
                    className="flex-1 bg-zinc-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg uppercase text-[10px] tracking-widest"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-8 py-4 border-2 border-zinc-100 rounded-2xl text-zinc-400 hover:text-purple-600 hover:border-purple-100 transition-all uppercase text-[10px] font-black tracking-widest bg-white/50"
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
                  className="mt-8 p-4 bg-purple-50/50 rounded-xl text-sm text-purple-700 italic text-center leading-relaxed border border-purple-100/50"
                >
                  Hint: {RIDDLES[currentRiddle].hint}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'sudoku' && (
          <motion.div
            key="sudoku"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
            <Sudoku />
          </motion.div>
        )}

        {activeTab === 'cube' && (
          <motion.div
            key="cube"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
            <SelahCube />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
}
      </AnimatePresence>
    </div>
  );
}
