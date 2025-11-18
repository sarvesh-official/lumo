'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  refreshSidebar: () => void;
  lastRefresh: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  const refreshSidebar = () => {
    setLastRefresh(Date.now());
  };

  return (
    <ChatContext.Provider value={{ refreshSidebar, lastRefresh }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
