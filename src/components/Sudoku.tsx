'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface Puzzle {
  initial: number[][];
  solution: number[][];
}

const PUZZLES: Puzzle[] = [
  {
    initial: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]
  },
  {
    initial: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0]
    ],
    solution: [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 9]
    ]
  }
];

export default function Sudoku() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [grid, setGrid] = useState<number[][]>([]);
  const [errorCell, setErrorCell] = useState<{r: number, c: number} | null>(null);

  const currentPuzzle = useMemo(() => {
    return PUZZLES[puzzleIndex % PUZZLES.length];
  }, [puzzleIndex]);

  const isComplete = useMemo(() => {
    if (!grid || grid.length !== 9) return false;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== currentPuzzle.solution[i][j]) return false;
      }
    }
    return true;
  }, [grid, currentPuzzle.solution]);

  useEffect(() => {
    setGrid(currentPuzzle.initial.map(row => [...row]));
    setErrorCell(null);
  }, [currentPuzzle]);

  const handleCellChange = (row: number, col: number, value: string) => {
    const num = parseInt(value);
    if (value !== '' && (isNaN(num) || num < 1 || num > 9)) return;
    
    if (currentPuzzle.initial[row][col] !== 0) return;

    const val = value === '' ? 0 : num;
    const newGrid = grid.map((r, ri) => 
      ri === row ? r.map((c, ci) => ci === col ? val : c) : r
    );
    
    setGrid(newGrid);

    if (val !== 0 && val !== currentPuzzle.solution[row][col]) {
      setErrorCell({r: row, c: col});
      setTimeout(() => setErrorCell(null), 500);
    }
  };

  const reset = () => {
    setGrid(currentPuzzle.initial.map(row => [...row]));
    setErrorCell(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 p-3 md:p-8 bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl w-full max-w-2xl mx-auto overflow-hidden">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sky-400">
          <Sparkles size={16} />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Royal Sudoku</h2>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">9x9 Challenge for Hadassah</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-sky-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative grid grid-cols-9 gap-1 bg-black/40 p-2 md:p-4 rounded-[1.5rem] border border-white/10 shadow-inner">
          {grid.map((row, i) => (
            row.map((cell, j) => {
              const isInitial = currentPuzzle.initial[i][j] !== 0;
              const isError = errorCell?.r === i && errorCell?.c === j;
              
              const borderClasses = `
                ${j % 3 === 2 && j !== 8 ? 'mr-1' : ''}
                ${i % 3 === 2 && i !== 8 ? 'mb-1' : ''}
              `;

              return (
                <motion.div
                  key={`${i}-${j}`}
                  animate={isError ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`relative ${borderClasses}`}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[1-9]*"
                    maxLength={1}
                    value={cell === 0 ? '' : cell}
                    onChange={(e) => handleCellChange(i, j, e.target.value)}
                    readOnly={isInitial}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-sm md:text-xl font-black rounded-md md:rounded-lg transition-all outline-none border flex items-center justify-center p-0 leading-none ${
                      isInitial 
                        ? 'bg-white text-zinc-900 border-transparent shadow-md' 
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
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Puzzle Solved!</h3>
              <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-widest mt-1">Royal Focus, Hadassah</p>
            </div>
            <button 
              onClick={() => setPuzzleIndex(prev => prev + 1)} 
              className="px-10 py-4 bg-white text-black font-black rounded-2xl uppercase text-xs tracking-[0.3em] hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Next Puzzle
            </button>
          </motion.div>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={reset} 
              className="flex items-center gap-3 px-6 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-lg"
            >
              <RotateCcw size={14} strokeWidth={3} />
              Reset
            </button>
            <button 
              onClick={() => setPuzzleIndex(prev => prev + 1)} 
              className="flex items-center gap-3 px-6 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-lg"
            >
              New Puzzle
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
