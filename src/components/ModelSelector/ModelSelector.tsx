// src/components/ModelSelector/ModelSelector.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { AI_MODELS, getBasicModels, getPremiumModels } from '../../services/models';
import posthog from '@/posthog';

export const ModelSelector: React.FC = () => {
  const { selectedModel, setModel } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        <Sparkles size={16} className={currentModel?.category === 'premium' ? 'text-yellow-500' : 'text-blue-500'} />
        <span className="font-medium">{currentModel?.name || 'Select Model'}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1.5 uppercase tracking-wider">
              Premium Models
            </div>
            {getPremiumModels().map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setModel(model.id);
                  posthog.capture('model_selected', {
                    model_id: model.id,
                    model_category: model.category,
                  });
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  selectedModel === model.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Sparkles size={16} className="text-yellow-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{model.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{model.description}</div>
                </div>
              </button>
            ))}

            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1.5 uppercase tracking-wider mt-2">
              Basic Models
            </div>
            {getBasicModels().map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setModel(model.id);
                  posthog.capture('model_selected', {
                    model_id: model.id,
                    model_category: model.category,
                  });
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  selectedModel === model.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Zap size={16} className="text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{model.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{model.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
