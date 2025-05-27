"use client";

import { Item } from '@/types';

interface ItemGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

export default function ItemGrid({ items, onItemClick }: ItemGridProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onItemClick(item)}
            className="w-full px-4 py-3 bg-[#87CEEB] text-black font-bold text-sm
                     rounded-lg hover:bg-[#7BC4E8] transition-colors duration-200
                     border-b-4 border-[#4A90E2] hover:border-[#357ABD]
                     shadow-sm hover:shadow-md transform hover:scale-105"
            aria-label={`Ver receta de ${item.name}`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
} 