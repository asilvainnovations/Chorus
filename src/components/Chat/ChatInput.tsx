// src/components/Chat/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useChat } from '../../hooks/useChat';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isLoading, isStreaming, currentMode } = useChatStore();
  const { sendMessage, abortStream } = useChat();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message, currentMode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.start();
  };

  const getPlaceholder = () => {
    switch (currentMode) {
      case 'search':
        return 'Search the web for anything...';
      case 'image':
        return 'Describe the image you want to generate...';
      case 'music':
        return 'Describe the music you want to create...';
      case 'pdf':
        return 'Upload a PDF to analyze...';
      case 'url':
        return 'Paste a URL to summarize...';
      default:
        return 'Message Huli Ka...';
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shrink-0">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <div className="flex items-center gap-1 pl-3 py-3">
            <label className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
              <Paperclip size={18} className="text-gray-500" />
              <input
                type="file"
                className="hidden"
                accept=".pdf,.txt,.doc,.docx,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) console.log('File selected:', file.name);
                }}
              />
            </label>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-1.5 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500 animate-pulse'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500'
              }`}
              title="Voice input"
            >
              <Mic size={18} />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none py-3 text-sm max-h-[200px] placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-gray-100"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1 pr-3 py-3">
            {isStreaming ? (
              <button
                type="button"
                onClick={abortStream}
                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                title="Stop generating"
              >
                <StopCircle size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-600">
          Huli Ka can make mistakes. Consider checking important information. •{' '}
          <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </form>
    </div>
  );
};
