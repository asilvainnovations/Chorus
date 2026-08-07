// src/components/Layout/Header.tsx
import React, { useState } from 'react';
import {
  Menu,
  Command,
  Plus,
  Search,
  Image,
  MessageSquare,
  Settings,
  Music,
  FileText,
  Link2,
} from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { ModelSelector } from '../ModelSelector/ModelSelector';
import { SettingsPanel } from '../Settings/SettingsPanel';
import { ChatMode } from '../../types';

const modeConfig: Record<ChatMode, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  chat: {
    icon: <MessageSquare size={16} />,
    label: 'Chat',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  search: {
    icon: <Search size={16} />,
    label: 'Search',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  image: {
    icon: <Image size={16} />,
    label: 'Image',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  music: {
    icon: <Music size={16} />,
    label: 'Music',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
  },
  pdf: {
    icon: <FileText size={16} />,
    label: 'PDF',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  url: {
    icon: <Link2 size={16} />,
    label: 'URL',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
};

export const Header: React.FC = () => {
  const { toggleSidebar, currentMode, setMode, createConversation, toggleCommandPalette } = useChatStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${modeConfig[currentMode].bg}`} />
            <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Huli Ka
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-0.5 ml-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {(Object.keys(modeConfig) as ChatMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setMode(mode)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  currentMode === mode
                    ? `${modeConfig[mode].bg} ${modeConfig[mode].color} shadow-sm`
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={modeConfig[mode].label}
              >
                {modeConfig[mode].icon}
                <span className="hidden lg:inline">{modeConfig[mode].label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
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
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm text-gray-500"
            title="Command Palette (⌘K)"
          >
            <Command size={14} />
            <span className="text-xs">K</span>
          </button>

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
