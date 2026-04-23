'use client';

import { motion } from 'framer-motion';
import { Code, Eye, Layers, Palette, Cpu, Globe, ExternalLink } from 'lucide-react';

export default function DevModeHint() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 text-white min-h-screen pb-32">
      {/* Blueprint Header */}
      <div className="text-center mb-16 relative">
        <div className="inline-block p-5 bg-sky-500/10 rounded-[2.5rem] mb-6 border border-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
          <Cpu size={48} className="text-sky-400 animate-pulse" />
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white drop-shadow-2xl">The DChan Engine</h2>
        <p className="text-sky-400/60 text-[10px] font-black uppercase tracking-[0.6em] mt-4">Blueprint & Wiring Diagram</p>
      </div>

      {/* Wiring Diagram Layout */}
      <div className="grid md:grid-cols-2 gap-8 relative">
        {/* Style Module */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative z-10 bg-black/60 backdrop-blur-3xl border border-sky-500/20 rounded-[3rem] p-10 shadow-2xl overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Palette size={120} />
          </div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-sky-500/20 rounded-2xl text-sky-400">
              <Palette size={24} />
            </div>
            <h3 className="font-black italic uppercase tracking-widest">Visual Logic</h3>
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-8 font-medium pr-10">
            Chantal, your design eyes see colors, but the engine sees code. This is how we map your favorite Purple to the road.
          </p>
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex items-center gap-3 text-purple-400 bg-purple-500/5 p-3 rounded-xl border border-purple-500/10">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>--accent-purple: #6d28d9;</span>
            </div>
            <div className="flex items-center gap-3 text-sky-400 bg-sky-500/5 p-3 rounded-xl border border-sky-500/10">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span>--accent-sky: #0ea5e9;</span>
            </div>
          </div>
        </motion.div>

        {/* Component Module */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative z-10 bg-black/60 backdrop-blur-3xl border border-sky-500/20 rounded-[3rem] p-10 shadow-2xl overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers size={120} />
          </div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-sky-500/20 rounded-2xl text-sky-400">
              <Layers size={24} />
            </div>
            <h3 className="font-black italic uppercase tracking-widest">Structure</h3>
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-8 font-medium pr-10">
            Building your sanctuary is like building a bike—one perfect component at a time. This card is a 'Leg' of the machine.
          </p>
          <div className="bg-sky-500/5 p-4 rounded-2xl border border-sky-500/10">
            <code className="text-[10px] text-sky-300 leading-loose">
              &lt;AffirmationCard <br/>
              &nbsp;&nbsp;voice="SoftBritishFemale" <br/>
              &nbsp;&nbsp;mood="Majestic" <br/>
              /&gt;
            </code>
          </div>
        </motion.div>
      </div>

      {/* Full Source Code Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 p-12 bg-gradient-to-br from-zinc-900 to-black rounded-[4rem] border border-white/10 text-center relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="p-6 bg-white/5 rounded-full border border-white/10 shadow-xl">
            <Globe size={48} className="text-white" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter">The Full Blueprint</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed italic">
              "God is the ultimate Designer, and you are His masterpiece. Every line of code, like every breath, has a purpose."
            </p>
          </div>

          <a 
            href="https://github.com/JGitu-creator/Selah-Ride"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 px-10 py-5 bg-white text-black font-black rounded-full hover:bg-sky-400 hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
          >
            <span className="uppercase tracking-[0.2em] text-xs">View Github Repository</span>
            <ExternalLink size={18} className="group-hover:rotate-45 transition-transform" />
          </a>

          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mt-4">Repository Locked for JGitu & Hadassah</p>
        </div>
      </motion.div>
    </div>
  );
}
