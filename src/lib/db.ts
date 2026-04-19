import Dexie, { Table } from 'dexie';

export interface JournalEntry {
  id?: number;
  date: Date;
  moodId: string;
  struggle: string;
  affirmation: string; // The affirmation she received that day
  thoughts: string;
}

export interface Settings {
  id?: number;
  userName: string;
  passcode: string;
  language: 'en' | 'es' | 'mixed';
  preferredBike: string;
}

export class SelahRideDB extends Dexie {
  journalEntries!: Table<JournalEntry>;
  settings!: Table<Settings>;

  constructor() {
    super('SelahRideDB');
    this.version(1).stores({
      journalEntries: '++id, date, moodId',
      settings: '++id'
    });
  }
}

export const db = new SelahRideDB();
