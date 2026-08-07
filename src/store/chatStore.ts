// src/store/chatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, Message, ChatMode, UserSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentMode: ChatMode;
  selectedModel: string;
  isLoading: boolean;
  isStreaming: boolean;
  settings: UserSettings;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;

  createConversation: () => string;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setMode: (mode: ChatMode) => void;
  setModel: (modelId: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  clearAllConversations: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      currentMode: 'chat',
      selectedModel: 'openai/gpt-4o',
      isLoading: false,
      isStreaming: false,
      sidebarOpen: true,
      commandPaletteOpen: false,
      settings: {
        theme: 'system',
        defaultModel: 'openai/gpt-4o',
        apiKey: '',
        streamingEnabled: true,
        soundEnabled: false,
      },

      createConversation: () => {
        const id = uuidv4();
        const newConversation: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: get().selectedModel,
          mode: get().currentMode,
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        return id;
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },

      addMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date(),
                  title:
                    conv.messages.length === 0 && message.role === 'user'
                      ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                      : conv.title,
                }
              : conv
          ),
        }));
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: newConversations,
            currentConversationId:
              state.currentConversationId === id
                ? newConversations[0]?.id || null
                : state.currentConversationId,
          };
        });
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title } : conv
          ),
        }));
      },

      setMode: (mode) => set({ currentMode: mode }),
      setModel: (modelId) => set({ selectedModel: modelId }),
      setLoading: (loading) => set({ isLoading: loading }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      clearAllConversations: () => {
        set({ conversations: [], currentConversationId: null });
      },
    }),
    {
      name: 'huli-ka-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        settings: state.settings,
        selectedModel: state.selectedModel,
      }),
    }
  )
);
