// src/components/Chat/ChatMessage.tsx
// ============================================
// Individual Chat Message Component
// ============================================

import React, { useState } from 'react';
import { User, Bot, Copy, Check, ExternalLink } from 'lucide-react';
import { Message } from '../../types';
import { MarkdownRenderer } from '../Common/MarkdownRenderer';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = message.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-left ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <MarkdownRenderer content={message.content} />
            </div>
          )}

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Sources
              </div>
              {message.citations.map((citation) => (
                <a
                  key={citation.id}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-600"
                >
                  <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                    [{citation.index}]
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {citation.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {citation.snippet}
                    </div>
                  </div>
                  <ExternalLink size={12} className="text-gray-400 flex-shrink-0 mt-1" />
                </a>
              ))}
            </div>
          )}

          {/* Generated Images */}
          {message.images && message.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {message.images.map((img) => (
                <div
                  key={img.id}
                  className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group"
                >
                  <div className="relative">
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{img.prompt}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{img.model}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Streaming indicator */}
          {message.isStreaming && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Generating...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5 px-1">
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          {message.model && (
            <span className="text-xs text-gray-400 dark:text-gray-600">
              • {message.model.split('/').pop()}
            </span>
          )}
          {!isUser && !message.isStreaming && (
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Copy message"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
