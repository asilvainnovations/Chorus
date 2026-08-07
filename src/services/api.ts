// src/services/api.ts
import { ChatCompletionRequest } from '../types';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

const headers: Record<string, string> = {
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
  'X-Title': 'Huli Ka AI',
};

export { OPENROUTER_BASE_URL, headers };

export const sendChatMessage = async (
  request: ChatCompletionRequest
): Promise<string> => {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...request, stream: false }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Chat API error:', error);
    throw error instanceof Error ? error : new Error('Failed to get AI response');
  }
};

let currentAbortController: AbortController | null = null;

export const streamChatMessage = async (
  request: ChatCompletionRequest,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> => {
  if (currentAbortController) {
    currentAbortController.abort();
  }

  currentAbortController = new AbortController();

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...request, stream: true }),
      signal: currentAbortController.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            const content = data.choices?.[0]?.delta?.content || '';
            if (content) onChunk(content);
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      onComplete();
      return;
    }
    onError(error instanceof Error ? error : new Error('Stream error occurred'));
  } finally {
    currentAbortController = null;
  }
};

export const abortCurrentStream = (): void => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
};

export const generateImage = async (
  prompt: string,
  model: string = 'openai/dall-e-3',
  size: string = '1024x1024',
  n: number = 1
): Promise<string[]> => {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/images/generations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model, prompt, size, n }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Image generation failed');
    }

    const data = await response.json();
    return data.data?.map((img: any) => img.url) || [];
  } catch (error) {
    console.error('Image generation error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate image');
  }
};

export const fetchURLContent = async (url: string): Promise<string> => {
  try {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const response = await fetch(`https://r.jina.ai/http://${cleanUrl}`);
    if (!response.ok) throw new Error('Failed to fetch URL');
    return await response.text();
  } catch (error) {
    console.error('URL fetch error:', error);
    throw new Error('Could not extract content from URL');
  }
};
