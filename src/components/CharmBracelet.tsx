'use client';

import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles, MessageSquare, Book, Zap, Settings, Code, ShoppingBasket, Compass } from 'lucide-react';
import { View } from '@/lib/types';

interface CharmProps {
  id: View;
  icon: any;
  label: string;
  isActive: boolean;
  onClick: (id: View) => void;
  color: string;
}

function Charm({ id, icon: Icon, label, isActive, onClick, color }: CharmProps) {
  return (
    <motion.button
      whileHover={{ y: 5, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(id)}
      className="flex flex-col items-center gap-1 group relative"
    >
      {/* String leading to the charm */}
      <div className="w-0.5 h-8 bg-zinc-600 group-hover:bg-zinc-400 transition-colors" />
      
      {/* The Charm itself */}
      <div className={`
        p-3 rounded-full border-2 shadow-2xl transition-all duration-500
        ${isActive 
          ? 'bg-white border-white scale-110' 
          : 'bg-black/40 border-white/10 text-white/40 hover:border-white/40 hover:text-white'
        }
      `}
      style={{ 
        boxShadow: isActive ? `0 0 20px ${color}` : 'none',
        color: isActive ? color : undefined
      }}>
        <Icon size={20} strokeWidth={isActive ? 3 : 2} />
      </div>
      
      {/* Label */}
      <span className={`
        text-[8px] font-black uppercase tracking-widest transition-opacity duration-300
        ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-white/40'}
      `}>
        {label}
      </span>
    </motion.button>
  );
}

interface CharmBraceletProps {
  activeView: View;
  onViewChange: (view: View) => void;
  accentColor: string;
}

export default function CharmBracelet({ activeView, onViewChange, accentColor }: CharmBraceletProps) {
  const charms: { id: View; icon: any; label: string }[] = [
    { id: 'affirmation', icon: Compass, label: 'The Path' },
    { id: 'chat', icon: Sparkles, label: 'Selig' },
    { id: 'journal', icon: MessageSquare, label: 'Diary' },
    { id: 'trail', icon: MapPin, label: 'Trail' },
    { id: 'basket', icon: ShoppingBasket, label: 'Grains' },
    { id: 'pitstop', icon: Zap, label: 'Pit Stop' },
    { id: 'midnight', icon: Heart, label: 'Lamp' },
    { id: 'garage', icon: Settings, label: 'Garage' },
  ];

  return (
    <div className="w-full px-4 overflow-x-auto no-scrollbar py-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="flex justify-around items-start min-w-[500px] px-8">
        {charms.map((charm) => (
          <Charm
            key={charm.id}
            {...charm}
            isActive={activeView === charm.id}
            onClick={onViewChange}
            color={accentColor}
          />
        ))}
      </div>
    </div>
  );
}
