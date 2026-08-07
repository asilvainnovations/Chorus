# Huli Ka

> A production-ready multi-model AI chat interface with RAG search, image generation, and more.

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
```

## API Keys Required

| Service | Purpose | Get Key |
|---------|---------|---------|
| **OpenRouter** | AI model access | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **Tavily** | Web search (RAG) | [tavily.com](https://tavily.com/) |

## Architecture

```
src/
├── components/
│   ├── Chat/              # Chat interface
│   ├── CommandPalette/    # ⌘K command interface
│   ├── Common/            # Shared UI (ErrorBoundary, Toaster, etc.)
│   ├── Layout/            # AppLayout, Header
│   ├── ModelSelector/     # AI model dropdown
│   ├── Settings/          # Settings panel
│   └── Sidebar/           # Conversation history
├── context/
│   └── AppContext.tsx     # Global app state (toasts, online status)
├── hooks/
│   ├── useChat.ts         # Chat logic & API calls
│   ├── useCommandPalette.ts # Keyboard navigation
│   ├── useTheme.ts        # Dark/light/system theme
│   └── useLocalStorage.ts # Persistence helper
├── services/
│   ├── api.ts             # OpenRouter API client
│   ├── search.ts          # Tavily RAG search
│   ├── imageGen.ts        # Image model definitions
│   └── musicGen.ts        # Music model definitions
├── store/
│   └── chatStore.ts       # Zustand state management
├── types/
│   └── index.ts           # TypeScript definitions
├── App.tsx                # Root component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open Command Palette |
| `Ctrl/Cmd + N` | New Chat |
| `Ctrl/Cmd + Shift + S` | Switch to Search Mode |
| `Ctrl/Cmd + Shift + I` | Switch to Image Mode |
| `Ctrl/Cmd + Shift + C` | Switch to Chat Mode |
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Esc` | Close overlays |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `VITE_TAVILY_API_KEY` | Yes | Tavily search API key |
| `VITE_REPLICATE_API_TOKEN` | No | Replicate for advanced image models |
| `VITE_POSTHOG_KEY` | No | Analytics key |

## Building for Production

```bash
npm run build
```

Output is in `dist/`. Deploy to Vercel, Netlify, or any static host.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand (persistent)
- **Animation**: Framer Motion
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Icons**: Lucide React

## License

MIT © 2026 ASilva Innovations
