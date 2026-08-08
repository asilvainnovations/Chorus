# Chorus Configuration Guide

## Environment & Deployment

### Application URLs
- **Marketing/Landing Page:** `https://chorus-ai.asilvainnovations.com` (separate static deployment)
- **Chat Application:** `https://chorus-ai.asilvainnovations.com` (same URL, Vercel SPA routing handles it)
- **Development:** `http://localhost:5173` (Vite dev server)

### Vercel Deployment (`vercel.json`)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Note:** The SPA rewrite pattern ensures all routes fall back to `index.html` for React Router handling. Landing page is **not** imported into the app; it remains a separate static file.

### Required Environment Variables
Set in Vercel → Project Settings → Environment Variables (Production):

| Variable | Source | Purpose |
|----------|--------|---------|
| `VITE_OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) | AI model API access |
| `VITE_TAVILY_API_KEY` | [tavily.com](https://tavily.com/) | Web search + RAG |

**Important:** These are `VITE_*` variables, baked into the bundle at build time. **Redeploy after changing.**

---

## System Architecture

### Core Domains (10)
Each domain is data-driven, defined in `src/services/domains.ts`:

1. **Sustainable Development** — SDG alignment, just transitions
2. **Green Economy** — Decoupling growth from resource depletion
3. **Circular Economy** — Designing out waste
4. **Resilience** — Anticipation, adaptation, transformation
5. **Disaster Risk Reduction** — UNDRR Sendai Framework
6. **Systems Thinking** — Causal loops, leverage points
7. **Inclusivity & Social Equity** — Leave No One Behind, gender, disability
8. **Well-Being** — Physical, mental, social, spiritual health
9. **Real-Time Leadership** — Adaptive, foresight-informed governance
10. **Innovations** — Climate tech, social innovation, policy

### Transformation Map (Visual Discovery)
- **SVG node-link diagram** showing 10 domains as interactive nodes in a circle
- **Edges** show direct interconnections between domains
- **Clicking a node** sets that domain as the conversation's active domain and pre-fills it in chat
- **Rendered** in `ChatContainer` empty state for `chat` mode only

### Domain-Aware System Prompt Injection
- **Base Prompt:** `CHORUS_SYSTEM_PROMPT` in `useChat.ts` — foundational instructions for all 10 domains
- **Domain Addendum:** If a conversation has `activeDomain` set, the domain's `systemPromptAddendum` is appended
- **Connections:** Related domains are listed to encourage cross-domain systems thinking

**Example prompt for Disaster Risk Reduction domain:**
```
[Base CHORUS prompt covering all 10 domains]

FOCUS DOMAIN: Disaster Risk Reduction
Systemic reduction of disaster risk through prevention, mitigation, preparedness, and response.

Key frameworks for this domain: UNDRR Sendai Framework 2015-2030, Hazard Assessment, Early Warning Systems, Community-Based DRR

You are advising on Disaster Risk Reduction (DRR). Focus on:
- UNDRR Sendai Framework priorities: understanding disaster risk, strengthening governance, investing in DRR
- Multi-hazard approaches (earthquakes, floods, storms, pandemics, etc.)
...
[Full addendum from domain definition]

INTERCONNECTIONS: This domain is directly linked to Resilience, Systems Thinking, Real-Time Leadership, Well-Being. Draw on these connections...
```

---

## Data Flow

```
User clicks domain node in TransformationMap
    ↓
TransformationMap.onDomainSelect(domainId) fires
    ↓
ChatContainer calls useChatStore().setActiveDomain(conversationId, domainId)
    ↓
Zustand store updates conversation.activeDomain
    ↓
useChat.sendMessage() builds prompt via buildDomainAwarePrompt(activeDomain)
    ↓
Domain-aware system prompt sent to OpenRouter API
    ↓
Model response is grounded in that domain's frameworks & addendum
```

---

## Key Files

### New Files
- **`src/services/domains.ts`** — Domain definitions, frameworks, resources, interconnections
- **`src/hooks/useDomainContext.ts`** — Hook to access active domain + related domains
- **`src/components/TransformationMap/TransformationMap.tsx`** — SVG visualization component
- **`docs/ADR-001-strategic-foresight-platform.md`** — Architecture decision record
- **`docs/CONFIGURATION.md`** — This file

### Modified Files
- **`src/types/index.ts`** — Added `Domain`, `Resource` types; `activeDomain?` to `Conversation`
- **`src/store/chatStore.ts`** — Added `createConversation(domainId?)`, `setActiveDomain()` actions
- **`src/hooks/useChat.ts`** — Updated system prompt to cover all 10 domains; added `buildDomainAwarePrompt()` helper
- **`src/components/Chat/ChatContainer.tsx`** — Shows `TransformationMap` in empty state for chat mode
- **`src/components/Layout/Header.tsx`** — Brand renamed to "Chorus" ✓
- **`src/components/Chat/ChatInput.tsx`** — Brand renamed to "Chorus" ✓
- **`src/components/Settings/SettingsPanel.tsx`** — Brand renamed to "Chorus" ✓
- **`src/services/api.ts`** — X-Title header renamed to "Chorus AI" ✓
- **`src/services/models.ts`** — Model IDs updated ✓
- **`src/main.tsx`** — localStorage key renamed to `chorus-storage` ✓
- **`index.html`** — Meta tags and title updated ✓
- **`package.json`** — Name field renamed to "chorus" ✓
- **`README.md`** — License corrected to Apache 2.0, clone URL updated ✓
- **`LICENSE`** — Copyright placeholder filled in ✓

---

## Testing the Strategic Foresight Explorer

### 1. Local Development
```bash
npm install
npm run dev
# Open http://localhost:5173
```

### 2. Start a Chat
- Click "New Chat" in sidebar
- In empty state, you'll see the **Transformation Map** (10 colored nodes in a circle)

### 3. Select a Domain
- Click any domain node (e.g., "Disaster Risk Reduction")
- Conversation now has `activeDomain` set
- Chat input appears with domain context ready

### 4. Ask a Domain-Specific Question
```
"Design an early warning system for flood-prone communities"
```
- System prompt now includes DRR frameworks + suggested focus areas
- Model response should ground itself in Sendai Framework concepts

### 5. Explore Interconnections
- Hover over domain nodes to see description
- Notice edge lines connecting related domains
- Click a related domain to shift focus (new conversation recommended)

---

## Maintenance & Future Work

### Domain Data Curation
- **Frameworks** — Add new frameworks as they emerge (e.g., new UN initiatives)
- **Resources** — Update links quarterly; remove dead URLs
- **System Prompt Addendums** — Refine based on user feedback and latest best practices
- **Suggested Queries** — Add more diverse starters per domain

### Feature Roadmap (v2 and beyond)
- [ ] Sub-domains (e.g., "Sustainable Development" → "SDG 1: No Poverty", "SDG 2: Zero Hunger")
- [ ] Multi-domain conversations (set multiple active domains in one chat)
- [ ] Transformation map analytics (track which domains users explore most)
- [ ] Domain resource browser (browse curated links without chatting)
- [ ] Scenario planning mode (guided multi-step foresight exercises)
- [ ] Stakeholder personas (guide conversations by roles: policymaker, business, NGO, youth)

### Performance Optimization
- **Transformation Map rendering:** Currently fixed positions (SVG, ~10 nodes). Force-directed algorithms if adding more domains.
- **System prompt length:** Addendums + base prompt currently ~2000 tokens. Monitor to ensure context window efficiency.
- **Domain data:** Moving to a CMS or API (e.g., Contentful, Hygraph) for non-technical curation.

---

## Support & Troubleshooting

**Q: Domain not persisting after page reload?**  
A: `activeDomain` is stored in Zustand's `chorus-storage` localStorage key under the conversation. Check browser DevTools → Application → Local Storage.

**Q: System prompt not including domain guidance?**  
A: Check that `currentConversation?.activeDomain` is set. If null, the base prompt is used.

**Q: Transformation Map not showing?**  
A: Only rendered for `chat` mode (`currentMode === 'chat'`). Switch to Chat mode in the sidebar.

**Q: Build includes old domain data?**  
A: `VITE_*` environment variables and domain data are baked in at build time. Rebuild after changes: `npm run build`

---

**Document Version:** 1.0  
**Last Updated:** 2026-08-08  
**Maintainers:** ASilva Innovations
