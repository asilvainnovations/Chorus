// src/components/Layout/AppLayout.tsx
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { ConversationSidebar } from '../Sidebar/ConversationSidebar';
import { CommandPalette } from '../CommandPalette/CommandPalette';
import { useChatStore } from '../../store/chatStore';
import { useTheme } from '../../hooks/useTheme';
import { ErrorBoundary } from '../Common/ErrorBoundary';
import { Toaster } from '../Common/Toaster';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarOpen } = useChatStore();
  const { resolvedTheme } = useTheme();

  return (
    <ErrorBoundary>
      <div
        className={`h-screen w-screen flex overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${resolvedTheme}`}
        data-theme={resolvedTheme}
      >
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'
          } overflow-hidden border-r border-gray-200 dark:border-gray-800`}
          aria-hidden={!sidebarOpen}
        >
          <ConversationSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          <Header />
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>
        </main>

        {/* Global Overlays */}
        <CommandPalette />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
};
