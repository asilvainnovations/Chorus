// src/components/Chat/ChatContainer.tsx
import React, { useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingDots } from '../Common/LoadingDots';
import { Bot, Sparkles } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const { currentConversation, isLoading, isStreaming, currentMode } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isLoading, isStreaming]);

  if (!currentConversation || currentConversation.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">What can I help you with?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Ask me anything, search the web, generate images, or analyze documents.
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              'Explain quantum computing',
              'Search latest AI news',
              'Generate a logo design',
              'Summarize this PDF',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  // Handle suggestion click
                }}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto w-full">
          <ChatInput />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {currentConversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && !isStreaming && (
            <div className="flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Bot size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <LoadingDots />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <ChatInput />
    </div>
  );
};
