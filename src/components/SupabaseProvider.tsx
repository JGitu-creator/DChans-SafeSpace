'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';
import { UserSettings } from '@/lib/types';

interface SupabaseContextType {
  isSynced: boolean;
  isSyncing: boolean;
  error: string | null;
  syncData: () => Promise<void>;
  signIn: (pin: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Email Lock: Uses the email from environment variables, or a default fallback
  const userEmail = process.env.NEXT_PUBLIC_USER_EMAIL || "hadassah@safespace.internal"; 

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsAuthenticated(true);
      // Auto-sync on load if already logged in
      syncData();
    }
  };

  const signIn = async (pin: string): Promise<boolean> => {
    if (pin !== '1122') {
       setError("Invalid PIN");
       return false;
    }

    if (!supabase) {
      console.warn("Supabase not configured. Sync inactive.");
      setIsAuthenticated(true); // Allow local entry
      return true;
    }

    try {
      // Sign in or Sign up the locked account
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: `pin-${pin}-protection`
      });

      if (authError) {
        // If it's a "Invalid login credentials" it might be because the account doesn't exist yet
        // Try sign up if sign in fails
        const { error: signUpError } = await supabase.auth.signUp({
          email: userEmail,
          password: `pin-${pin}-protection`,
          options: {
            data: { user_name: 'Hadassah' }
          }
        });
        
        // If signUpError is "Email provider is disabled" or similar, we still let her in locally
        if (signUpError) {
           console.warn("Cloud Auth failed, entering local mode:", signUpError.message);
           setIsAuthenticated(true);
           return true; 
        }
      }

      setIsAuthenticated(true);
      setError(null);
      syncData();
      return true;
    } catch (e: any) {
      console.error("Auth error:", e);
      // FAIL-SAFE: Even if Supabase crashes, if the PIN is 1122, let her in!
      setIsAuthenticated(true);
      setError("Cloud sync delayed: " + e.message);
      return true;
    }
  };

  const syncData = async () => {
    if (isSyncing || !supabase) return;
    setIsSyncing(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Pull from Supabase to Dexie (Cloud wins for new devices)
      const pullFromCloud = async () => {
        // Journal Entries
        const { data: cloudEntries } = await supabase.from('journal_entries').select('*');
        if (cloudEntries) {
          for (const entry of cloudEntries) {
             const local = await db.journalEntries.get(entry.id);
             if (!local) {
                await db.journalEntries.put({
                  id: entry.id,
                  date: new Date(entry.date),
                  moodId: entry.mood_id,
                  struggle: entry.struggle,
                  affirmation: JSON.stringify(entry.affirmation),
                  thoughts: entry.thoughts
                });
             }
          }
        }

        // Ebenezer Stones
        const { data: cloudStones } = await supabase.from('ebenezer_stones').select('*');
        if (cloudStones) {
           for (const stone of cloudStones) {
              const local = await db.ebenezerStones.get(stone.id);
              if (!local) {
                 await db.ebenezerStones.put({
                    id: stone.id,
                    date: new Date(stone.date),
                    note: stone.note,
                    intensity: stone.intensity
                 });
              }
           }
        }
        
        // Game Progress
        const { data: cloudProgress } = await supabase.from('game_progress').select('*');
        if (cloudProgress) {
           for (const p of cloudProgress) {
              const local = await db.gameProgress.where({ itemId: p.item_id }).first();
              if (!local) {
                 await db.gameProgress.put({
                    gameType: p.game_type,
                    itemId: p.item_id,
                    completedAt: new Date(p.completed_at)
                 });
              }
           }
        }
      };

      // 2. Push from Dexie to Supabase (Local wins for fresh work)
      const pushToCloud = async () => {
        const localEntries = await db.journalEntries.toArray();
        for (const entry of localEntries) {
           await supabase.from('journal_entries').upsert({
              id: entry.id,
              user_id: user.id,
              date: entry.date,
              mood_id: entry.moodId,
              struggle: entry.struggle,
              affirmation: JSON.parse(entry.affirmation),
              thoughts: entry.thoughts
           });
        }

        const localStones = await db.ebenezerStones.toArray();
        for (const stone of localStones) {
           await supabase.from('ebenezer_stones').upsert({
              id: stone.id,
              user_id: user.id,
              date: stone.date,
              note: stone.note,
              intensity: stone.intensity
           });
        }

        const localProgress = await db.gameProgress.toArray();
        for (const p of localProgress) {
           await supabase.from('game_progress').upsert({
              user_id: user.id,
              game_type: p.gameType,
              item_id: p.itemId,
              completed_at: p.completedAt
           });
        }
      };

      await pullFromCloud();
      await pushToCloud();
      
      setIsSynced(true);
    } catch (e: any) {
      console.error("Sync error:", e);
      setError("Sync failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SupabaseContext.Provider value={{ isSynced, isSyncing, error, syncData, signIn, isAuthenticated }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
