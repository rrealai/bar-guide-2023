"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Item } from '@/types';

interface ChatContextType {
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <ChatContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 