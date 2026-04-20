'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Affirmation } from '@/lib/types';
import AffirmationCard from './AffirmationCard';

interface MessageProps {
  msg: Message;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
}

function ChatMessage({ msg, isSpeaking, onSpeak }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
    >
      <div className={`relative max-w-[85%] p-4 rounded-2xl group ${
        msg.role === 'user' 
          ? 'bg-white text-black font-medium' 
          : 'bg-white/10 text-white border border-white/10'
      }`}>
        <p className="text-sm leading-relaxed pr-6">{msg.content}</p>
        
        {msg.role === 'selig' && (
          <button 
            onClick={() => onSpeak(msg.content)}
            className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors p-1"
          >
            {isSpeaking ? <VolumeX size={14} className="animate-pulse" /> : <Volume2 size={14} />}
          </button>
        )}
      </div>
      
      {msg.affirmation && (
        <div className="mt-4 w-full">
          <AffirmationCard affirmation={msg.affirmation} accentColor="#ffffff" />
        </div>
      )}
    </motion.div>
  );
}

export default function SeligChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'selig', content: "¡Hola, Hadassah! Selig is here with you. How is the road today, mi hermana?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (currentlySpeaking === text) {
        window.speechSynthesis.cancel();
        setCurrentlySpeaking(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.1;
      utterance.rate = 0.9;
      utterance.onend = () => setCurrentlySpeaking(null);
      setCurrentlySpeaking(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/selig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        })
      });

      const data = await response.json();
      
      // If Selig returned an affirmation object, show it
      if (data.proverbHook) {
        setMessages(prev => [...prev, { 
          role: 'selig', 
          content: "Let's look at the Word for this...", 
          affirmation: data 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'selig', content: data.text || "I'm with you, Hadassah." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'selig', content: "I'm taking a moment to pray, mi hermana. Let's try again in a bit." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[70vh] bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-full">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">Chat with Selig</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Your Best Friend</p>
        interface Message {
          role: 'user' | 'selig';
          content: string;
          affirmation?: Affirmation;
        }

        export default function SeligChat() {
        ...
              {/* Messages area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {messages.map((msg, i) => (
                  <ChatMessage 
                    key={i} 
                    msg={msg} 
                    isSpeaking={currentlySpeaking === msg.content} 
                    onSpeak={speak} 
                  />
                ))}
                {isLoading && (
        ...
          <div className="flex items-center gap-2 text-white/40 text-xs italic">
            <RefreshCw size={12} className="animate-spin" />
            Selig is reflecting...
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Speak freely with Selig..."
          className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-white/30"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-white text-black p-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
