"use client";

import { useEffect } from 'react';
import ChatPanel from './ChatPanel';
import { useChat } from '@/context/ChatContext';
import { Item } from '@/types';

interface AppWrapperProps {
  children: React.ReactNode;
  onItemClick?: (item: Item) => void;
}

export default function AppWrapper({ children, onItemClick }: AppWrapperProps) {
  const { selectedItem, setSelectedItem } = useChat();

  useEffect(() => {
    if (selectedItem && onItemClick) {
      onItemClick(selectedItem);
    }
  }, [selectedItem, onItemClick]);

  return (
    <>
      {children}
      <ChatPanel 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </>
  );
} 