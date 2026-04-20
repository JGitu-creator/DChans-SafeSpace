'use client';

import { motion } from 'framer-motion';
import { ROUTES, RouteConfig } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RouteSelectorProps {
  currentRouteId: string;
  onSelectRoute: (route: RouteConfig) => void;
}

export default function RouteSelector({ currentRouteId, onSelectRoute }: RouteSelectorProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">
          Select Your Route
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {ROUTES.map((route) => (
          <motion.button
            key={route.id}
            whileHover={{ rotate: Math.random() * 4 - 2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectRoute(route)}
            className={cn(
              "relative aspect-square p-2 bg-white shadow-xl transition-all duration-500",
              "border-[6px] border-white",
              currentRouteId === route.id 
                ? "ring-4 ring-purple-500/50 -rotate-2 z-10" 
                : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100 rotate-1"
            )}
          >
            {/* The Polaroid Image */}
            <div className="w-full h-full bg-zinc-200 overflow-hidden relative">
              <img 
                src={route.terrain === 'galaxy' 
                  ? 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400' 
                  : route.terrain === 'mountain'
                  ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400'
                  : 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400'
                } 
                className="w-full h-full object-cover"
                alt={route.name}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            
            {/* Handwriting Label */}
            <div className="pt-2 flex flex-col items-center">
              <span className="text-[10px] font-black text-zinc-900 tracking-tighter uppercase italic leading-none">
                {route.id.replace('-', ' ')}
              </span>
              <span className="text-[14px] leading-none mt-1">{route.sticker}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
