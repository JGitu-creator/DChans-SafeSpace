'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RefreshCw, Volume2, VolumeX, Bell, X } from 'lucide-react';
import { Affirmation } from '@/lib/types';
import AffirmationCard from './AffirmationCard';

interface Message {
  role: 'user' | 'selig';
  content: string;
  affirmation?: Affirmation;
}

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
      <div className={`relative max-w-[85%] p-5 rounded-[2rem] group shadow-xl ${
        msg.role === 'user' 
          ? 'bg-zinc-900 text-white font-medium' 
          : 'bg-white text-[#2d1b4d] border border-black/5'
      }`}>
        <p className={`text-sm leading-relaxed pr-6 ${msg.role === 'selig' ? 'handwritten text-lg' : ''}`}>
          {msg.content}
        </p>
        
        {msg.role === 'selig' && (
          <button 
            onClick={() => onSpeak(msg.content)}
            className="absolute top-3 right-3 text-zinc-400 hover:text-purple-600 transition-colors p-1"
          >
            {isSpeaking ? <VolumeX size={16} className="animate-pulse" /> : <Volume2 size={16} />}
          </button>
        )}
      </div>
      
      {msg.affirmation && (
        <div className="mt-6 w-full max-w-sm">
          <AffirmationCard affirmation={msg.affirmation} accentColor="#8b5cf6" />
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

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification("Selig's Selah", {
          body: "¡Hola, Hadassah! Notifications are active. I'll reach out to you on the road.",
          icon: "/hadassah-bike.png"
        });
      }
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (currentlySpeaking === text) {
        window.speechSynthesis.cancel();
        setCurrentlySpeaking(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && 
        (v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Serena') || v.name.includes('Martha'))
      );
      
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.pitch = 1.1;
      utterance.rate = 0.85;
      
      utterance.onend = () => setCurrentlySpeaking(null);
      setCurrentlySpeaking(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
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
      
      if (data.proverbHook) {
        setMessages(prev => [...prev, { 
          role: 'selig', 
          content: "Let me take that to the Word for you, Hadassah...", 
          affirmation: data 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'selig', content: data.text || "I'm with you, sister." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'selig', content: "I'm taking a moment to pray, mi hermana. Let's try again in a bit." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[70dvh] bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      {/* Chat Header */}
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500 rounded-2xl text-white shadow-lg shadow-purple-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black italic text-zinc-900 uppercase tracking-tighter">Talk with Selig</h2>
            <p className="text-zinc-400 text-[8px] font-black uppercase tracking-widest leading-none mt-1">Selah Engine v3.1</p>
          </div>
        </div>
        <button 
          onClick={requestNotificationPermission}
          className="p-3 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-purple-600 transition-all active:scale-90"
        >
          <Bell size={18} />
        </button>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar bg-[#fdf6e3]/30">
        {messages.map((msg, i) => (
          <ChatMessage 
            key={i} 
            msg={msg} 
            isSpeaking={currentlySpeaking === msg.content} 
            onSpeak={speak} 
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] italic ml-2">
            <RefreshCw size={12} className="animate-spin" />
            Selig is reflecting...
          </div>
        )}
      </div>

      {/* Input area - Responsive Bottom Sticky */}
      <div className="p-6 bg-white border-t border-zinc-100 flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Speak freely..."
          className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-800 focus:outline-none focus:border-purple-300 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-zinc-900 text-white p-4 rounded-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          <Send size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
