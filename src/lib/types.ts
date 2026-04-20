export type MotorbikeType = 'naked' | 'cafe' | 'harley' | 'speed' | 'futuristic' | 'adventure';
export type TerrainType = 'mountain' | 'forest' | 'desert' | 'sunset' | 'valley' | 'galaxy' | 'ocean';
export type BibleVersion = 'ESV' | 'NIV' | 'KJV' | 'RV1960';

export interface UserSettings {
  bibleVersion: BibleVersion;
  voiceRate: number;
  voicePitch: number;
  preferredBike: MotorbikeType;
  lastOpened?: Date;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  bike: MotorbikeType;
  terrain: TerrainType;
  accentColor: string;
  greeting: string;
}

export const MOODS: ThemeConfig[] = [
  {
    id: 'uphill-climb',
    name: 'Uphill Climb',
    description: 'When the path is steep and you need courage.',
    bike: 'adventure',
    terrain: 'mountain',
    accentColor: '#ef4444', 
    greeting: '¡Hola, Hadassah! For such a time as this.'
  },
  {
    id: 'peaceful-valley',
    name: 'Peaceful Valley',
    description: 'A quiet ride to restore your soul.',
    bike: 'cafe',
    terrain: 'valley',
    accentColor: '#10b981', 
    greeting: '¡Bendiciones, querida! Rest in His peace.'
  },
  {
    id: 'midnight-run',
    name: 'Midnight Run',
    description: 'Deep reflection under the stars.',
    bike: 'harley',
    terrain: 'forest',
    accentColor: '#6366f1', 
    greeting: '¡Buenas noches, Hadassah! His faithfulness is your shield.'
  },
  {
    id: 'desert-speed',
    name: 'Desert Speed',
    description: 'Fast, bold, and forward-looking.',
    bike: 'speed',
    terrain: 'desert',
    accentColor: '#f59e0b', 
    greeting: '¡Hola, mi hermana! The King is with you on the open road.'
  },
  {
    id: 'neon-future',
    name: 'Neon Future',
    description: 'A futuristic ride through digital grace.',
    bike: 'futuristic',
    terrain: 'galaxy',
    accentColor: '#ec4899', 
    greeting: '¡Hola, Hadassah! Your future is bright in His hands.'
  }
];

export interface Affirmation {
  proverbHook: string;
  growthWord: {
    word: string;
    definition: string;
  };
  spanishPhrase: {
    phrase: string;
    translation: string;
  };
  deepExegesis: string;
  bibleVerse: string;
  isRoyalDecree?: boolean;
}

export interface EbenezerStone {
  id?: number;
  date: Date;
  note: string;
  intensity: number; // 0-1
}

export interface GratitudeGrain {
  id?: number;
  date: Date;
  text: string;
}

export interface SpanishWord {
  id?: number;
  phrase: string;
  translation: string;
  context: string;
}

export interface JournalEntry {
  id?: number;
  date: Date;
  moodId: string;
  struggle: string;
  affirmation: string;
  thoughts: string;
}

export interface Settings extends UserSettings {
  id?: number;
  userName: string;
  passcode: string;
  language: 'en' | 'es' | 'mixed';
}

export interface DesignBadge {
  id?: number;
  title: string;
  date: Date;
  type: 'architect' | 'designer' | 'engineer';
}
