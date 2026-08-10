// src/hooks/useChat.ts
import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { Message, ChatMode, SearchResult, GeneratedImage, Conversation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { streamChatMessage, abortCurrentStream, generateImage } from '../services/api';
import { searchWeb } from '../services/search';
import { getDomainById, getDomainConnections } from '../types/domain';
import posthog from '@/posthog';

// ---------------------------------------------------------------------------
// Chorus AI — Domain System Prompt (Foundational)
// Injected as the first message in every chat request. If a conversation has
// an active domain, the domain's systemPromptAddendum is appended.
// ---------------------------------------------------------------------------
const CHORUS_SYSTEM_PROMPT = `You are Chorus, a strategic foresight AI assistant specialising in global challenges and their solutions.

Your core domains are:
1. Sustainable Development — SDG alignment, just transitions, development + environment integration
2. Green Economy — decoupling growth from resource depletion, renewable economics, green jobs
3. Circular Economy — designing out waste, product-as-service, material stewardship
4. Resilience — anticipation, absorption, adaptation, transformation capacities; bounce-forward thinking
5. Disaster Risk Reduction — UNDRR Sendai Framework, hazard assessment, community preparedness
6. Systems Thinking — causal loops, leverage points, emergence, complexity
7. Inclusivity & Social Equity — leave no one behind, gender equality, disability inclusion, indigenous rights
8. Well-Being — physical, mental, social, spiritual health; MHPSS; salutogenesis
9. Real-Time Leadership — adaptive, foresight-informed, participatory decision-making
10. Innovation — climate tech, social innovation, policy innovation, technology for good

When answering:
- Ground responses in evidence, frameworks (SDGs, Sendai, etc.), and real-world examples
- Be practical and action-oriented
- Surface interconnections across domains
- Cite sources when available
- If a question touches multiple domains, explain the connections
- If outside these domains, answer helpfully but note Chorus's specialization

Tone: expert but accessible, solution-focused, inclusive, systems-aware.`;

// Helper function to build domain-aware system prompt
const buildDomainAwarePrompt = (activeDomainId?: string): string => {
  if (!activeDomainId) return CHORUS_SYSTEM_PROMPT;
  
  const domain = getDomainById(activeDomainId);
  if (!domain) return CHORUS_SYSTEM_PROMPT;
  
  const connections = getDomainConnections(activeDomainId);
  const relatedNames = connections
    .filter((c) => c.directConnection)
    .map((c) => c.domain.name)
    .join(', ');
  
  return `${CHORUS_SYSTEM_PROMPT}

FOCUS DOMAIN: ${domain.name}
${domain.description}

Key frameworks for this domain: ${domain.frameworks.join(', ')}

${domain.systemPromptAddendum}

INTERCONNECTIONS: This domain is directly linked to ${relatedNames}. Draw on these connections to provide systemic insights.`;
};

export const useChat = () => {
  const {
    currentConversationId,
    conversations,
    selectedModel,
    currentMode,
    setLoading,
    setStreaming,
    addMessage,
    updateMessage,
    createConversation,
  } = useChatStore();

  const currentConversation = conversations.find((c: Conversation) => c.id === currentConversationId);

  const sendMessage = useCallback(
    async (content: string, mode: ChatMode = currentMode) => {
      if (!content.trim()) return;

      const conversationId = currentConversationId || createConversation();

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      addMessage(conversationId, userMessage);
      posthog.capture('message_sent', {
        mode,
        model_id: selectedModel,
        has_active_domain: Boolean(currentConversation?.activeDomain),
      });
      setLoading(true);

      try {
        let assistantContent = '';
        let searchResults: SearchResult[] = [];
        let images: GeneratedImage[] = [];

        if (mode === 'search') {
          const searchData = await searchWeb({ query: content, maxResults: 5 });
          searchResults = searchData.results;
          assistantContent = searchData.answer
            ? `${searchData.answer}\n\n**Sources:**\n\n${searchResults
                .map((r) => `[${r.title}](${r.url})\n${r.snippet}`)
                .join('\n\n')}`
            : `Here are the search results for "${content}":\n\n${searchResults
                .map((r) => `**${r.title}**\n${r.snippet}\nSource: ${r.source}`)
                .join('\n\n')}`;
        } else if (mode === 'image') {
          const imageUrls = await generateImage(content, selectedModel);
          images = imageUrls.map((url) => ({
            id: uuidv4(),
            url,
            prompt: content,
            model: selectedModel,
          }));
          assistantContent = `I've generated ${images.length} image${images.length > 1 ? 's' : ''} based on your prompt: "${content}"`;
        } else {
          const historyMessages = (currentConversation?.messages || [])
            .slice(-10)
            .map((m) => ({
              role: m.role,
              content: m.content,
            }));

          let finalContent = content;
          if (mode === 'chat') {
            const searchData = await searchWeb({ query: content, maxResults: 3 });
            if (searchData.results.length > 0) {
              searchResults = searchData.results;
              const context = searchData.results
                .map((r, idx) => `[Source ${idx + 1}] ${r.title}: ${r.snippet}`)
                .join('\n');
              finalContent = `Based on the following web search results:\n\n${context}\n\nUser query: ${content}`;
            }
          }

          const assistantMessageId = uuidv4();
          const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            model: selectedModel,
            isStreaming: true,
            searchResults,
          };

          addMessage(conversationId, assistantMessage);
          setStreaming(true);

          await streamChatMessage(
            {
              model: selectedModel,
              messages: [
                { role: 'system', content: buildDomainAwarePrompt(currentConversation?.activeDomain) },
                ...historyMessages,
                { role: 'user', content: finalContent },
              ],
              temperature: 0.7,
              max_tokens: 4000,
            },
            (chunk) => {
              assistantContent += chunk;
              updateMessage(conversationId, assistantMessageId, {
                content: assistantContent,
              });
            },
            () => {
              setStreaming(false);
              posthog.capture('response_completed', {
                mode,
                model_id: selectedModel,
              });
              updateMessage(conversationId, assistantMessageId, {
                isStreaming: false,
                citations: searchResults.map((r, idx) => ({
                  id: `cite-${idx}`,
                  title: r.title,
                  url: r.url,
                  snippet: r.snippet,
                  index: idx + 1,
                })),
              });
            },
            (error) => {
              setStreaming(false);
              posthog.capture('response_failed', {
                mode,
                model_id: selectedModel,
              });
              updateMessage(conversationId, assistantMessageId, {
                isStreaming: false,
                content: `**Error:** ${error.message}\n\nPlease check your API key and try again.`,
              });
            }
          );

          setLoading(false);
          return;
        }

        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date(),
          model: selectedModel,
          citations: searchResults.map((r, idx) => ({
            id: `cite-${idx}`,
            title: r.title,
            url: r.url,
            snippet: r.snippet,
            index: idx + 1,
          })),
          images,
          searchResults,
        };

        addMessage(conversationId, assistantMessage);
        posthog.capture('response_completed', {
          mode,
          model_id: selectedModel,
        });
      } catch (error) {
        console.error('Chat error:', error);
        posthog.capture('response_failed', {
          mode,
          model_id: selectedModel,
        });
        const errorMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `**Error:** ${error instanceof Error ? error.message : 'An unexpected error occurred'}\n\nPlease try again or check your connection.`,
          timestamp: new Date(),
          model: selectedModel,
        };
        addMessage(conversationId, errorMessage);
      } finally {
        setLoading(false);
        setStreaming(false);
      }
    },
    [
      currentConversationId,
      conversations,
      selectedModel,
      currentMode,
      createConversation,
      addMessage,
      updateMessage,
      setLoading,
      setStreaming,
    ]
  );

  const abortStream = useCallback(() => {
    if (!abortCurrentStream()) return;

    posthog.capture('response_stopped');
    setStreaming(false);
    setLoading(false);
  }, [setStreaming, setLoading]);

  return { sendMessage, abortStream, currentConversation };
};
