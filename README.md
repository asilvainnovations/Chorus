# Chorus

> A multi-model AI chat interface with RAG search, image generation, and more.

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

# Chorus Strategic Foresight Explorer — Complete Implementation

**Status:** ✅ Built & Ready to Deploy  
**Landing Page:** https://chorus.asilvainnovations.com  
**App URL:** https://chorus-ai.asilvainnovations.com  
**Repository:** https://github.com/asilvainnovations/Chorus.git  
**Built:** August 8, 2026

---

## 📋 Documentation Files

### **Start Here**
1. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** ⭐
   - Executive overview of what changed
   - Architecture decisions & rationale
   - User journey walkthrough
   - File structure & testing checklist

### **For Deployment & Maintenance**
2. **[CONFIGURATION.md](./CONFIGURATION.md)**
   - Environment variables (VITE_OPENROUTER_API_KEY, VITE_TAVILY_API_KEY)
   - Vercel setup & SPA routing
   - Domain data curation guide
   - Troubleshooting & performance tips

### **For Developers**
3. **[DEVELOPER_QUICKSTART.md](./DEVELOPER_QUICKSTART.md)**
   - Get started in 2 minutes
   - Common tasks (add domain, update resources, deploy)
   - Code snippets & examples
   - Command reference

### **For Architects & Decision-Makers**
4. **[ADR-001-strategic-foresight-platform.md](./ADR-001-strategic-foresight-platform.md)**
   - Architecture Decision Record
   - Options considered & trade-offs
   - Consequences & risks
   - Tech approach & dependencies

---

## 💾 Code Files

### **Core Domain System** (The Heart)
- **[domains.ts](./domains.ts)** — Source of truth for all 10 domains
  - Domain metadata: name, icon, color, description
  - Frameworks: SDGs, Sendai, Circular Economy Principles, etc.
  - Curated resources: frameworks, case studies, research, tools, initiatives
  - System prompt addendums: domain-specific instructions
  - Suggested queries: examples per domain
  - Interconnection graph: which domains relate to each other

### **State Management**
- **[chatStore.ts](./chatStore.ts)** — Zustand store with domain support
  - New actions: `createConversation(domainId?)`, `setActiveDomain()`
  - Domain field on Conversation type
  - Persistence to localStorage

### **Hooks & Context**
- **[useChat.ts](./useChat.ts)** — AI conversation logic with domain-aware prompts
  - `CHORUS_SYSTEM_PROMPT` covering all 10 domains
  - `buildDomainAwarePrompt()` function: injects domain addendum if active
  - Connects to OpenRouter API
  - Handles streaming, search, image generation, etc.

- **[useDomainContext.ts](./useDomainContext.ts)** — React hook for domain access
  - Get active domain + related domains in any component
  - Access suggested queries for current domain

### **UI Components**
- **[TransformationMap.tsx](./TransformationMap.tsx)** — Visual domain discovery
  - SVG circle layout with 10 interactive domain nodes
  - Edges showing interconnections
  - Click to select domain and launch chat
  - Framer Motion animations
  - Responsive design

- **[ChatContainer.tsx](./ChatContainer.tsx)** — Updated to show map
  - Shows Transformation Map in empty state (chat mode only)
  - Handles domain selection
  - Fallback UI for other modes (search, image, music, etc.)

### **Type Definitions**
- **[types.ts](./types.ts)** — TypeScript interfaces
  - New: `Domain`, `Resource` interfaces
  - Updated: `Conversation` with `activeDomain?`
  - All other existing types maintained

---

## 🎯 10 Domains at a Glance

| # | Domain | Icon | Focus |
|----|--------|------|-------|
| 1 | **Sustainable Development** | 🌍 | SDG alignment, just transitions |
| 2 | **Green Economy** | 💚 | Decoupling growth from depletion |
| 3 | **Circular Economy** | ♻️ | Designing out waste |
| 4 | **Resilience** | 🛡️ | Anticipation, adaptation, transformation |
| 5 | **Disaster Risk Reduction** | ⚠️ | UNDRR Sendai Framework |
| 6 | **Systems Thinking** | 🔗 | Causal loops, leverage points |
| 7 | **Inclusivity & Social Equity** | 🤝 | Leave No One Behind |
| 8 | **Well-Being** | 💚 | Physical, mental, social, spiritual health |
| 9 | **Real-Time Leadership** | 👥 | Adaptive, foresight-informed governance |
| 10 | **Innovations** | 💡 | Climate tech, social innovation |

---

## 🚀 Quick Navigation

### "How do I..."

**...deploy to Vercel?**
→ See [CONFIGURATION.md](./CONFIGURATION.md) - Environment Variables section

**...add a new domain?**
→ See [DEVELOPER_QUICKSTART.md](./DEVELOPER_QUICKSTART.md) - "Adding a Domain" section  
→ Edit [domains.ts](./domains.ts) and add entry to `DOMAINS` object

**...update system prompts?**
→ Edit `systemPromptAddendum` field in [domains.ts](./domains.ts) for any domain

**...understand the architecture?**
→ Read [ADR-001-strategic-foresight-platform.md](./ADR-001-strategic-foresight-platform.md)  
→ Skim [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

**...customize the Transformation Map?**
→ Edit [TransformationMap.tsx](./TransformationMap.tsx)  
→ Change SVG circle layout, colors, animation timings

**...test locally?**
→ Follow [DEVELOPER_QUICKSTART.md](./DEVELOPER_QUICKSTART.md) - "Get Started in 2 Minutes"

**...troubleshoot errors?**
→ See [CONFIGURATION.md](./CONFIGURATION.md) - Troubleshooting section

---

## 📁 Where Files Go in Repo

Copy these files to your local Chorus repo:

```
# New files to create:
src/services/domains.ts
src/hooks/useDomainContext.ts
src/components/TransformationMap/TransformationMap.tsx
docs/ADR-001-strategic-foresight-platform.md
docs/CONFIGURATION.md

# Files to replace:
src/types/index.ts
src/hooks/useChat.ts
src/store/chatStore.ts
src/components/Chat/ChatContainer.tsx

# (Other updated files from previous work: Header.tsx, ChatInput.tsx, 
#  SettingsPanel.tsx, api.ts, models.ts, main.tsx, index.html, 
#  package.json, README.md, LICENSE — already in repo or previous outputs)
```

---

## ✅ Implementation Checklist

- [x] Architecture designed (ADR-001)
- [x] Domain taxonomy defined (10 domains with frameworks & resources)
- [x] Transformation Map component built (SVG visualization)
- [x] System prompts updated (domain-aware injection)
- [x] Zustand store extended (domain actions)
- [x] TypeScript types defined (Domain, Resource interfaces)
- [x] React hooks created (useDomainContext)
- [x] ChatContainer updated (shows map, handles selection)
- [x] Documentation written (4 docs + this index)
- [x] Brand renamed (Huli Ka → Chorus)
- [x] Build succeeds (✅ npm run build)
- [x] No TypeScript errors
- [ ] Deploy to Vercel (your step)
- [ ] Test locally (your step)
- [ ] Curate resources (ongoing)

---

## 📞 Key Contacts & References

### For Questions About...
- **Architecture:** See ADR-001
- **Deployment:** See CONFIGURATION.md
- **Code changes:** See IMPLEMENTATION_SUMMARY.md
- **Dev setup:** See DEVELOPER_QUICKSTART.md

### External Resources
- **OpenRouter API:** https://openrouter.ai/
- **Tavily Search:** https://tavily.com/
- **UN SDGs:** https://sdgs.un.org/
- **UNDRR Sendai Framework:** https://www.undrr.org/implementing-sendai-framework
- **Circular Economy:** https://www.ellenmacarthurfoundation.org/

---

## 🔄 Version & Change Log

**Current Version:** 1.0  
**Release Date:** August 8, 2026  
**Status:** ✅ Complete & Built

### What's New in 1.0
- Transformation Map (visual domain discovery)
- Domain-aware system prompts
- All 10 domains with frameworks & resources
- Domain context tracking per conversation
- Brand renamed to Chorus
- Complete documentation suite

### Planned for v1.1+
- Sub-domains (e.g., SDG 1, 2, 3...)
- Multi-domain conversations
- Analytics dashboard
- Scenario planning workflow
- Stakeholder persona modes

---

## 📦 Deliverables Summary

**Total Files:** 9 code files + 5 documentation files = **14 files**

### Code (9)
1. domains.ts — Domain definitions
2. useDomainContext.ts — Domain context hook
3. TransformationMap.tsx — SVG visualization
4. types.ts — Type definitions
5. chatStore.ts — State management
6. useChat.ts — Chat logic with prompts
7. ChatContainer.tsx — Main chat UI
8. (+ 5 other already-updated files from previous work)

### Documentation (5)
1. IMPLEMENTATION_SUMMARY.md — Executive overview
2. CONFIGURATION.md — Deployment & maintenance
3. DEVELOPER_QUICKSTART.md — Dev guide
4. ADR-001-strategic-foresight-platform.md — Architecture record
5. INDEX.md — This navigation guide

---

## 🎓 Learning Resources Included

Each file is well-commented and explains:
- **Why** decisions were made
- **How** components work together
- **Where** to make changes
- **Examples** of common tasks

Start with [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for the big picture, then dive into specific docs as needed.

---

**Ready to ship Chorus? Follow [CONFIGURATION.md](./CONFIGURATION.md) for deployment.**

Questions? See [DEVELOPER_QUICKSTART.md](./DEVELOPER_QUICKSTART.md) Troubleshooting section.


## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/asilvainnovations/Chorus.git
cd Chorus

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

# Chorus Developer Quick Start

## Get Started in 2 Minutes

```bash
cd Chorus  # (or wherever you cloned it)
npm install
npm run dev
# Open http://localhost:5173
```

You'll see the Transformation Map in the empty chat state.

## Key Files You'll Touch

### Adding a Domain (v2 Feature)
**File:** `src/services/domains.ts`

```typescript
const DOMAINS: Record<string, Domain> = {
  'sustainable-development': { /* ... */ },
  // ADD NEW DOMAIN HERE
  'new-domain': {
    id: 'new-domain',
    name: 'New Domain',
    description: '...',
    icon: '🔗',
    color: '#hex-color',
    backgroundColor: '#light-hex-color',
    relatedDomainIds: ['sustainable-development', 'resilience'],
    frameworks: ['Framework 1', 'Framework 2'],
    resources: [
      { title: '...', url: '...', type: 'framework', description: '...' },
    ],
    systemPromptAddendum: `You are advising on New Domain...`,
    suggestedQueries: ['Example 1', 'Example 2'],
  },
};
```

### Updating Domain Resources
**File:** `src/services/domains.ts` → Find domain → Update `resources` array

```typescript
resources: [
  { 
    title: 'New Case Study',
    url: 'https://example.com/case-study',
    type: 'case-study',
    description: 'How companies implemented X'
  },
  // ... more resources
],
```

### Improving System Prompts
**File:** `src/hooks/useChat.ts`

- **Base prompt:** `CHORUS_SYSTEM_PROMPT` (for all domains)
- **Domain addendum:** In `domains.ts` → `domain.systemPromptAddendum`
- **How it works:** `buildDomainAwarePrompt()` combines base + domain addendum + connections

### Customizing the Transformation Map
**File:** `src/components/TransformationMap/TransformationMap.tsx`

- SVG circle layout: Edit `radius`, `centerX`, `centerY` in `nodePositions` calculation
- Colors: Use domain's `color` and `backgroundColor` (currently hardcoded in nodes)
- Animation: Framer Motion `initial`, `animate` props for entry effects

### Accessing Domain Context in Components
**File:** Any component that needs current domain

```typescript
import { useDomainContext } from '../../hooks/useDomainContext';

export const MyComponent: React.FC = () => {
  const { activeDomain, relatedDomains, suggestedQueries } = useDomainContext();
  
  if (!activeDomain) return <p>No domain selected</p>;
  
  return (
    <div>
      <h2>{activeDomain.name}</h2>
      <p>{activeDomain.description}</p>
      <ul>
        {suggestedQueries.map(q => <li key={q}>{q}</li>)}
      </ul>
    </div>
  );
};
```

## Common Tasks

### Deploy to Vercel
```bash
git add .
git commit -m "Your message"
git push origin main
# Vercel auto-deploys via webhook
```

### Run Tests (if you add them)
```bash
npm test
```

### Check TypeScript
```bash
npx tsc --noEmit
```

### Build for Production
```bash
npm run build
# Output in dist/
```

## Troubleshooting

**Transformation Map not showing?**
- Check `currentMode === 'chat'` (map only shows for chat mode)
- Check browser console for errors

**Domain not persisting?**
- Check `activeDomain` in Zustand store: `DevTools → Application → Local Storage → chorus-storage`

**Model not responding in domain context?**
- Verify `VITE_OPENROUTER_API_KEY` is set in Vercel Environment Variables
- Check API response in Network tab (browser DevTools)

**Build fails?**
```bash
npm run build 2>&1 | grep error  # See TypeScript errors
```

## API Keys (Vercel Environment Variables)

### Development (`.env` file locally)
```
VITE_OPENROUTER_API_KEY=your-key-here
VITE_TAVILY_API_KEY=your-key-here
```

### Production (Vercel Dashboard)
1. Go to Project Settings → Environment Variables
2. Add `VITE_OPENROUTER_API_KEY`
3. Add `VITE_TAVILY_API_KEY`
4. **Redeploy** (because VITE_ vars are bundled at build time)

## Project Structure
```
Chorus/
├── src/
│   ├── services/domains.ts          ← Domain definitions
│   ├── hooks/useChat.ts             ← System prompt logic
│   ├── components/TransformationMap/ ← Visual component
│   └── ...
├── docs/
│   ├── ADR-001-...md               ← Design decisions
│   └── CONFIGURATION.md             ← Deployment guide
├── README.md
├── package.json
└── vite.config.ts
```

## Useful Links
- **Domains Data:** `src/services/domains.ts` — Everything about domains
- **Type Definitions:** `src/types/index.ts` — `Domain`, `Resource`, `Conversation`
- **Architecture Record:** `docs/ADR-001-strategic-foresight-platform.md`
- **Config Guide:** `docs/CONFIGURATION.md`
- **Transformation Map:** `src/components/TransformationMap/TransformationMap.tsx`
- **System Prompts:** `src/hooks/useChat.ts` lines 10–38

## Quick Command Reference
```bash
npm install           # Install dependencies
npm run dev          # Local dev server (http://localhost:5173)
npm run build        # Production build
npm run lint         # Run ESLint (if configured)
npm run type-check   # Run TypeScript check
```

## Example: Updating a Domain's System Prompt
**Current (example):**
```typescript
systemPromptAddendum: `You are advising on Disaster Risk Reduction (DRR)...`,
```

**To update:**
1. Open `src/services/domains.ts`
2. Find the `'disaster-risk-reduction'` domain object
3. Edit the `systemPromptAddendum` string
4. Save; dev server hot-reloads
5. Restart chat and select DRR domain to test

---

**Happy coding!** 🚀

For deeper dives, see `CONFIGURATION.md` and `IMPLEMENTATION_SUMMARY.md`.


## License

Apache License 2.0 © 2026 ASilva Innovations. See [LICENSE](./LICENSE) for full terms.
