// src/services/imageGen.ts
import { ImageModel } from '../types';

export const IMAGE_MODELS: ImageModel[] = [
  {
    id: 'openai/dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    description: 'High-quality photorealistic images',
    aspectRatios: ['1024x1024', '1024x1792', '1792x1024'],
  },
  {
    id: 'stability-ai/stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    description: 'Open-source image generation',
    aspectRatios: ['1024x1024', '768x1344', '1344x768'],
  },
  {
    id: 'black-forest-labs/flux-schnell',
    name: 'FLUX.1 Schnell',
    provider: 'Black Forest Labs',
    description: 'Fast high-quality generation',
    aspectRatios: ['1024x1024', '768x1344', '1344x768'],
  },
  {
    id: 'recraft-ai/recraft-v3',
    name: 'Recraft V3',
    provider: 'Recraft',
    description: 'Vector art and illustrations',
    aspectRatios: ['1024x1024', '768x1344'],
  },
  {
    id: 'google/imagen-3',
    name: 'Imagen 3',
    provider: 'Google',
    description: 'Photorealistic image generation',
    aspectRatios: ['1024x1024', '768x1408'],
  },
];

export const getImageModelById = (id: string): ImageModel | undefined =>
  IMAGE_MODELS.find((m) => m.id === id);
