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
  activeDomain?: string; // e.g., 'sustainable-development'
  relatedDomains?: string[];
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  relatedDomainIds: string[];
  frameworks: string[];
  resources: Resource[];
  systemPromptAddendum: string;
  suggestedQueries: string[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'framework' | 'case-study' | 'research' | 'tool' | 'initiative';
  description: string;
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

export interface ChatCompletionRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface AppContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  isOnline: boolean;
  isElectron: boolean;
}
