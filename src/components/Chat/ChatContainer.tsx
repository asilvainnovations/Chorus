// src/components/Chat/ChatContainer.tsx
import React, { useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingDots } from '../Common/LoadingDots';
import { Sparkles, Search, Image, Music, FileText, Link2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const modeIcons = {
  chat: <MessageSquare size={32} className="text-blue-500" />,
  search: <Search size={32} className="text-green-500" />,
  image: <Image size={32} className="text-purple-500" />,
  music: <Music size={32} className="text-pink-500" />,
  pdf: <FileText size={32} className="text-orange-500" />,
  url: <Link2 size={32} className="text-cyan-500" />,
};

import { MessageSquare } from 'lucide-react';

const suggestions = {
  chat: [
    'Explain quantum computing in simple terms',
    'Write a Python function to sort a list',
    'What are the best practices for React hooks?',
  ],
  search: [
    'Latest AI breakthroughs 2026',
    'Philippines economic outlook',
    'Best practices for TypeScript',
  ],
  image: [
    'A futuristic city at sunset, cyberpunk style',
    'A serene Japanese garden with cherry blossoms',
    'An astronaut riding a horse in space',
  ],
  music: [
    'Upbeat pop song about summer vacation',
    'Melancholic piano piece for rainy days',
    'Energetic electronic dance track',
  ],
  pdf: ['Upload a PDF to analyze...'],
  url: ['Paste a URL to summarize...'],
};

export const ChatContainer: React.FC = () => {
  const { currentConversation, isLoading, isStreaming, currentMode } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isLoading]);

  const { sendMessage } = useChat();

  if (!currentConversation || currentConversation.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              What can I help you with?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
              Ask me anything, search the web, generate images, or analyze documents.
            </p>

            <div className="grid gap-2 text-left">
              {suggestions[currentMode].map((suggestion, i) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => sendMessage(suggestion, currentMode)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group text-left"
                >
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
        <ChatInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {currentConversation.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index === currentConversation.messages.length - 1 ? 0 : 0 }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}

          {isLoading && !isStreaming && (
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <LoadingDots />
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      <ChatInput />
    </div>
  );
};
