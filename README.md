# Huli Ka

&gt; A production-ready multi-model AI chat interface with RAG search, image generation, and more.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Model Chat** | 10+ models via OpenRouter (OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral) |
| **Streaming** | Real-time SSE streaming with abort capability |
| **RAG Search** | Tavily-powered web search with citation injection |
| **Image Generation** | DALL-E 3, Stable Diffusion XL, FLUX, Recraft, Imagen 3 |
| **Music Generation** | Udio & Suno integration |
| **Command Palette** | `Ctrl/Cmd+K` keyboard-driven command interface |
| **Dark/Light Mode** | System-aware with manual override |
| **Voice Input** | Web Speech API integration |
| **PDF/URL Analysis** | Document parsing and URL summarization |
| **Persistent State** | Zustand + localStorage for conversations & settings |

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/asilvainnovations/huli-ka.git
cd huli-ka

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your API keys

# 4. Start development server
npm run dev
