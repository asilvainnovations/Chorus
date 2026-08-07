// src/components/Layout/Header.tsx
import React from 'react';
import {
  Menu,
  Command,
  Plus,
  Search,
  Image,
  MessageSquare,
  Sun,
  Moon,
  Monitor,
  Settings,
} from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useTheme } from '../../hooks/useTheme';
import { ModelSelector } from '../ModelSelector/ModelSelector';
import { ChatMode } from '../../types';

const modeConfig: Record<ChatMode, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  chat: {
    icon: <MessageSquare size={18} />,
    label: 'Chat',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  search: {
    icon: <Search size={18} />,
    label: 'Search',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  image: {
    icon: <Image size={18} />,
    label: 'Image',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  music: {
    icon: <span className="text-sm font-bold">♪</span>,
    label: 'Music',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
  },
  pdf: {
    icon: <span className="text-xs font-bold">PDF</span>,
    label: 'PDF',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  url: {
    icon: <span className="text-xs font-bold">URL</span>,
    label: 'URL',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
};

export const Header: React.FC = () => {
  const { toggleSidebar, currentMode, setMode, createConversation, toggleCommandPalette } = useChatStore();
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const themeIcon = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
    system: <Monitor size={18} />,
  };

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 bg-white dark:bg-gray-900 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${modeConfig[currentMode].bg.replace('bg-', 'bg-').replace('dark:bg-', '')}`} />
          <span className="font-semibold text-sm tracking-tight">Huli Ka</span>
        </div>

        <div className="flex items-center gap-1 ml-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(Object.keys(modeConfig) as ChatMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                currentMode === mode
                  ? `${modeConfig[mode].bg} ${modeConfig[mode].color} shadow-sm`
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={modeConfig[mode].label}
            >
              {modeConfig[mode].icon}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ModelSelector />

        <button
          onClick={() => createConversation()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="New Chat (⌘N)"
        >
          <Plus size={20} />
        </button>

        <button
          onClick={toggleCommandPalette}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5 text-sm text-gray-500"
          title="Command Palette (⌘K)"
        >
          <Command size={16} />
          <span className="hidden sm:inline text-xs">K</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
          title={`Theme: ${theme}`}
        >
          {themeIcon[theme]}
        </button>

        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
