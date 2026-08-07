// src/hooks/useCommandPalette.ts
import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { CommandItem } from '../types';
import { AI_MODELS } from '../services/models';

export const useCommandPalette = () => {
  const {
    toggleCommandPalette,
    commandPaletteOpen,
    setModel,
    setMode,
    createConversation,
    clearAllConversations,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      title: 'New Chat',
      shortcut: '⌘N',
      icon: 'MessageSquarePlus',
      action: () => {
        createConversation();
        toggleCommandPalette();
      },
      category: 'Navigation',
    },
    {
      id: 'search-mode',
      title: 'Switch to Search Mode',
      shortcut: '⌘⇧S',
      icon: 'Search',
      action: () => {
        setMode('search');
        toggleCommandPalette();
      },
      category: 'Mode',
    },
    {
      id: 'image-mode',
      title: 'Switch to Image Generation',
      shortcut: '⌘⇧I',
      icon: 'Image',
      action: () => {
        setMode('image');
        toggleCommandPalette();
      },
      category: 'Mode',
    },
    {
      id: 'chat-mode',
      title: 'Switch to Chat Mode',
      shortcut: '⌘⇧C',
      icon: 'MessageSquare',
      action: () => {
        setMode('chat');
        toggleCommandPalette();
      },
      category: 'Mode',
    },
    ...AI_MODELS.map((model) => ({
      id: `model-${model.id}`,
      title: `Switch to ${model.name}`,
      icon: 'Bot',
      action: () => {
        setModel(model.id);
        toggleCommandPalette();
      },
      category: 'Models',
    })),
    {
      id: 'clear-history',
      title: 'Clear All Conversations',
      icon: 'Trash2',
      action: () => {
        if (confirm('Are you sure you want to clear all conversations? This cannot be undone.')) {
          clearAllConversations();
        }
        toggleCommandPalette();
      },
      category: 'Actions',
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme',
      shortcut: '⌘⇧L',
      icon: 'Sun',
      action: () => {
        // Theme toggle handled by useTheme
        toggleCommandPalette();
      },
      category: 'Actions',
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }

      if (!commandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filteredCommands.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          (prev - 1 + Math.max(filteredCommands.length, 1)) % Math.max(filteredCommands.length, 1)
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        toggleCommandPalette();
      }
    },
    [commandPaletteOpen, filteredCommands, selectedIndex, toggleCommandPalette]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
  };
};
