import { useMemo } from 'react';
import { useChatStore } from '../store/chatStore';
import { getDomainById, getAllDomains } from '../types/domain';
import { Domain } from '../types';

/**
 * Hook to access domain context for the current conversation
 * Tracks active domain and provides related domain suggestions
 */
export const useDomainContext = () => {
  const { currentConversationId, conversations } = useChatStore();

  const currentConversation = conversations.find((c) => c.id === currentConversationId);
  const activeDomainId = currentConversation?.activeDomain;

  const activeDomain = useMemo(() => {
    return activeDomainId ? getDomainById(activeDomainId) : null;
  }, [activeDomainId]);

  const relatedDomains = useMemo(() => {
    if (!activeDomain) return [];
    return activeDomain.relatedDomainIds
      .map((id: string) => getDomainById(id))
      .filter((d): d is Domain => d !== undefined);
  }, [activeDomain]);

  const allDomains = useMemo(() => getAllDomains(), []);

  const suggestedQueries = useMemo(() => {
    return activeDomain?.suggestedQueries || [];
  }, [activeDomain]);

  return {
    activeDomain,
    relatedDomains,
    allDomains,
    suggestedQueries,
    hasActiveDomain: !!activeDomain,
  };
};
