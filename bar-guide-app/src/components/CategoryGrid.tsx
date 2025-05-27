"use client";

import Link from 'next/link';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const createSlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, '-');
  };

  // Organize categories into logical sections
  const drinkCategories = categories.filter(cat => 
    ['DRINKS', 'CUMMING DRINKS', 'MOCKTAILS'].includes(cat.category)
  );

  const sideworkCategories = categories.filter(cat => 
    ['AM OPENING SIDEWORK', 'PM OPENING SIDEWORK', 'PM CLOSING SIDEWORK'].includes(cat.category)
  );

  const checklistCategories = categories.filter(cat => 
    ['CHECK OF CHECKLIST', 'MIXERS CHECKLIST', 'FRUITS & GARNISHES CHECKLIST'].includes(cat.category)
  );

  const prepCategories = categories.filter(cat => 
    ['GARNISH', 'UNIFORMS', 'BATCHES'].includes(cat.category)
  );

  const CategoryCard = ({ category, emoji }: { 
    category: Category; 
    emoji: string;
  }) => (
    <Link
      href={`/category/${createSlug(category.category)}`}
      className="block transform transition-all duration-200 hover:scale-105"
    >
      <div className="bg-[#87CEEB] text-black font-bold rounded-lg hover:bg-[#7BC4E8] transition-colors duration-200 border-b-4 border-[#4A90E2] hover:border-[#357ABD] shadow-sm hover:shadow-md p-4 h-24 flex items-center justify-center text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">{emoji}</span>
          <span className="text-sm font-semibold">{category.category}</span>
        </div>
      </div>
    </Link>
  );

  const SectionTitle = ({ title, icon }: { title: string; icon: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-3xl">{icon}</span>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Drinks Section */}
        <section className="mb-12">
          <SectionTitle title="🍹 Bebidas" icon="" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {drinkCategories.map((category, index) => {
              const emojis = ['🍹', '🍸', '🥤'];
              return (
                <CategoryCard 
                  key={index} 
                  category={category} 
                  emoji={emojis[index] || '🍹'}
                />
              );
            })}
          </div>
        </section>

        {/* Sidework Section */}
        <section className="mb-12">
          <SectionTitle title="🔧 Sidework" icon="" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sideworkCategories.map((category, index) => {
              const emojis = ['🌅', '🌆', '🌙'];
              return (
                <CategoryCard 
                  key={index} 
                  category={category} 
                  emoji={emojis[index] || '🔧'}
                />
              );
            })}
          </div>
        </section>

        {/* Checklists Section */}
        <section className="mb-12">
          <SectionTitle title="✅ Checklists" icon="" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {checklistCategories.map((category, index) => {
              const emojis = ['📋', '🧊', '🍎'];
              return (
                <CategoryCard 
                  key={index} 
                  category={category} 
                  emoji={emojis[index] || '✅'}
                />
              );
            })}
          </div>
        </section>

        {/* Preparation Section */}
        <section className="mb-12">
          <SectionTitle title="📦 Preparación" icon="" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prepCategories.map((category, index) => {
              const emojis = ['🍋', '👕', '⚗️'];
              return (
                <CategoryCard 
                  key={index} 
                  category={category} 
                  emoji={emojis[index] || '📦'}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
} 