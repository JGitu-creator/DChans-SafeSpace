'use client';

import { motion } from 'framer-motion';
import { Code, Eye, Layers, Palette } from 'lucide-react';

export default function DevModeHint() {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 text-white">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-white/10 rounded-3xl mb-4">
          <Code size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Peek at the Engine</h2>
        <p className="text-white/60">Hadassah, your design eye is powerful. See how the code brings it to life.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <Palette size={24} />
            <h3 className="font-bold text-lg">The Colors</h3>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            The colors you see change dynamically. In CSS, we call these 'Variables'. You can control the vibe just by changing a few values.
          </p>
          <code className="block bg-black/40 p-3 rounded-lg text-xs font-mono text-emerald-300">
            --accent-color: #ef4444;
          </code>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Layers size={24} />
            <h3 className="font-bold text-lg">The Layers</h3>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            Everything is built with 'Components'. This card is a component. Designing them is like building with Lego.
          </p>
          <code className="block bg-black/40 p-3 rounded-lg text-xs font-mono text-blue-300">
            &lt;AffirmationCard /&gt;
          </code>
        </motion.div>
      </div>

      <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
        <p className="text-white/60 italic text-sm mb-4">
          "God is the ultimate Designer, and you are His masterpiece. Every line of code, like every breath, has a purpose."
        </p>
        <a 
          href="https://github.com/JGitu-creator/Selah-Ride"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-bold underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all"
        >
          Want to see the full source code?
        </a>
      </div>
    </div>
  );
}
