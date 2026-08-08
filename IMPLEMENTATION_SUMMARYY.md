# Chorus AI: Strategic Foresight Explorer — Implementation Summary

**Date:** August 8, 2026  
**Status:** ✅ Complete & Built Successfully  
**App URL:** https://chorus-ai.asilvainnovations.com (chat app)  
**Landing Page:** Same URL (separate static file, separate Vercel project)

---

## What Changed

Chorus transformed from a general-purpose AI chat app into a **domain-scoped strategic foresight explorer** focused on 10 interconnected global challenges:

1. ✅ Sustainable Development
2. ✅ Green Economy
3. ✅ Circular Economy
4. ✅ Resilience
5. ✅ Disaster Risk Reduction
6. ✅ Systems Thinking
7. ✅ Inclusivity & Social Equity
8. ✅ Well-Being
9. ✅ Real-Time Leadership
10. ✅ Innovations in These Fields

## Architecture Decisions

### 1. **Transformation Map** (Visual Discovery Layer)
- **Component:** `TransformationMap.tsx` — SVG node-link diagram showing 10 domains as interactive colored nodes in a circle
- **Interaction:** Click a domain → Sets that domain as active → Pre-fills chat context
- **Displayed:** In `ChatContainer` empty state for `chat` mode only
- **Inspired by:** WEF Strategic Intelligence platform, but chat-native (not browse-first)

### 2. **Domain-Aware System Prompts** (Behavioral Grounding)
- **Base Prompt:** `CHORUS_SYSTEM_PROMPT` — Covers all 10 domains, their frameworks, and cross-domain thinking
- **Domain Addendum:** If conversation has `activeDomain` set, the domain's specialized `systemPromptAddendum` is appended
- **Result:** Every AI response is grounded in domain-specific frameworks (SDGs, Sendai Framework, etc.) + related domains are suggested
- **Helper:** `buildDomainAwarePrompt()` function in `useChat.ts`

### 3. **Domain Data as Source of Truth** (Maintainability)
- **File:** `src/services/domains.ts` — All 10 domains defined with:
  - Name, description, icon, color
  - Frameworks (e.g., SDGs, Sendai, Circular Economy Principles)
  - Resources (curated links: frameworks, case studies, research, tools, initiatives)
  - System prompt addendum (specific instructions per domain)
  - Suggested queries (domain-relevant examples)
  - Related domain IDs (interconnection graph)
- **Pattern:** Data-driven, not hardcoded in components → Easy to maintain & scale

### 4. **Conversation Metadata Tracking** (Navigability)
- **New Field:** `Conversation.activeDomain?: string` — Tracks which domain the conversation is focused on
- **Related Domains:** `Conversation.relatedDomains?: string[]` (reserved for v2)
- **Sidebar:** Domain badges can be added to show conversation topic at a glance (UI pattern ready)
- **Persistence:** Stored in Zustand's `chorus-storage` localStorage

### 5. **Separation of Concerns** (Clean Architecture)
- **Landing Page:** NOT imported into `App.tsx` → Stays separate static deployment
- **App Routes:** All handled by Vercel SPA rewrite (`vercel.json`)
- **Landing Page URL:** Points to app chat via `https://chorus-ai.asilvainnovations.com`
- **No coupling:** Marketing site is independent; can be updated without rebuilding the app

---

## Files Provided

### Documentation
- **`CONFIGURATION.md`** — Deployment guide, environment variables, testing instructions
- **`ADR-001-strategic-foresight-platform.md`** — Architecture decision record with options considered & consequences
- **`IMPLEMENTATION_SUMMARY.md`** — This file

### New Core Files
- **`domains.ts`** — Source of truth for all 10 domains, frameworks, resources, interconnections
- **`useDomainContext.ts`** — React hook to access active domain + related domains in any component
- **`TransformationMap.tsx`** — SVG visualization of domain nodes & edges; clickable for domain selection

### Modified Core Files
- **`types.ts`** — Added `Domain`, `Resource` interfaces; `activeDomain?` to `Conversation`
- **`chatStore.ts`** — Added `createConversation(domainId?)`, `setActiveDomain()` actions
- **`useChat.ts`** — Updated system prompt (covers all 10 domains), added `buildDomainAwarePrompt()` helper
- **`ChatContainer.tsx`** — Shows `TransformationMap` in empty state for chat mode; handles domain selection

### Brand Rename (Huli Ka → Chorus)
- Header, chat placeholder, disclaimers, settings footer, OpenRouter header, meta tags, package name, README, LICENSE

---

## How It Works: User Journey

```
1. User opens Chorus chat
   ↓
2. If no conversation or chat mode, sees Transformation Map (10 domain nodes in circle)
   ↓
3. User clicks a domain (e.g., "Disaster Risk Reduction")
   ↓
4. Conversation is created with activeDomain = "disaster-risk-reduction"
   ↓
5. Chat input appears, ready to type questions about DRR
   ↓
6. User types: "Design an early warning system for flood-prone communities"
   ↓
7. System prompt injected:
   [Base CHORUS prompt covering all 10 domains]
   +
   [DRR-specific addendum: UNDRR Sendai Framework, hazard assessment, early warning systems]
   +
   [Connections note: "linked to Resilience, Systems Thinking, Real-Time Leadership"]
   ↓
8. OpenRouter API receives this domain-aware prompt
   ↓
9. Claude (or selected model) responds grounded in DRR frameworks + systems thinking
   ↓
10. Response cites Sendai Framework, suggests connections to resilience, etc.
```

---

## Key Design Principles

| Principle | Implementation |
|-----------|-----------------|
| **Chat-First** | Transformation Map is discovery affordance, not a navigation structure |
| **Systems Thinking** | Domain nodes show interconnections (edges); prompt injection mentions related domains |
| **Data-Driven** | All domain metadata in one file (`domains.ts`); easy to maintain, version, and scale |
| **Grounded Expertise** | System prompt anchors responses in real frameworks (SDGs, Sendai, etc.) |
| **Scalable** | Adding an 11th domain = add one entry to `DOMAINS` object; no component rewrites |
| **Maintainable** | Resources, frameworks, prompts separated from UI logic |

---

## Technical Highlights

### TypeScript Safety
- `Domain` and `Resource` interfaces ensure consistent data structure
- `ChatMode` type includes 'chat', 'search', 'image', 'music', 'pdf', 'url'
- `activeDomain` is optional on `Conversation`; code checks before using

### React Patterns
- **Custom Hook:** `useDomainContext()` for any component to access active domain
- **Zustand Actions:** `setActiveDomain()` for state mutations
- **SVG Component:** `TransformationMap` with Framer Motion animations
- **Conditional Rendering:** Empty state shows map only in chat mode

### System Prompt Engineering
```typescript
const buildDomainAwarePrompt = (activeDomainId?: string): string => {
  if (!activeDomainId) return CHORUS_SYSTEM_PROMPT;
  
  const domain = getDomainById(activeDomainId);
  const connections = getDomainConnections(activeDomainId);
  const relatedNames = connections
    .filter(c => c.directConnection)
    .map(c => c.domain.name)
    .join(', ');
  
  return `${CHORUS_SYSTEM_PROMPT}
    FOCUS DOMAIN: ${domain.name}
    ${domain.systemPromptAddendum}
    INTERCONNECTIONS: linked to ${relatedNames}`;
};
```

---

## Build & Deployment

### ✅ Build Status
```
> chorus@1.0.0 build
✓ 2681 modules transformed
✓ built in 9.38s
```

### Environment Variables (Set in Vercel)
```
VITE_OPENROUTER_API_KEY=sk-or-v1-...
VITE_TAVILY_API_KEY=tvly-...
```

### Deploy to Vercel
```bash
git add .
git commit -m "Chorus Strategic Foresight Explorer: 10 domains, transformation map, domain-aware prompts"
git push origin main  # Assuming main branch
# Vercel auto-deploys via webhook
```

---

## Testing Checklist

- [ ] **Local Development:** `npm run dev` → See Transformation Map in empty chat state
- [ ] **Domain Selection:** Click any domain node → `activeDomain` should be set
- [ ] **System Prompt:** Ask domain-specific question → Response should cite relevant frameworks
- [ ] **Interconnections:** Note in response that related domains are mentioned
- [ ] **Multiple Domains:** Start new chat, select different domain → Separate conversations with different contexts
- [ ] **Sidebar:** Conversations show in sidebar; can rename, delete, switch between them
- [ ] **localStorage:** Close browser, reopen → Conversations and active domain should persist
- [ ] **Build:** `npm run build` produces no errors; `dist/` is generated

---

## What's NOT Included (v1 Scope)

- ❌ Sub-domains (e.g., SDG 1, 2, 3...)
- ❌ Multi-domain conversations (one domain per conversation in v1)
- ❌ Domain-specific resource browser (links are in the prompt, not a separate UI)
- ❌ Scenario planning guided workflow
- ❌ Stakeholder persona modes
- ❌ Analytics dashboard for domain engagement

These are listed in the ADR as "revisit in v2 & beyond" → Plan to add as user feedback informs.

---

## Next Steps (For You)

1. **Deploy:** Push to GitHub (Chorus.git), Vercel auto-builds
2. **Test:** Verify domain selection, system prompt grounding, interconnection mentions
3. **Curate:** Review domain resources; update links, add case studies
4. **Monitor:** Track which domains users engage with most (add analytics if needed)
5. **Iterate:** Gather feedback; plan v2 features (sub-domains, scenarios, personas)

---

## Files Structure in Repo

```
src/
├── services/
│   ├── domains.ts                     [NEW] Domain definitions
│   ├── models.ts                      [UPDATED] Model IDs
│   └── api.ts                         [UPDATED] Brand rename
├── hooks/
│   ├── useChat.ts                     [UPDATED] Domain-aware prompts
│   ├── useDomainContext.ts            [NEW] Domain context hook
│   └── ...
├── components/
│   ├── Chat/
│   │   ├── ChatContainer.tsx          [UPDATED] Shows Transformation Map
│   │   ├── ChatInput.tsx              [UPDATED] Brand rename
│   │   └── ...
│   ├── TransformationMap/
│   │   └── TransformationMap.tsx      [NEW] SVG visualization
│   ├── Layout/
│   │   ├── Header.tsx                 [UPDATED] Brand rename
│   │   └── ...
│   └── ...
├── store/
│   └── chatStore.ts                   [UPDATED] Domain actions
├── types/
│   └── index.ts                       [UPDATED] Domain types
└── ...
docs/
├── ADR-001-strategic-foresight-platform.md    [NEW] Architecture record
└── CONFIGURATION.md                           [NEW] Deployment & maintenance
```

---

## Support

**Questions or Issues?**
- See `CONFIGURATION.md` for troubleshooting
- Check `ADR-001` for design rationale
- Review `domains.ts` for adding/updating domains
- All files are well-commented for maintainability

**Congratulations!** Chorus is now a strategic foresight platform. 🎉

---

**Version:** 1.0  
**Release Date:** August 8, 2026  
**Maintainer:** ASilva Innovations  
**License:** Apache 2.0
