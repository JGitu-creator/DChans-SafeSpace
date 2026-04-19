export type MotorbikeType = 'naked' | 'cafe' | 'harley' | 'speed';
export type TerrainType = 'mountain' | 'forest' | 'desert' | 'sunset' | 'valley';

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
    bike: 'naked',
    terrain: 'mountain',
    accentColor: '#ef4444', // Red-500
    greeting: '¡Hola, Hadassah! For such a time as this.'
  },
  {
    id: 'peaceful-valley',
    name: 'Peaceful Valley',
    description: 'A quiet ride to restore your soul.',
    bike: 'cafe',
    terrain: 'valley',
    accentColor: '#10b981', // Emerald-500
    greeting: '¡Bendiciones, querida! Rest in His peace.'
  },
  {
    id: 'midnight-run',
    name: 'Midnight Run',
    description: 'Deep reflection under the stars.',
    bike: 'harley',
    terrain: 'forest',
    accentColor: '#6366f1', // Indigo-500
    greeting: '¡Buenas noches, Hadassah! His faithfulness is your shield.'
  },
  {
    id: 'desert-speed',
    name: 'Desert Speed',
    description: 'Fast, bold, and forward-looking.',
    bike: 'speed',
    terrain: 'desert',
    accentColor: '#f59e0b', // Amber-500
    greeting: '¡Hola, mi hermana! The King is with you on the open road.'
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
