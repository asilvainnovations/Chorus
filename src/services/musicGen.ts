// src/services/musicGen.ts
import { MusicModel } from '../types';

export const MUSIC_MODELS: MusicModel[] = [
  {
    id: 'udio',
    name: 'Udio',
    provider: 'Udio',
    description: 'Full song generation with vocals and instruments',
    genres: ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz', 'R&B', 'Country'],
  },
  {
    id: 'suno',
    name: 'Suno',
    provider: 'Suno',
    description: 'AI music creation from text prompts',
    genres: ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz', 'Metal', 'Folk'],
  },
];

export const getMusicModelById = (id: string): MusicModel | undefined =>
  MUSIC_MODELS.find((m) => m.id === id);
