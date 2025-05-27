export interface Category {
  category: string;
  items: Item[];
}

export interface Item {
  name: string;
  recipe?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
} 