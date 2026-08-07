// src/services/search.ts
import { SearchResult } from '../types';

const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY || '';
const TAVILY_BASE_URL = 'https://api.tavily.com';

export interface SearchOptions {
  query: string;
  searchDepth?: 'basic' | 'advanced';
  maxResults?: number;
  includeAnswer?: boolean;
  includeImages?: boolean;
  includeRawContent?: boolean;
}

export const searchWeb = async (options: SearchOptions): Promise<{
  results: SearchResult[];
  answer?: string;
}> => {
  if (!TAVILY_API_KEY) {
    console.warn('Tavily API key not configured, returning empty results');
    return { results: [] };
  }

  try {
    const response = await fetch(`${TAVILY_BASE_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: options.query,
        search_depth: options.searchDepth || 'advanced',
        max_results: options.maxResults || 5,
        include_answer: options.includeAnswer ?? true,
        include_images: options.includeImages ?? false,
        include_raw_content: options.includeRawContent ?? false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();

    const results: SearchResult[] = (data.results || []).map((r: any) => ({
      title: r.title || 'Untitled',
      url: r.url || '',
      snippet: r.content || r.snippet || '',
      source: new URL(r.url || 'https://unknown.com').hostname.replace('www.', ''),
    }));

    return {
      results,
      answer: data.answer,
    };
  } catch (error) {
    console.error('Web search error:', error);
    return { results: [] };
  }
};

// Fallback mock for development
export const mockSearchResults: SearchResult[] = [
  {
    title: 'OpenAI Documentation',
    url: 'https://platform.openai.com/docs',
    snippet: 'Comprehensive documentation for OpenAI API integration...',
    source: 'openai.com',
  },
  {
    title: 'Anthropic Claude API',
    url: 'https://docs.anthropic.com',
    snippet: 'Build with Claude, Anthropic\'s AI assistant...',
    source: 'anthropic.com',
  },
  {
    title: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    snippet: 'Build generative AI applications with Gemini...',
    source: 'google.com',
  },
];
