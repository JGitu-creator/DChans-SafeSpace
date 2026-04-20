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
        <h2 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] italic">
          Select Your Route
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {ROUTES.map((route, i) => (
          <motion.button
            key={route.id}
            whileHover={{ y: -5, rotate: i % 2 === 0 ? -2 : 2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRoute(route)}
            className={cn(
              "relative bg-white p-3 shadow-2xl transition-all duration-500 origin-center",
              "border-[8px] border-white rounded-sm",
              currentRouteId === route.id 
                ? "ring-4 ring-purple-500/30 rotate-0 z-10 scale-105" 
                : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100 rotate-2"
            )}
          >
            {/* The Polaroid Image */}
            <div className="aspect-square bg-zinc-200 overflow-hidden relative rounded-xs shadow-inner">
              <img 
                src={route.image} 
                className="w-full h-full object-cover"
                alt={route.name}
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            
            {/* Handwriting Label */}
            <div className="pt-4 flex flex-col items-center">
              <span className="text-[11px] font-black text-zinc-900 tracking-tighter uppercase italic leading-none handwritten text-purple-600">
                {route.name}
              </span>
              <span className="text-[16px] leading-none mt-2">{route.sticker}</span>
            </div>

            {/* Thumbtack Effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-800 rounded-full shadow-lg border border-white/20" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
