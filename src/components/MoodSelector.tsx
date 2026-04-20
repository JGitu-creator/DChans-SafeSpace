'use client';

import { motion } from 'framer-motion';
import { Bike, Check, ChevronRight } from 'lucide-react';
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
  const bikeImages: Record<string, string> = {
    adventure: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&q=80&w=800',
    cafe: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800',
    harley: 'https://images.unsplash.com/photo-1558981403-c5f9199a28ad?auto=format&fit=crop&q=80&w=800',
    speed: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    futuristic: 'https://images.unsplash.com/photo-1449491023939-02c9ab99407d?auto=format&fit=crop&q=80&w=800',
  };

  const terrainImages: Record<string, string> = {
    mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    valley: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
    forest: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=800',
    desert: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=800',
    galaxy: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800',
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-white text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
          <Bike size={18} className="text-amber-400" />
          The Ride Gallery
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMood(mood)}
            className={cn(
              "group relative h-48 w-full rounded-3xl overflow-hidden border-2 transition-all duration-500 shadow-2xl",
              currentMoodId === mood.id 
                ? "border-white shadow-white/10 ring-4 ring-white/10" 
                : "border-white/10 grayscale hover:grayscale-0"
            )}
          >
            {/* Background (Terrain) */}
            <img 
              src={terrainImages[mood.terrain]} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt={mood.terrain}
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Bike Preview Inset */}
            <div className="absolute top-4 right-4 w-24 h-24 rounded-2xl border border-white/20 overflow-hidden shadow-2xl bg-black/40 backdrop-blur-md">
              <img 
                src={bikeImages[mood.bike]} 
                className="w-full h-full object-cover p-1 rounded-2xl" 
                alt={mood.bike}
              />
            </div>

            {/* Info */}
            <div className="absolute bottom-6 left-6 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-widest text-white/60">
                  {mood.bike} ride
                </span>
                {currentMoodId === mood.id && (
                  <span className="bg-white text-black p-1 rounded-full"><Check size={8} /></span>
                )}
              </div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                {mood.name}
              </h3>
              <p className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-wider line-clamp-1">
                {mood.description}
              </p>
            </div>

            {/* Selection Glow */}
            {currentMoodId === mood.id && (
              <motion.div 
                layoutId="active-ride-glow"
                className="absolute inset-0 border-white/20 bg-white/5 pointer-events-none shadow-[inset_0_0_40px_rgba(255,255,255,0.2)]"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
