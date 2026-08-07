// src/services/models.ts
import { AIModel, ImageModel, MusicModel } from '../types';

export const AI_MODELS: AIModel[] = [
  // OpenAI
  {
    id: 'openai/gpt-5.1',
    name: 'GPT-5.1',
    provider: 'OpenAI',
    providerId: 'openai/gpt-5.1',
    description: 'Most capable multimodal model',
    maxTokens: 128000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'openai/gpt-5.1-mini',
    name: 'GPT-5.1 Mini',
    provider: 'OpenAI',
    providerId: 'openai/gpt-5.1-mini',
    description: 'Fast and affordable',
    maxTokens: 128000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'basic',
  },
  // Anthropic
  {
    id: 'anthropic/claude-sonnet-latest',
    name: 'Claude Sonnet',
    provider: 'Anthropic',
    providerId: 'anthropic/claude-sonnet-latest',
    description: 'Excellent reasoning and coding',
    maxTokens: 1000000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'anthropic/claude-haiku-latest',
    name: 'Claude Haiku',
    provider: 'Anthropic',
    providerId: 'anthropic/claude-haiku-latest',
    description: 'Fast and efficient',
    maxTokens: 200000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'basic',
  },
  // Google
  {
    id: 'google/gemini-pro-latest',
    name: 'Gemini Pro',
    provider: 'Google',
    providerId: 'google/gemini-pro-latest',
    description: 'Long context and multimodal',
    maxTokens: 1048576,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'google/gemini-flash-latest',
    name: 'Gemini Flash',
    provider: 'Google',
    providerId: 'google/gemini-flash-latest',
    description: 'Fast and versatile',
    maxTokens: 1048576,
    supportsVision: true,
    supportsStreaming: true,
    category: 'basic',
  },
  // xAI
  {
    id: 'x-ai/grok-4.3',
    name: 'Grok 4.3',
    provider: 'xAI',
    providerId: 'x-ai/grok-4.3',
    description: 'Real-time web aware',
    maxTokens: 128000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  // DeepSeek
  {
    id: 'deepseek/deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    provider: 'DeepSeek',
    providerId: 'deepseek/deepseek-v4-pro',
    description: 'Strong reasoning model',
    maxTokens: 1000000,
    supportsVision: false,
    supportsStreaming: true,
    category: 'premium',
  },
  // Mistral
  {
    id: 'mistralai/mistral-large-2512',
    name: 'Mistral Large 3',
    provider: 'Mistral',
    providerId: 'mistralai/mistral-large-2512',
    description: 'European leader',
    maxTokens: 262000,
    supportsVision: false,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'mistralai/mistral-small-2603',
    name: 'Mistral Small 4',
    provider: 'Mistral',
    providerId: 'mistralai/mistral-small-2603',
    description: 'Efficient and fast',
    maxTokens: 262000,
    supportsVision: false,
    supportsStreaming: true,
    category: 'basic',
  },
];

export const IMAGE_MODELS: ImageModel[] = [
  {
    id: 'openai/dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    description: 'High quality images',
    aspectRatios: ['1024x1024', '1024x1792', '1792x1024'],
  },
  {
    id: 'stability-ai/stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    description: 'Open source quality',
    aspectRatios: ['1024x1024', '768x1344', '1344x768'],
  },
  {
    id: 'black-forest-labs/flux-schnell',
    name: 'FLUX.1 Schnell',
    provider: 'Black Forest Labs',
    description: 'Fast generation',
    aspectRatios: ['1024x1024', '768x1344', '1344x768'],
  },
  {
    id: 'recraft-ai/recraft-v3',
    name: 'Recraft V3',
    provider: 'Recraft',
    description: 'Vector art specialist',
    aspectRatios: ['1024x1024', '768x1344'],
  },
  {
    id: 'google/imagen-3',
    name: 'Imagen 3',
    provider: 'Google',
    description: 'Photorealistic',
    aspectRatios: ['1024x1024', '768x1408'],
  },
];

export const MUSIC_MODELS: MusicModel[] = [
  {
    id: 'udio',
    name: 'Udio',
    provider: 'Udio',
    description: 'Full song generation',
    genres: ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz'],
  },
  {
    id: 'suno',
    name: 'Suno',
    provider: 'Suno',
    description: 'AI music creation',
    genres: ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz'],
  },
];

export const getModelById = (id: string): AIModel | undefined =>
  AI_MODELS.find((m) => m.id === id);

export const getBasicModels = () => AI_MODELS.filter((m) => m.category === 'basic');
export const getPremiumModels = () => AI_MODELS.filter((m) => m.category === 'premium');
