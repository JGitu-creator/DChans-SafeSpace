'use client';

import { motion } from 'framer-motion';
import { Bike, Map, ChevronRight } from 'lucide-react';
import { MOODS, ThemeConfig } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MoodSelectorProps {
  currentMoodId: string;
  onSelectMood: (mood: ThemeConfig) => void;
}

export default function MoodSelector({ currentMoodId, onSelectMood }: MoodSelectorProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <h2 className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
        <Bike size={14} />
        Choose Your Ride
      </h2>
      {MOODS.map((mood) => (
        <motion.button
          key={mood.id}
          whileHover={{ x: 8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMood(mood)}
          className={cn(
            "group relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
            "bg-white/10 backdrop-blur-sm border border-white/10 text-white text-left",
            currentMoodId === mood.id && "bg-white/20 border-white/40 ring-1 ring-white/50 shadow-xl"
          )}
        >
          <div className="flex flex-col">
            <span className="font-bold text-lg">{mood.name}</span>
            <span className="text-white/60 text-xs line-clamp-1">{mood.description}</span>
          </div>
          <ChevronRight 
            className={cn(
              "transition-transform duration-300 opacity-0 group-hover:opacity-100",
              currentMoodId === mood.id && "opacity-100 translate-x-1"
            )} 
            size={18} 
          />
          
          {currentMoodId === mood.id && (
            <motion.div 
              layoutId="active-indicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-full m-1"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
