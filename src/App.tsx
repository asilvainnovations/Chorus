// src/App.tsx
import React from 'react';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/Layout/AppLayout';
import { ChatContainer } from './components/Chat/ChatContainer';
import { useTheme } from './hooks/useTheme';

const ThemeInitializer: React.FC = () => {
  useTheme(); // Initializes theme on mount
  return null;
};

function App() {
  return (
    <AppProvider>
      <ThemeInitializer />
      <AppLayout>
        <ChatContainer />
      </AppLayout>
    </AppProvider>
  );
}

export default App;
