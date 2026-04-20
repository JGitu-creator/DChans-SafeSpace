'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle2, Trophy } from 'lucide-react';

export default function Sudoku() {
  // A very simple 4x4 Sudoku for minimalism and speed
  const initialGrid = [
    [1, 0, 0, 0],
    [0, 0, 2, 0],
    [0, 3, 0, 0],
    [0, 0, 0, 4]
  ];
  const solution = [
    [1, 2, 3, 4],
    [3, 4, 2, 1],
    [4, 3, 1, 2],
    [2, 1, 4, 3]
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [isComplete, setIsComplete] = useState(false);

  const handleCellChange = (row: number, col: number, value: number) => {
    if (initialGrid[row][col] !== 0) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  useEffect(() => {
    const checkComplete = () => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] !== solution[i][j]) return false;
        }
      }
      return true;
    };
    if (checkComplete()) setIsComplete(true);
  }, [grid]);

  const reset = () => {
    setGrid(initialGrid);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-4 gap-2 bg-white/5 p-4 rounded-3xl border border-white/10 shadow-2xl">
        {grid.map((row, i) => (
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              min="1"
              max="4"
              value={cell === 0 ? '' : cell}
              onChange={(e) => handleCellChange(i, j, parseInt(e.target.value) || 0)}
              readOnly={initialGrid[i][j] !== 0}
              className={`w-12 h-12 md:w-16 md:h-16 text-center text-xl font-black rounded-xl transition-all outline-none border-2 ${
                initialGrid[i][j] !== 0 
                  ? 'bg-white text-black border-transparent' 
                  : 'bg-black/20 text-white border-white/5 focus:border-purple-500 focus:bg-purple-500/20'
              }`}
            />
          ))
        ))}
      </div>

      {isComplete ? (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 text-emerald-400"
        >
          <div className="p-4 bg-emerald-500/20 rounded-full border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Trophy size={48} />
          </div>
          <p className="font-black uppercase tracking-[0.2em] italic">Road Mastered!</p>
          <button onClick={reset} className="mt-4 px-8 py-3 bg-white text-black font-black rounded-full uppercase text-xs tracking-widest hover:scale-105 transition-all">
            New Track
          </button>
        </motion.div>
      ) : (
        <button onClick={reset} className="flex items-center gap-2 text-white/20 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
          <RefreshCw size={14} />
          Reset Path
        </button>
      )}
    </div>
  );
}
