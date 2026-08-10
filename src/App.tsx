// src/App.tsx
// ============================================
// Root Application Component
// ============================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/Layout/AppLayout';
import { ChatContainer } from './components/Chat/ChatContainer';
import { LandingPage } from './components/Landing/LandingPage';
import { useTheme } from './hooks/useTheme';

const ThemeInitializer: React.FC = () => {
  useTheme();
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ThemeInitializer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/chat"
            element={
              <AppLayout>
                <ChatContainer />
              </AppLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
