'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Search, 
  Brain, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';

type GameMode = 'trivia' | 'scramble' | 'whoami';

interface TriviaQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface ScrambleWord {
  scrambled: string;
  original: string;
  hint: string;
}

interface WhoAmI {
  riddle: string;
  answer: string;
  hint: string;
}

const TRIVIA: TriviaQuestion[] = [
  {
    question: "Who was the youngest king to rule over Judah?",
    options: ["Josiah", "Joash", "Manasseh", "Uzziah"],
    answer: "Joash",
    explanation: "Joash was only seven years old when he began to reign (2 Kings 11:21)."
  },
  {
    question: "In what city were the followers of Jesus first called Christians?",
    options: ["Jerusalem", "Antioch", "Damascus", "Rome"],
    answer: "Antioch",
    explanation: "Acts 11:26 states that 'in Antioch the disciples were first called Christians.'"
  },
  {
    question: "Which of these women is mentioned in the genealogy of Jesus in Matthew 1?",
    options: ["Sarah", "Rebekah", "Rahab", "Esther"],
    answer: "Rahab",
    explanation: "Matthew 1:5 mentions Rahab as the mother of Boaz."
  }
];

const SCRAMBLE: ScrambleWord[] = [
  { scrambled: "EIDCEBONE", original: "OBEDIENCE", hint: "Better than sacrifice." },
  { scrambled: "ETRUDTIGA", original: "GRATITUDE", hint: "A thankful heart." },
  { scrambled: "ENCEILISRE", original: "RESILIENCE", hint: "The ability to bounce back." },
  { scrambled: "HASSADAH", original: "HADDASSAH", hint: "Your royal name." },
  { scrambled: "VEREPANCEERS", original: "PERSEVERANCE", hint: "Staying the course." }
];

const WHO_AM_I: WhoAmI[] = [
  {
    riddle: "I was not a queen by birth, but I saved my people from a sentence of death. Who am I?",
    answer: "Esther",
    hint: "Think of the scroll read during Purim."
  },
  {
    riddle: "I followed my mother-in-law to a land not my own, and found a redeemer in the fields. Who am I?",
    answer: "Ruth",
    hint: "Where you go, I will go."
  },
  {
    riddle: "I was a shepherd boy who became a king after defeating a giant. Who am I?",
    answer: "David",
    hint: "I played the harp for Saul."
  },
  {
    riddle: "I was swallowed by a great fish when I tried to run away from God's call to Nineveh. Who am I?",
    answer: "Jonah",
    hint: "I spent three days in the deep."
  }
];

export default function BiblicalGames() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setInput('');
    setStatus('idle');
    setShowHint(false);
  };

  const handleModeSelect = (m: GameMode) => {
    setMode(m);
    resetGame();
  };

  const checkAnswer = (selected?: string) => {
    let isCorrect = false;
    if (mode === 'trivia') {
      isCorrect = selected === TRIVIA[currentIndex].answer;
    } else if (mode === 'scramble') {
      isCorrect = input.toUpperCase().trim() === SCRAMBLE[currentIndex].original;
    } else if (mode === 'whoami') {
      isCorrect = input.toLowerCase().trim() === WHO_AM_I[currentIndex].answer.toLowerCase();
    }

    if (isCorrect) {
      setScore(s => s + 1);
      setStatus('correct');
    } else {
      setStatus('wrong');
    }

    setTimeout(() => {
      const list = mode === 'trivia' ? TRIVIA : mode === 'scramble' ? SCRAMBLE : WHO_AM_I;
      if (currentIndex < list.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setStatus('idle');
        setShowHint(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 pb-32">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-amber-500/10 rounded-3xl mb-4 border border-amber-500/20">
          <Brain size={40} className="text-amber-600" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-zinc-800 handwritten">Bible Game Center</h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-amber-600">Grow in wisdom and Word, Hadassah</p>
      </div>

      {!mode ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GameModeCard 
            title="Bible Trivia" 
            desc="Test your knowledge of the Word" 
            icon={<HelpCircle className="text-sky-500" />} 
            onClick={() => handleModeSelect('trivia')} 
          />
          <GameModeCard 
            title="Word Scramble" 
            desc="Build your royal vocabulary" 
            icon={<Search className="text-purple-500" />} 
            onClick={() => handleModeSelect('scramble')} 
          />
          <GameModeCard 
            title="Who Am I?" 
            desc="Identify Biblical heroes" 
            icon={<Sparkles className="text-rose-500" />} 
            onClick={() => handleModeSelect('whoami')} 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setMode(null)}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={12} /> Back to Menu
          </button>

          <AnimatePresence mode="wait">
            {showResult ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-12 text-center border border-black/5 shadow-xl"
              >
                <div className="inline-block p-6 bg-amber-500/20 rounded-full text-amber-600 mb-6">
                  <Trophy size={48} />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-800 mb-2">Well Done!</h3>
                <p className="text-zinc-500 text-sm mb-8">You scored <span className="text-amber-600 font-bold">{score}</span> out of {mode === 'trivia' ? TRIVIA.length : mode === 'scramble' ? SCRAMBLE.length : WHO_AM_I.length}</p>
                <button 
                  onClick={resetGame}
                  className="px-10 py-4 bg-zinc-900 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                >
                  Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
                    Question {currentIndex + 1}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Score: {score}
                  </span>
                </div>

                {mode === 'trivia' && (
                  <div className="space-y-8">
                    <p className="text-2xl font-serif italic text-zinc-800 leading-relaxed">
                      {TRIVIA[currentIndex].question}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {TRIVIA[currentIndex].options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => status === 'idle' && checkAnswer(opt)}
                          className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium ${
                            status === 'idle' 
                              ? 'border-black/5 hover:border-amber-500/30 hover:bg-amber-50/50' 
                              : opt === TRIVIA[currentIndex].answer
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {mode === 'scramble' && (
                  <div className="space-y-8 text-center">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Unscramble this word</p>
                      <h3 className="text-5xl font-black italic tracking-tighter text-amber-600 uppercase">
                        {SCRAMBLE[currentIndex].scrambled}
                      </h3>
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type the word..."
                        className="w-full bg-white/50 border border-zinc-200 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-800"
                        onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && checkAnswer()}
                      />
                      {status !== 'idle' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {status === 'correct' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                        </div>
                      )}
                    </div>
                    <p className="text-sm italic text-zinc-500">Hint: {SCRAMBLE[currentIndex].hint}</p>
                  </div>
                )}

                {mode === 'whoami' && (
                  <div className="space-y-8">
                    <p className="text-2xl font-serif italic text-zinc-800 leading-relaxed text-center">
                      &quot;{WHO_AM_I[currentIndex].riddle}&quot;
                    </p>
                    <div className="relative">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Who am I?"
                        className="w-full bg-white/50 border border-zinc-200 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-800"
                        onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && checkAnswer()}
                      />
                      {status !== 'idle' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {status === 'correct' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      {showHint ? (
                        <p className="text-sm italic text-amber-600 bg-amber-50 py-3 rounded-xl border border-amber-100 px-4">
                          {WHO_AM_I[currentIndex].hint}
                        </p>
                      ) : (
                        <button 
                          onClick={() => setShowHint(true)}
                          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-amber-600 transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Lightbulb size={12} /> Need a hint?
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {status === 'wrong' && mode !== 'trivia' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-xs text-red-500 font-bold uppercase tracking-widest">
                    Try again, mi hermana
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function GameModeCard({ title, desc, icon, onClick }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-black/5 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zinc-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
      <div className="p-3 bg-white rounded-2xl shadow-sm w-fit relative z-10">
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-800">{title}</h3>
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">{desc}</p>
      </div>
      <div className="mt-4 flex items-center text-zinc-900 font-black uppercase text-[8px] tracking-[0.3em] relative z-10">
        Play Now <ChevronRight size={10} className="ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}
