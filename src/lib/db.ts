import Dexie, { Table } from 'dexie';
import { JournalEntry, Settings, EbenezerStone, GratitudeGrain, SpanishWord, DesignBadge } from './types';

export class SelahRideDB extends Dexie {
  journalEntries!: Table<JournalEntry>;
  settings!: Table<Settings>;
  ebenezerStones!: Table<EbenezerStone>;
  gratitudeGrains!: Table<GratitudeGrain>;
  spanishWords!: Table<SpanishWord>;
  designBadges!: Table<DesignBadge>;

  constructor() {
    super('SelahRideDB');
    this.version(2).stores({
      journalEntries: '++id, date, moodId',
      settings: '++id',
      ebenezerStones: '++id, date',
      gratitudeGrains: '++id, date',
      spanishWords: '++id, phrase',
      designBadges: '++id, title'
    });
  }
}

export const db = new SelahRideDB();
