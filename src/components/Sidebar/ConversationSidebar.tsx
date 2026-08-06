// src/components/Sidebar/ConversationSidebar.tsx
import React from 'react';
import { MessageSquare, Trash2, Edit3, X } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { formatDistanceToNow } from 'date-fns';

export const ConversationSidebar: React.FC = () => {
  const { conversations, currentConversationId, setCurrentConversation, deleteConversation, renameConversation, createConversation } = useChatStore();

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="h-full w-80 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-3">
        <button
          onClick={() => createConversation()}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
        >
          <MessageSquare size={18} />
          <span className="font-medium text-sm">New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-2 uppercase tracking-wider">
          Recent Conversations
        </div>
        
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`group relative rounded-lg transition-colors ${
              currentConversationId === conversation.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
            }`}
          >
            {editingId === conversation.id ? (
              <div className="flex items-center gap-2 px-3 py-2.5">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveRename(conversation.id)}
                  onBlur={() => saveRename(conversation.id)}
                  autoFocus
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                />
                <button onClick={() => setEditingId(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentConversation(conversation.id)}
                className="w-full flex items-start gap-3 px-3 py-2.5 text-left"
              >
                <MessageSquare size={16} className="mt-0.5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{conversation.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(conversation.id, conversation.title);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </button>
            )}
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
};
