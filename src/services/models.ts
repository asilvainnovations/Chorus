// src/services/models.ts
import { AIModel, ImageModel, MusicModel } from '../types';

export const AI_MODELS: AIModel[] = [
  // OpenAI
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerId: 'openai/gpt-4o',
    description: 'Most capable multimodal model',
    maxTokens: 128000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    providerId: 'openai/gpt-4o-mini',
    description: 'Fast and affordable',
    maxTokens: 128000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'basic',
  },
  // Anthropic
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerId: 'anthropic/claude-3.5-sonnet',
    description: 'Excellent reasoning and coding',
    maxTokens: 200000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    providerId: 'anthropic/claude-3-haiku',
    description: 'Fast and efficient',
    maxTokens: 200000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'basic',
  },
  // Google
  {
    id: 'google/gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    providerId: 'google/gemini-1.5-pro',
    description: 'Long context and multimodal',
    maxTokens: 2000000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'google/gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    providerId: 'google/gemini-1.5-flash',
    description: 'Fast and versatile',
    maxTokens: 1000000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'basic',
  },
  // xAI
  {
    id: 'xai/grok-2',
    name: 'Grok 2',
    provider: 'xAI',
    providerId: 'xai/grok-2',
    description: 'Real-time web aware',
    maxTokens: 128000,
    supportsVision: true,
    supportsStreaming: true,
    category: 'premium',
  },
  // DeepSeek
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    providerId: 'deepseek/deepseek-chat',
    description: 'Strong reasoning model',
    maxTokens: 64000,
    supportsVision: false,
    supportsStreaming: true,
    category: 'premium',
  },
  // Mistral
  {
    id: 'mistral/mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    providerId: 'mistral/mistral-large',
    description: 'European leader',
    maxTokens: 128000,
    supportsVision: false,
    supportsStreaming: true,
    category: 'premium',
  },
  {
    id: 'mistral/mistral-small',
    name: 'Mistral Small',
    provider: 'Mistral',
    providerId: 'mistral/mistral-small',
    description: 'Efficient and fast',
    maxTokens: 32000,
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
