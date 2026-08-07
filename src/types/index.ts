// src/types/index.ts

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  citations?: Citation[];
  images?: GeneratedImage[];
  isStreaming?: boolean;
  searchResults?: SearchResult[];
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  index: number;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
  mode: ChatMode;
}

export type ChatMode = 'chat' | 'search' | 'image' | 'music' | 'pdf' | 'url';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  providerId: string;
  description: string;
  maxTokens: number;
  supportsVision: boolean;
  supportsStreaming: boolean;
  category: 'basic' | 'premium' | 'image' | 'music';
}

export interface ImageModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  aspectRatios: string[];
}

export interface MusicModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  genres: string[];
}

export interface CommandItem {
  id: string;
  title: string;
  shortcut?: string;
  icon: string;
  action: () => void;
  category: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultModel: string;
  apiKey: string;
  streamingEnabled: boolean;
  soundEnabled: boolean;
}

// AppContext types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
