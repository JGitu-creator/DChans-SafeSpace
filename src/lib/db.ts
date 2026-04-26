import Dexie, { Table } from 'dexie';
import { JournalEntry, Settings, EbenezerStone, GratitudeGrain, SpanishWord, DesignBadge } from './types';

export class DChansSafespaceDB extends Dexie {
  journalEntries!: Table<JournalEntry>;
  settings!: Table<Settings>;
  ebenezerStones!: Table<EbenezerStone>;
  gratitudeGrains!: Table<GratitudeGrain>;
  spanishWords!: Table<SpanishWord>;
  designBadges!: Table<DesignBadge>;
  gameProgress!: Table<{ id?: number, gameType: string, itemId: string, completedAt: Date }>;

  constructor() {
    super('DChansSafespaceDB');
    this.version(3).stores({
      journalEntries: '++id, date, moodId',
      settings: '++id',
      ebenezerStones: '++id, date',
      gratitudeGrains: '++id, date',
      spanishWords: '++id, phrase',
      designBadges: '++id, title',
      gameProgress: '++id, gameType, itemId'
    });
  }
}

export const db = new DChansSafespaceDB();
