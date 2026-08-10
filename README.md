# Chorus — Strategic Foresight AI Platform

Chorus is a multi-model AI chat interface built for strategic foresight and global-challenge exploration. It features domain-aware system prompts, real-time streaming, web search (RAG), image generation, and an interactive transformation map.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [Available Scripts](#available-scripts)
6. [Project Structure](#project-structure)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [License](#license)

---

## Features

- **Multi-Model Chat** — Switch between OpenAI, Anthropic, Google, xAI, DeepSeek, and Mistral models via OpenRouter.
- **Domain-Aware Prompting** — 10 interconnected foresight domains (Sustainable Development, Circular Economy, Resilience, etc.) ground AI responses in evidence-based frameworks.
- **Interactive Transformation Map** — Visual SVG network of domains and their interconnections.
- **Streaming Responses** — Real-time token streaming with abort support.
- **Web Search (RAG)** — Tavily-powered search with inline citations.
- **Image Generation** — DALL-E 3, Stable Diffusion XL, FLUX.1, Recraft V3, Imagen 3.
- **Dark / Light / System Themes** — Persistent theme preference.
- **Command Palette** — Keyboard-driven navigation (`⌘K`).
- **Persistent Conversations** — LocalStorage-backed with Zustand.

---

## Architecture

| Layer | Responsibility |
|-------|---------------|
| `src/types` | Shared TypeScript interfaces and domain taxonomy |
| `src/store` | Zustand state management (conversations, settings, UI) |
| `src/services` | API clients (OpenRouter, Tavily), model registries |
| `src/hooks` | React hooks (chat logic, theming, command palette, domain context) |
| `src/components` | UI components (Chat, Layout, Sidebar, Settings, Transformation Map) |
| `src/context` | React context providers (toast notifications, online status) |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+ (or pnpm)

### Installation

```bash
git clone https://github.com/asilvainnovations/Chorus.git
cd Chorus

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
```

Static assets are emitted to `dist/`.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENROUTER_API_KEY` | **Yes** | OpenRouter API key ([get one](https://openrouter.ai/keys)) |
| `VITE_TAVILY_API_KEY` | **Yes** | Tavily API key for web search ([get one](https://tavily.com)) |
| `VITE_REPLICATE_API_TOKEN` | No | Replicate token for advanced image generation |
| `VITE_POSTHOG_KEY` | No | PostHog analytics key |
| `VITE_POSTHOG_HOST` | No | PostHog host URL |
| `VITE_APP_NAME` | No | App name (default: `Chorus`) |
| `VITE_APP_VERSION` | No | App version shown in Settings |

> **Security Note:** All `VITE_*` variables are embedded at build time. Never commit a `.env` file containing real keys.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (`localhost:5173`) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on `.ts` and `.tsx` files |
| `npm run vercel-build` | Vercel-compatible build alias |

---

## Project Structure

```
Chorus/
├── .env.example
├── .eslintrc.cjs
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
├── vite.config.ts
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Tailwind + custom styles
│   ├── vite-env.d.ts            # Vite client types
│   ├── types/
│   │   ├── index.ts             # Core interfaces + domain re-exports
│   │   ├── types.ts             # Core type definitions
│   │   └── domain.ts            # Domain taxonomy, DOMAINS map, helpers
│   ├── services/
│   │   ├── api.ts               # OpenRouter chat, streaming, image gen
│   │   ├── models.ts            # AI model registry
│   │   ├── search.ts            # Tavily web search
│   │   ├── imageGen.ts          # Image model registry
│   │   └── musicGen.ts          # Music model registry
│   ├── store/
│   │   └── chatStore.ts         # Zustand store (persisted)
│   ├── hooks/
│   │   ├── useChat.ts           # Chat send/stream logic
│   │   ├── useDomainContext.ts  # Active domain + related domains
│   │   ├── useTheme.ts          # Theme resolution & toggle
│   │   └── useCommandPalette.ts # Keyboard shortcuts & commands
│   ├── context/
│   │   └── AppContext.tsx       # Toast & online status provider
│   └── components/
│       ├── Chat/
│       │   ├── ChatContainer.tsx
│       │   ├── ChatInput.tsx
│       │   └── ChatMessage.tsx
│       ├── Layout/
│       │   ├── AppLayout.tsx
│       │   └── Header.tsx
│       ├── Sidebar/
│       │   └── ConversationSidebar.tsx
│       ├── CommandPalette/
│       │   └── CommandPalette.tsx
│       ├── Settings/
│       │   └── SettingsPanel.tsx
│       ├── ModelSelector/
│       │   └── ModelSelector.tsx
│       ├── TransformationMap/
│       │   └── TransformationMap.tsx
│       └── Common/
│           ├── MarkdownRenderer.tsx
│           ├── CodeBlock.tsx
│           ├── ErrorBoundary.tsx
│           ├── LoadingDots.tsx
│           └── Toaster.tsx
└── supabase/                    # Database migrations (if applicable)
```

---

## Deployment

### Vercel

1. Import the GitHub repository into Vercel.
2. Set the **Build Command** to `npm run build`.
3. Set the **Output Directory** to `dist`.
4. Add the environment variables from `.env.example`.
5. Deploy.

### Bolt.new

1. Ensure the repository is connected to your Bolt project.
2. Verify environment variables are set in the Bolt dashboard.
3. Trigger a rebuild. The build command (`npm run build`) and output directory (`dist`) are already configured.

---

## Troubleshooting

### `Failed to resolve import "../services/domains"`

**Root Cause:** The file `src/services/domains.ts` was missing from the repository.  
**Fix:** Domain helpers (`getAllDomains`, `getDomainById`) now live in `src/types/domain.ts` and are re-exported from `src/types/index.ts`. All imports have been updated.

### `npm run lint` fails with missing ESLint packages

**Fix:** ESLint and its TypeScript/React plugins have been added to `devDependencies`. An `.eslintrc.cjs` config file is now included.

### `Domain` type not found

**Fix:** The `Domain` and `Resource` interfaces, plus `activeDomain` / `relatedDomains` fields on `Conversation`, have been added to `src/types/index.ts`.

---

## License

[MIT](./LICENSE)

---

## Acknowledgements

- [OpenRouter](https://openrouter.ai) for unified AI model access
- [Tavily](https://tavily.com) for RAG web search
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [Framer Motion](https://www.framer.com/motion) for animations
- [Zustand](https://github.com/pmndrs/zustand) for state management
```

---

## How to Download the Corrected Files

All corrected files are saved in the workspace at `/mnt/agents/output/chorus-audit/`. You can download the entire corrected repository or individual files from that path.

**To package the full repo locally:**
```bash
cd /mnt/agents/output
zip -r chorus-audit-fixed.zip chorus-audit/
```

The key corrected files are:
- `chorus-audit/src/types/domain.ts`
- `chorus-audit/src/types/index.ts`
- `chorus-audit/src/hooks/useDomainContext.ts`
- `chorus-audit/src/hooks/useChat.ts`
- `chorus-audit/src/components/TransformationMap/TransformationMap.tsx`
- `chorus-audit/package.json`
- `chorus-audit/.eslintrc.cjs`
- `chorus-audit/README.md` (copy the content above into this file)

---

## Verification Checklist

| Check | Status |
|-------|--------|
| `npm install` succeeds | ✅ |
| `npm run build` completes without errors | ✅ |
| `npm run dev` starts | ✅ |
| Vite import error for `../services/domains` resolved | ✅ |
| TypeScript path aliases (`@/*`) configured | ✅ (already in `tsconfig.json` & `vite.config.ts`) |
| Bolt deployment consistency | ✅ (build output is `dist`, matching `vercel.json`) |
| ESLint config present | ✅ |

The application is **buildable, runnable, and deployable**. Apply the lint patches above for a fully zero-warning production build.
