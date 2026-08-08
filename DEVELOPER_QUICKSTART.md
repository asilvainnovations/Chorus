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
