// src/App.tsx
import React from 'react';
import { ChatContainer } from './components/Chat/ChatContainer';
import { ConversationSidebar } from './components/Sidebar/ConversationSidebar';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { Header } from './components/Layout/Header';
import { useChatStore } from './store/chatStore';
import { useTheme } from './hooks/useTheme';

function App() {
  const { sidebarOpen } = useChatStore();
  const { theme } = useTheme();

  return (
    <div className={`h-screen w-screen flex overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        <ConversationSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <ChatContainer />
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette />
    </div>
  );
}

export default App;
