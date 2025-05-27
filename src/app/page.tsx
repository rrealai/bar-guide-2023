import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/data';

export default function HomePage() {
  const categories = getCategories();

  // Organize categories into logical sections
  const drinkCategories = categories.filter(cat => 
    ['DRINKS', 'CUMMING DRINKS', 'MOCKTAILS'].includes(cat)
  );

  const sideworkCategories = categories.filter(cat => 
    ['AM OPENING SIDEWORK', 'PM OPENING SIDEWORK', 'PM CLOSING SIDEWORK'].includes(cat)
  );

  const checklistCategories = categories.filter(cat => 
    ['CHECK OF CHECKLIST', 'MIXERS CHECKLIST', 'FRUITS & GARNISHES CHECKLIST'].includes(cat)
  );

  const prepCategories = categories.filter(cat => 
    ['GARNISH', 'UNIFORMS', 'BATCHES'].includes(cat)
  );

  const CategoryCard = ({ category, bgColor, textColor = "text-white" }: { 
    category: string; 
    bgColor: string; 
    textColor?: string;
  }) => (
    <Link
      href={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}
      className="block transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      <div className={`${bgColor} ${textColor} rounded-xl shadow-md flex items-center justify-center text-lg font-semibold p-6 h-24 text-center hover:opacity-90 border-2 border-transparent hover:border-white/20`}>
        {category}
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            BAR GUIDE
          </h1>
          <div className="w-24 h-1 bg-cyan-400 mx-auto rounded-full"></div>
        </div>

        {/* Drinks Section */}
        <section className="mb-12">
          <SectionTitle title="Bebidas" icon="🍹" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drinkCategories.map((category) => (
              <CategoryCard 
                key={category} 
                category={category} 
                bgColor="bg-gradient-to-r from-cyan-500 to-blue-500" 
              />
            ))}
          </div>
        </section>

        {/* Sidework Section */}
        <section className="mb-12">
          <SectionTitle title="Sidework" icon="🔧" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sideworkCategories.map((category) => (
              <CategoryCard 
                key={category} 
                category={category} 
                bgColor="bg-gradient-to-r from-emerald-500 to-teal-500" 
              />
            ))}
          </div>
        </section>

        {/* Checklists Section */}
        <section className="mb-12">
          <SectionTitle title="Checklists" icon="✅" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {checklistCategories.map((category) => (
              <CategoryCard 
                key={category} 
                category={category} 
                bgColor="bg-gradient-to-r from-orange-500 to-red-500" 
              />
            ))}
          </div>
        </section>

        {/* Preparation Section */}
        <section className="mb-12">
          <SectionTitle title="Preparación" icon="📋" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prepCategories.map((category) => (
              <CategoryCard 
                key={category} 
                category={category} 
                bgColor="bg-gradient-to-r from-purple-500 to-pink-500" 
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-16">
          <p className="text-sm">Rreal Tacos Bar Guide - Guía Interactiva para Bartenders</p>
        </footer>
      </div>
    </main>
  );
} 