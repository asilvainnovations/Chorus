// src/main.tsx
// ============================================
// Application Entry Point
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './posthog';

// Initialize theme before render to prevent flash
const savedTheme = localStorage.getItem('chorus-storage');
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme);
    const theme = parsed.state?.settings?.theme || 'system';
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.classList.add(resolved);
  } catch {
    document.documentElement.classList.add('light');
  }
} else {
  document.documentElement.classList.add('light');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
