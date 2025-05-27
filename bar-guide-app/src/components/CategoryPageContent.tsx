"use client";

import Link from 'next/link';
import ItemGrid from '@/components/ItemGrid';
import OrganizedDrinksGrid from '@/components/OrganizedDrinksGrid';
import CategorySidebar from '@/components/CategorySidebar';
import { useChat } from '@/context/ChatContext';
import { Item } from '@/types';
import { getAllCategories, getCategoryInfo } from '@/lib/categories';

interface CategoryPageContentProps {
  items: Item[];
  categoryName: string;
}

export default function CategoryPageContent({ items, categoryName }: CategoryPageContentProps) {
  const { setSelectedItem } = useChat();
  const allCategories = getAllCategories();
  const currentCategoryInfo = getCategoryInfo(categoryName);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Category Sidebar */}
      <CategorySidebar 
        currentCategory={categoryName}
        categories={allCategories}
      />

      {/* Main Content with left margin to account for sidebar */}
      <div className="transition-all duration-300 ml-64" id="main-content">
        {/* Header */}
        <div className="bg-white py-6 border-b-2 border-[#87CEEB]">
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/"
              className="flex items-center text-black hover:text-[#4A90E2]"
              aria-label="Volver a categorías"
            >
              <span className="material-icons text-2xl">arrow_back</span>
            </Link>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                {currentCategoryInfo && (
                  <span className="text-3xl" role="img" aria-label={categoryName}>
                    {currentCategoryInfo.icon}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-black">{categoryName}</h1>
              </div>
              <div className="w-24 h-1 bg-[#87CEEB] mx-auto"></div>
            </div>
          </div>
        </div>
        
        {categoryName === 'DRINKS' ? (
          <OrganizedDrinksGrid 
            items={items}
            onItemClick={handleItemClick}
          />
        ) : (
          <ItemGrid 
            items={items}
            onItemClick={handleItemClick}
          />
        )}
      </div>
    </main>
  );
} 