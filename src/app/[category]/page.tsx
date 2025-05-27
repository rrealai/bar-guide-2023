'use client'; // This page is now interactive

import Link from 'next/link';
import { getItemsByCategory, getCategories, MenuItem } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import ChatPanel from '@/components/ChatPanel';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate static paths for categories to improve build time and SEO
export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const decodedCategoryName = decodeURIComponent(params.category);
  const items = getItemsByCategory(decodedCategoryName);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedItemForChat, setSelectedItemForChat] = useState<MenuItem | null>(null);

  if (!items) {
    notFound(); // Redirect to 404 if category or items not found
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItemForChat(item);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedItemForChat(null); // Clear selected item when chat closes
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-100">
      <div className="w-full max-w-4xl">
        <div className="mb-12 flex items-center justify-between">
          <Link href="/" className="text-primary hover:underline flex items-center">
            <ArrowLeft size={24} className="mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {decodedCategoryName}
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <button
                key={item.name}
                onClick={() => handleItemClick(item)}
                className="block w-full text-left transform transition-transform hover:scale-105 focus:outline-none"
              >
                <div className="bg-white border border-primary/30 text-primary rounded-lg shadow-lg flex items-center justify-center text-xl md:text-2xl font-semibold p-6 md:p-8 h-32 md:h-40 min-h-[120px] text-center hover:bg-primary/5">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-xl">
            No items available in this category.
          </p>
        )}
      </div>

      {selectedItemForChat && (
        <ChatPanel 
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          selectedItemName={selectedItemForChat.name}
          // initialRecipeText={selectedItemForChat.recipe} // Optionally pass recipe if needed by ChatPanel immediately
        />
      )}
    </main>
  );
} 