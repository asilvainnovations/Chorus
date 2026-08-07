// src/components/Settings/SettingsPanel.tsx
import React from 'react';
import { X, Key, Zap, Volume2, VolumeX, Monitor, Sun, Moon } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useTheme } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from '../../posthog';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, selectedModel, setModel } = useChatStore();
  const { theme, setTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* API Key */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Key size={14} />
                  API Configuration
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">OpenRouter API Key</label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => updateSettings({ apiKey: e.target.value })}
                      placeholder="sk-or-v1-..."
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      Your key is stored locally and never sent to our servers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Appearance */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Monitor size={14} />
                  Appearance
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t);
                        posthog.capture('theme_selected', { theme: t });
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        theme === t
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t === 'light' && <Sun size={20} />}
                      {t === 'dark' && <Moon size={20} />}
                      {t === 'system' && <Monitor size={20} />}
                      <span className="text-xs font-medium capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Preferences */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap size={14} />
                  Preferences
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                    <span className="text-sm font-medium">Streaming Responses</span>
                    <input
                      type="checkbox"
                      checked={settings.streamingEnabled}
                      onChange={(e) => {
                        updateSettings({ streamingEnabled: e.target.checked });
                        posthog.capture('preference_updated', {
                          preference: 'streaming_enabled',
                          enabled: e.target.checked,
                        });
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      Sound Effects
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => {
                        updateSettings({ soundEnabled: e.target.checked });
                        posthog.capture('preference_updated', {
                          preference: 'sound_enabled',
                          enabled: e.target.checked,
                        });
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </section>

              {/* Default Model */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Default Model
                </h3>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setModel(e.target.value);
                    posthog.capture('model_selected', {
                      model: e.target.value,
                      source: 'settings',
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <optgroup label="Premium">
                    <option value="openai/gpt-4o">GPT-4o</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="google/gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="xai/grok-2">Grok 2</option>
                  </optgroup>
                  <optgroup label="Basic">
                    <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                    <option value="google/gemini-1.5-flash">Gemini 1.5 Flash</option>
                  </optgroup>
                </select>
              </section>

              {/* Data */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Data
                </h3>
                <button
                  onClick={() => {
                    if (confirm('Clear all conversations? This cannot be undone.')) {
                      useChatStore.getState().clearAllConversations();
                      posthog.capture('conversations_cleared');
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                >
                  Clear All Conversations
                </button>
              </section>

              {/* Version */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-400 text-center">
                  Huli Ka v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
