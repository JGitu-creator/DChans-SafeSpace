'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Sparkles, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type Color = 'bg-rose-500' | 'bg-sky-500' | 'bg-amber-500' | 'bg-emerald-500';

export default function DChansCube() {
  const initialGrid: Color[][] = [
    ['bg-rose-500', 'bg-rose-500', 'bg-sky-500', 'bg-sky-500'],
    ['bg-rose-500', 'bg-rose-500', 'bg-sky-500', 'bg-sky-500'],
    ['bg-amber-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-500'],
    ['bg-amber-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-500'],
  ];

  const [grid, setGrid] = useState<Color[][]>(initialGrid);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const shiftRow = (rowIndex: number, direction: 'left' | 'right') => {
    if (isComplete) return;
    const newGrid = [...grid.map(row => [...row])];
    const row = newGrid[rowIndex];
    if (direction === 'left') {
      const first = row.shift()!;
      row.push(first);
    } else {
      const last = row.pop()!;
      row.unshift(last);
    }
    setGrid(newGrid);
    setMoves(m => m + 1);
  };

  const shiftCol = (colIndex: number, direction: 'up' | 'down') => {
    if (isComplete) return;
    const newGrid = [...grid.map(row => [...row])];
    const column = newGrid.map(row => row[colIndex]);
    if (direction === 'up') {
      const first = column.shift()!;
      column.push(first);
    } else {
      const last = column.pop()!;
      column.unshift(last);
    }
    column.forEach((color, rowIndex) => {
      newGrid[rowIndex][colIndex] = color;
    });
    setGrid(newGrid);
    setMoves(m => m + 1);
  };

  useEffect(() => {
    const checkComplete = () => {
      // Check if each quadrant is a single color
      const q1 = grid[0][0];
      const q2 = grid[0][2];
      const q3 = grid[2][0];
      const q4 = grid[2][2];

      const checkQuad = (rStart: number, cStart: number, color: Color) => {
        for (let i = rStart; i < rStart + 2; i++) {
          for (let j = cStart; j < cStart + 2; j++) {
            if (grid[i][j] !== color) return false;
          }
        }
        return true;
      };

      return checkQuad(0, 0, q1) && checkQuad(0, 2, q2) && 
             checkQuad(2, 0, q3) && checkQuad(2, 2, q4) &&
             q1 !== q2 && q1 !== q3 && q2 !== q4; // Ensure colors are distinct
    };

    if (moves > 0 && checkComplete()) setIsComplete(true);
  }, [grid, moves]);

  const scramble = () => {
    let newGrid = initialGrid.map(row => [...row]);
    // Randomly shift rows and columns
    for (let i = 0; i < 15; i++) {
      const isRow = Math.random() > 0.5;
      const index = Math.floor(Math.random() * 4);
      const dir = Math.random() > 0.5 ? 1 : -1;

      if (isRow) {
        const row = newGrid[index];
        if (dir === 1) {
          const first = row.shift()!;
          row.push(first);
        } else {
          const last = row.pop()!;
          row.unshift(last);
        }
      } else {
        const column = newGrid.map(row => row[index]);
        if (dir === 1) {
          const first = column.shift()!;
          column.push(first);
        } else {
          const last = column.pop()!;
          column.unshift(last);
        }
        column.forEach((color, rowIndex) => {
          newGrid[rowIndex][index] = color;
        });
      }
    }
    setGrid(newGrid);
    setMoves(0);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-10 p-8 bg-zinc-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl w-full max-w-md mx-auto overflow-hidden">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-rose-400">
          <Sparkles size={16} />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">DChan's Cube</h2>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">Align your path, Hadassah</p>
      </div>

      <div className="relative p-8">
        {/* Controls: Top */}
        <div className="absolute top-0 left-8 right-8 flex justify-around">
          {[0, 1, 2, 3].map(i => (
            <button key={`up-${i}`} onClick={() => shiftCol(i, 'up')} className="text-zinc-600 hover:text-white transition-colors"><ChevronUp size={20} /></button>
          ))}
        </div>
        
        {/* Controls: Bottom */}
        <div className="absolute bottom-0 left-8 right-8 flex justify-around">
          {[0, 1, 2, 3].map(i => (
            <button key={`down-${i}`} onClick={() => shiftCol(i, 'down')} className="text-zinc-600 hover:text-white transition-colors"><ChevronDown size={20} /></button>
          ))}
        </div>

        {/* Controls: Left */}
        <div className="absolute left-0 top-8 bottom-8 flex flex-col justify-around">
          {[0, 1, 2, 3].map(i => (
            <button key={`left-${i}`} onClick={() => shiftRow(i, 'left')} className="text-zinc-600 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
          ))}
        </div>

        {/* Controls: Right */}
        <div className="absolute right-0 top-8 bottom-8 flex flex-col justify-around">
          {[0, 1, 2, 3].map(i => (
            <button key={`right-${i}`} onClick={() => shiftRow(i, 'right')} className="text-zinc-600 hover:text-white transition-colors"><ChevronRight size={20} /></button>
          ))}
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-4 gap-2 bg-black/20 p-2 rounded-2xl">
          {grid.map((row, i) => (
            row.map((color, j) => (
              <motion.div
                key={`${i}-${j}`}
                layout
                className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${color} shadow-lg border border-white/10`}
              />
            ))
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="px-6 py-2 bg-black/40 rounded-full border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Moves: <span className="text-white">{moves}</span></p>
        </div>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 bg-emerald-500/20 rounded-full text-emerald-400 border border-emerald-500/30">
                <Trophy size={32} />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Symmetry Restored!</p>
              <button onClick={scramble} className="px-8 py-3 bg-white text-black font-black rounded-xl uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all">New Puzzle</button>
            </motion.div>
          ) : (
            <button onClick={scramble} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[0.3em]">
              <RotateCcw size={14} />
              Scramble Cube
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
