'use client';

import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles, MessageSquare, Book, Zap, Settings, Code, ShoppingBasket, Compass, Activity, Wind } from 'lucide-react';
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
      <div className={`w-0.5 h-6 transition-colors ${isActive ? 'bg-white' : 'bg-zinc-700'}`} />
      
      {/* The Charm itself */}
      <div className={`
        p-2.5 rounded-full border shadow-lg transition-all duration-500
        ${isActive 
          ? 'bg-white border-white scale-110 shadow-white/20' 
          : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'
        }
      `}
      style={{ 
        boxShadow: isActive ? `0 0 15px ${color}40` : 'none',
        color: isActive ? color : undefined
      }}>
        <Icon size={18} strokeWidth={isActive ? 3 : 2.5} />
      </div>
      
      {/* Label */}
      <span className={`
        text-[7px] font-black uppercase tracking-[0.2em] transition-opacity duration-300 mt-1
        ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-zinc-500'}
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
  const groups = [
    {
      name: 'Reflect',
      charms: [
        { id: 'affirmation' as View, icon: Compass, label: 'Path' },
        { id: 'journal' as View, icon: MessageSquare, label: 'Diary' },
        { id: 'thread' as View, icon: Activity, label: 'Thread' },
      ]
    },
    {
      name: 'Connect',
      charms: [
        { id: 'chat' as View, icon: Sparkles, label: 'Selig' },
        { id: 'basket' as View, icon: ShoppingBasket, label: 'Grains' },
        { id: 'trail' as View, icon: MapPin, label: 'Trail' },
      ]
    },
    {
      name: 'Rest',
      charms: [
        { id: 'pitstop' as View, icon: Zap, label: 'Break' },
        { id: 'midnight' as View, icon: Heart, label: 'Lamp' },
        { id: 'garage' as View, icon: Settings, label: 'Gear' },
      ]
    }
  ];

  return (
    <div className="w-full sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
      <div className="flex justify-between items-start min-w-[450px] px-8 py-2 max-w-4xl mx-auto">
        {groups.map((group) => (
          <div key={group.name} className="flex flex-col items-center gap-1">
            <div className="flex gap-4">
              {group.charms.map((charm) => (
                <Charm
                  key={charm.id}
                  {...charm}
                  isActive={activeView === charm.id}
                  onClick={onViewChange}
                  color={accentColor}
                />
              ))}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2" />
            <span className="text-[6px] font-black uppercase tracking-[0.5em] text-zinc-600 py-1">{group.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
