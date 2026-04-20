export type MotorbikeType = 'naked' | 'cafe' | 'harley' | 'speed' | 'futuristic' | 'adventure';
export type TerrainType = 'mountain' | 'forest' | 'desert' | 'sunset' | 'valley' | 'galaxy' | 'ocean';
export type BibleVersion = 'ESV' | 'NIV' | 'KJV' | 'MSG';

export interface UserSettings {
  bibleVersion: BibleVersion;
  voiceRate: number;
  voicePitch: number;
  preferredBike: MotorbikeType;
  lastOpened?: Date;
}

export type View = 'affirmation' | 'journal' | 'study' | 'pitstop' | 'garage' | 'dev' | 'chat' | 'trail' | 'basket' | 'spanish' | 'midnight';

export interface RouteConfig {
  id: string;
  name: string;
  description: string;
  bike: MotorbikeType;
  terrain: TerrainType;
  accentColor: string;
  secondaryColor: string; 
  greeting: string;
  sticker?: string; 
}

export const ROUTES: RouteConfig[] = [
  {
    id: 'palace-pass',
    name: 'The Palace Pass',
    description: 'A royal journey through Esther’s courage.',
    bike: 'harley',
    terrain: 'mountain',
    accentColor: '#8b5cf6', 
    secondaryColor: '#f59e0b', 
    greeting: '¡Hola, Hadassah! Walk with the King today.',
    sticker: '👑'
  },
  {
    id: 'bethlehem-trail',
    name: 'The Bethlehem Trail',
    description: 'Loyalty and harvest with Ruth.',
    bike: 'adventure',
    terrain: 'valley',
    accentColor: '#10b981', 
    secondaryColor: '#0ea5e9', 
    greeting: '¡Bendiciones, mi hermana! He provides in the field.',
    sticker: '🌾'
  },
  {
    id: 'midnight-galaxy',
    name: 'Midnight Galaxy',
    description: 'Riding through the stars of His promise.',
    bike: 'futuristic',
    terrain: 'galaxy',
    accentColor: '#c084fc', 
    secondaryColor: '#38bdf8', 
    greeting: '¡Buenas noches, Hadassah! His Word is your light.',
    sticker: '✨'
  },
  {
    id: 'chrome-canyon',
    name: 'Chrome Canyon',
    description: 'Raw strength in the desert of grace.',
    bike: 'naked',
    terrain: 'desert',
    accentColor: '#38bdf8', 
    secondaryColor: '#e2e8f0', 
    greeting: '¡Hola! Courage is your gear on this open road.',
    sticker: '🏍️'
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
  intensity: number; 
}

export interface GratitudeGrain {
  id?: number;
  date: Date;
  text: string;
  type: 'gratitude' | 'word';
}

export interface SpanishWord {
  id?: number;
  phrase: string;
  translation: string;
  context: string;
  type: 'Spanish' | 'English';
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
