export type MotorbikeType = 'naked' | 'cafe' | 'harley' | 'speed' | 'futuristic' | 'adventure';
export type TerrainType = 'mountain' | 'forest' | 'desert' | 'sunset' | 'valley' | 'galaxy' | 'ocean';
export type BibleVersion = 'ESV' | 'NIV' | 'KJV' | 'RV1960';

export interface UserSettings {
  bibleVersion: BibleVersion;
  voiceRate: number;
  voicePitch: number;
  preferredBike: MotorbikeType;
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
}
