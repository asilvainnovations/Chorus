# ADR-001: Chorus as a Strategic Foresight Explorer Platform

**Status:** Accepted  
**Date:** 2026-08-08  
**Deciders:** ASilva Innovations, Chorus Product Team

## Context

Chorus started as a general multi-model chat interface. The shift to **Sustainable Development, Green Economy, Inclusivity, Disaster Risk Reduction, Resilience, Systems Thinking, Circular Economy, Real-Time Leadership, Well-Being, and Innovation in these fields** requires a new interaction model.

Unlike WEF's Strategic Intelligence (a browse-first platform), Chorus needs to remain **chat-first** while incorporating a **Transformation Map** — a visual, interactive node-link diagram of the 10 domains and their interconnections.

The core question: How do we help users explore complex, interconnected global challenges through conversation while maintaining the conversational interface as the primary interaction?

## Decision

Chorus becomes a **Domain-Scoped Strategic Foresight Explorer**:

1. **Transformation Map as Discovery Layer**
   - Visual node-link graph of 10 domains rendered in empty-state
   - Clicking a domain pre-fills a chat focused on that domain's context
   - Edges show interconnections (e.g., DRR ↔ Resilience, Circular Economy ↔ Sustainable Development)
   - No navigation away from chat — map is an affordance within the chat interface

2. **Domain-Aware System Prompt**
   - Each conversation has an active domain (or multi-domain context)
   - System prompt customized per domain + cross-domain instructions
   - Model responses grounded in frameworks, SDGs, Sendai Framework, SDG terminology

3. **Transformation Maps per Domain** (inspired by WEF, but AI-curated)
   - Each domain links to curated resources: research papers, case studies, frameworks, tools
   - Resources are **data-driven** (stored in `src/services/domains.ts`), not hardcoded in components
   - Suggested searches within each domain are domain-specific

4. **Conversation Metadata**
   - Each conversation tagged with primary + related domains
   - Sidebar shows domain badges (visual affordance of focus area)
   - Allows filtering/organizing conversations by domain

5. **Landing Page Separation** (unchanged)
   - Landing page at `https://chorus-ai.asilvainnovations.com` (public-facing marketing)
   - Chat app at same URL (routes handled by Vercel SPA rewrite)
   - No landing page imported into `App.tsx` — it's a separate static deployment

## Options Considered

### Option A: Hybrid Navigation (Browse-then-Chat)
WEF-style: Browse transformation map → Select topic → Curated feed → Then chat
- **Pros:** Rich exploration, closer to WEF model
- **Cons:** Multi-step UX, breaks chat-first flow, heavier implementation
- **Decision:** Rejected — contradicts Chorus's chat-first identity

### Option B: Sidebar Domain Picker
A menu in the sidebar listing 10 domains; clicking changes chat context
- **Pros:** Simple, low friction
- **Cons:** No visual affordance of interconnections, misses the "systems thinking" angle
- **Decision:** Partial adoption — sidebar shows domain badges on conversations, but primary discovery is the map

### Option C: Domain-Scoped Conversations (Chosen)
Transformation map + system prompt injection + curated resources per domain
- **Pros:** 
  - Preserves chat-first UX
  - Visual metaphor (nodes, edges) teaches systems thinking
  - Conversation remains the primary interface
  - Scalable to add domains later
- **Cons:** 
  - Requires curated domain data (maintenance burden)
  - Transformation map visualization is new (technical risk)
- **Decision:** Accepted — provides best balance

## Consequences

### What Becomes Easier
- **Users explore interconnections:** Clicking edges shows "how does DRR relate to resilience?" is baked into the UI
- **Domain grounding:** Every response stays on-brand for the 10 domains
- **Resource discovery:** Curated links suggest next readings/topics without leaving chat
- **Conversation organization:** Domain tags make searching past work trivial

### What Becomes Harder
- **Curating domain data:** Each domain needs ~5–10 curated resources, framework links, suggested queries
- **Maintaining interconnections:** If domains evolve, edge list must stay current
- **Rendering performance:** Force-directed graph layout (10 nodes) is simple, but mobile might need optimization
- **Onboarding new domains:** Adding an 11th domain requires data entry + system prompt tuning

### What We'll Need to Revisit
1. **Transformation map layout algorithm** — Fixed positions vs. force-directed? (v1: fixed positions for stability)
2. **Resource curation workflow** — Who updates domain resources? How often?
3. **Domain taxonomy** — Are these 10 domains final, or do we reserve room for sub-domains?
4. **Multi-domain conversations** — Should a chat be able to span multiple domains, or force a single focus per conversation? (v1: single focus)

## Action Items

1. [x] Create `src/services/domains.ts` with domain metadata, resources, interconnections
2. [x] Create `TransformationMap` component (SVG force graph or fixed layout)
3. [x] Create `useDomainContext` hook to track active domain
4. [x] Update `useChat` system prompt to be domain-aware
5. [x] Update `ChatContainer` to render map in empty state
6. [x] Add domain badges to `ConversationSidebar`
7. [x] Update chat suggestions to be domain-relevant
8. [x] Document domain framework per domain (in comments + resources)
9. [ ] QA: Test system prompt grounding across all 10 domains
10. [ ] Analytics: Track which domains users engage with most

## Technical Approach

**Domain Data Structure:**
```typescript
interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  relatedDomainIds: string[];
  frameworks: string[]; // e.g., ["SDGs", "Sendai Framework", "Circular Economy Principles"]
  resources: Resource[];
  systemPromptAddendum: string; // Domain-specific guidance
}
```

**Transformation Map Rendering:**
- SVG canvas with fixed node positions (circle layout for 10 domains)
- Bezier curves for edges showing interconnections
- Hover state: highlight node + connected edges
- Click: dismiss map, pre-fill domain context in chat

**System Prompt Injection:**
```
CHORUS_SYSTEM_PROMPT (generic) +
[Domain].systemPromptAddendum +
[Cross-Domain Thinking Instructions]
```

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Domain data becomes stale | Quarterly review cycle, version number tracking |
| Transformation map UX unclear | Early user testing with 5 domain experts |
| Performance: graph layout on mobile | SVG optimization, pre-computed positions |
| Scope creep (11th domain requests) | Clearly document "10 domains v1" as fixed; plan v2 roadmap |

---

**See also:** 
- `/docs/DOMAIN-TAXONOMY.md` — Full domain definitions and frameworks
- `/docs/TRANSFORMATION-MAP-DESIGN.md` — Visual specifications
- `/src/services/domains.ts` — Implementation
