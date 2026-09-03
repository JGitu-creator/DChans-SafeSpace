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
      console.log("Starting data sync for user:", user.id);

      // 1. Pull from Supabase to Dexie (Cloud wins for new devices)
      const pullFromCloud = async () => {
        console.log("Pulling journal entries from Supabase...");
        try {
          // Journal Entries
          const { data: cloudEntries, error: e1 } = await supabase.from('journal_entries').select('*');
          if (e1) { throw e1; }
          if (cloudEntries) {
            console.log("Fetched cloud journal entries:", cloudEntries.length);
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
                  console.log("Pulled new journal entry to Dexie:", entry.id);
               }
            }
          }
        } catch (e: any) { console.warn("Pull journal_entries failed:", e); setError("Journal sync error: " + e.message); }

        console.log("Pulling ebenezer stones from Supabase...");
        try {
          // Ebenezer Stones
          const { data: cloudStones, error: e2 } = await supabase.from('ebenezer_stones').select('*');
          if (e2) { throw e2; }
          if (cloudStones) {
            console.log("Fetched cloud ebenezer stones:", cloudStones.length);
             for (const stone of cloudStones) {
                const local = await db.ebenezerStones.get(stone.id);
                if (!local) {
                   await db.ebenezerStones.put({
                      id: stone.id,
                      date: new Date(stone.date),
                      note: stone.note,
                      intensity: stone.intensity
                   });
                   console.log("Pulled new ebenezer stone to Dexie:", stone.id);
                }
             }
          }
        } catch (e: any) { console.warn("Pull ebenezer_stones failed:", e); setError("Ebenezer Stones sync error: " + e.message); }
        
        console.log("Pulling game progress from Supabase...");
        try {
          // Game Progress
          const { data: cloudProgress, error: e3 } = await supabase.from('game_progress').select('*');
          if (e3) { throw e3; }
          if (cloudProgress) {
            console.log("Fetched cloud game progress:", cloudProgress.length);
             for (const p of cloudProgress) {
                const local = await db.gameProgress.where({ itemId: p.item_id }).first();
                if (!local) {
                   await db.gameProgress.put({
                      gameType: p.game_type,
                      itemId: p.item_id,
                      completedAt: new Date(p.completed_at)
                   });
                   console.log("Pulled new game progress to Dexie:", p.item_id);
                }
             }
          }
        } catch (e: any) { console.warn("Pull game_progress failed:", e); setError("Game Progress sync error: " + e.message); }

        console.log("Pulling gratitude grains from Supabase...");
        try {
          // Gratitude Grains
          const { data: cloudGrains, error: e4 } = await supabase.from('gratitude_grains').select('*');
          if (e4) { throw e4; }
          if (cloudGrains) {
            console.log("Fetched cloud gratitude grains:", cloudGrains.length);
             for (const g of cloudGrains) {
                const local = await db.gratitudeGrains.get(g.id);
                if (!local) {
                   await db.gratitudeGrains.put({
                      id: g.id,
                      date: new Date(g.date),
                      text: g.text,
                      type: g.type
                   });
                   console.log("Pulled new gratitude grain to Dexie:", g.id);
                }
             }
          }
        } catch (e: any) { console.warn("Pull gratitude_grains failed:", e); setError("Gratitude Grains sync error: " + e.message); }

        console.log("Pulling spanish words from Supabase...");
        try {
          // Spanish Words
          const { data: cloudWords, error: e5 } = await supabase.from('spanish_words').select('*');
          if (e5) { throw e5; }
          if (cloudWords) {
            console.log("Fetched cloud spanish words:", cloudWords.length);
             for (const w of cloudWords) {
                const local = await db.spanishWords.get(w.id);
                if (!local) {
                   await db.spanishWords.put({
                      id: w.id,
                      phrase: w.phrase,
                      translation: w.translation,
                      context: w.context,
                      type: w.type
                   });
                   console.log("Pulled new spanish word to Dexie:", w.id);
                }
             }
          }
        } catch (e: any) { console.warn("Pull spanish_words failed:", e); setError("Spanish Words sync error: " + e.message); }
      };

      // 2. Push from Dexie to Supabase (Local wins for fresh work)
      const pushToCloud = async () => {
        console.log("Pushing journal entries to Supabase...");
        try {
          const localEntries = await db.journalEntries.toArray();
          console.log("Local journal entries to push:", localEntries.length);
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
             console.log("Pushed journal entry to Supabase:", entry.id);
          }
        } catch (e: any) { console.warn("Push journal_entries failed:", e); setError("Journal push error: " + e.message); }

        console.log("Pushing ebenezer stones to Supabase...");
        try {
          const localStones = await db.ebenezerStones.toArray();
          console.log("Local ebenezer stones to push:", localStones.length);
          for (const stone of localStones) {
             await supabase.from('ebenezer_stones').upsert({
                id: stone.id,
                user_id: user.id,
                date: stone.date,
                note: stone.note,
                intensity: stone.intensity
             });
             console.log("Pushed ebenezer stone to Supabase:", stone.id);
          }
        } catch (e: any) { console.warn("Push ebenezer_stones failed:", e); setError("Ebenezer Stones push error: " + e.message); }

        console.log("Pushing game progress to Supabase...");
        try {
          const localProgress = await db.gameProgress.toArray();
          console.log("Local game progress to push:", localProgress.length);
          for (const p of localProgress) {
             await supabase.from('game_progress').upsert({
                user_id: user.id,
                game_type: p.gameType,
                item_id: p.itemId,
                completed_at: p.completedAt
             });
             console.log("Pushed game progress to Supabase:", p.itemId);
          }
        } catch (e: any) { console.warn("Push game_progress failed:", e); setError("Game Progress push error: " + e.message); }

        console.log("Pushing gratitude grains to Supabase...");
        try {
          const localGrains = await db.gratitudeGrains.toArray();
          console.log("Local gratitude grains to push:", localGrains.length);
          for (const g of localGrains) {
             await supabase.from('gratitude_grains').upsert({
                id: g.id,
                user_id: user.id,
                date: g.date,
                text: g.text,
                type: g.type
             });
             console.log("Pushed gratitude grain to Supabase:", g.id);
          }
        } catch (e: any) { console.warn("Push gratitude_grains failed:", e); setError("Gratitude Grains push error: " + e.message); }

        console.log("Pushing spanish words to Supabase...");
        try {
          const localWords = await db.spanishWords.toArray();
          console.log("Local spanish words to push:", localWords.length);
          for (const w of localWords) {
             await supabase.from('spanish_words').upsert({
                id: w.id,
                user_id: user.id,
                phrase: w.phrase,
                translation: w.translation,
                context: w.context,
                type: w.type
             });
             console.log("Pushed spanish word to Supabase:", w.id);
          }
        } catch (e: any) { console.warn("Push spanish_words failed:", e); setError("Spanish Words push error: " + e.message); }
      };

      await pullFromCloud();
      await pushToCloud();
      
      setIsSynced(true);
      console.log("Data sync completed successfully.");
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
