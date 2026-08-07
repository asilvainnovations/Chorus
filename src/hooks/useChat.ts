// src/hooks/useChat.ts
import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { Message, ChatMode, SearchResult, GeneratedImage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { streamChatMessage, abortCurrentStream, generateImage } from '../services/api';
import { searchWeb } from '../services/search';

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

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

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
              messages: [...historyMessages, { role: 'user', content: finalContent }],
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
      } catch (error) {
        console.error('Chat error:', error);
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
    abortCurrentStream();
    setStreaming(false);
    setLoading(false);
  }, [setStreaming, setLoading]);

  return { sendMessage, abortStream, currentConversation };
};
