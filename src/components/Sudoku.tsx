'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Sparkles, RotateCcw } from 'lucide-react';

// Using a stable initial grid and solution
const INITIAL_GRID = [
  [1, 0, 0, 0],
  [0, 0, 2, 0],
  [0, 3, 0, 0],
  [0, 0, 0, 4]
];

const SOLUTION = [
  [1, 2, 3, 4],
  [3, 4, 2, 1],
  [4, 3, 1, 2],
  [2, 1, 4, 3]
];

export default function Sudoku() {
  const [grid, setGrid] = useState(() => INITIAL_GRID.map(row => [...row]));
  const [isComplete, setIsComplete] = useState(false);
  const [errorCell, setErrorCell] = useState<{r: number, c: number} | null>(null);

  const handleCellChange = (row: number, col: number, value: string) => {
    // Only allow numbers 1-4
    const num = parseInt(value);
    if (value !== '' && (isNaN(num) || num < 1 || num > 4)) return;
    
    if (INITIAL_GRID[row][col] !== 0) return;

    const val = value === '' ? 0 : num;
    const newGrid = grid.map((r, ri) => 
      ri === row ? r.map((c, ci) => ci === col ? val : c) : r
    );
    
    setGrid(newGrid);

    // Provide a small vibration/shake if wrong (optional UX)
    if (val !== 0 && val !== SOLUTION[row][col]) {
      setErrorCell({r: row, c: col});
      setTimeout(() => setErrorCell(null), 500);
    }
  };

  useEffect(() => {
    const checkComplete = () => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] !== SOLUTION[i][j]) return false;
        }
      }
      return true;
    };
    if (checkComplete()) setIsComplete(true);
  }, [grid]);

  const reset = () => {
    setGrid(INITIAL_GRID.map(row => [...row]));
    setIsComplete(false);
    setErrorCell(null);
  };

  return (
    <div className="flex flex-col items-center gap-12 p-8 bg-zinc-900/40 backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-2xl w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sky-400">
          <Sparkles size={16} />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Selah Sudoku</h2>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">Focus your mind, Hadassah</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-sky-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative grid grid-cols-4 gap-3 bg-black/40 p-5 rounded-[2rem] border border-white/10 shadow-inner">
          {grid.map((row, i) => (
            row.map((cell, j) => {
              const isInitial = INITIAL_GRID[i][j] !== 0;
              const isError = errorCell?.r === i && errorCell?.c === j;
              
              return (
                <motion.div
                  key={`${i}-${j}`}
                  animate={isError ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[1-4]*"
                    value={cell === 0 ? '' : cell}
                    onChange={(e) => handleCellChange(i, j, e.target.value)}
                    readOnly={isInitial}
                    className={`w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-black rounded-2xl transition-all outline-none border-2 ${
                      isInitial 
                        ? 'bg-white text-zinc-900 border-transparent shadow-lg' 
                        : isError
                          ? 'bg-red-500/20 text-red-400 border-red-500/50'
                          : cell !== 0
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-zinc-800/50 text-white border-white/5 focus:border-sky-500/50 focus:bg-sky-500/10'
                    }`}
                  />
                </motion.div>
              );
            })
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div 
            key="complete"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative p-6 bg-emerald-500/20 rounded-full border-2 border-emerald-500/30 text-emerald-400">
                <Trophy size={48} strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Road Mastered!</h3>
              <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-widest mt-1">Excellent Focus, Hadassah</p>
            </div>
            <button 
              onClick={reset} 
              className="px-10 py-4 bg-white text-black font-black rounded-2xl uppercase text-xs tracking-[0.3em] hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Next Challenge
            </button>
          </motion.div>
        ) : (
          <motion.button 
            key="reset"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset} 
            className="flex items-center gap-3 px-6 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-lg"
          >
            <RotateCcw size={14} strokeWidth={3} />
            Reset Path
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
