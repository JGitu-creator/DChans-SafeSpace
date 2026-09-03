'use client';

import { useSupabase } from './SupabaseProvider';
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyncStatus() {
  const { isSynced, isSyncing, error, isAuthenticated, syncData } = useSupabase();

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border shadow-lg transition-all ${
        error ? 'bg-red-500/10 border-red-500/20 text-red-600' : 
        isSyncing ? 'bg-sky-500/10 border-sky-500/20 text-sky-600' :
        isSynced ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' :
        'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
      }`}>
        <AnimatePresence mode="wait">
          {isSyncing ? (
            <motion.div
              key="syncing"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <RefreshCw size={14} />
            </motion.div>
          ) : error ? (
            <AlertCircle key="error" size={14} />
          ) : isSynced ? (
            <Cloud key="synced" size={14} />
          ) : (
            <CloudOff key="offline" size={14} />
          )}
        </AnimatePresence>
        
        <span className="text-[9px] font-black uppercase tracking-widest">
          {isSyncing ? 'Syncing...' : error ? error : isSynced ? 'Cloud Synced' : 'Local Only'}
        </span>

        {error && (
          <button 
            onClick={() => syncData()}
            className="ml-1 p-1 hover:bg-red-500/20 rounded-full transition-colors"
          >
            <RefreshCw size={10} />
          </button>
        )}
      </div>
    </div>
  );
}
