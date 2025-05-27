"use client";

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CategorySidebarProps {
  currentCategory: string;
  categories: Array<{ name: string; slug: string; icon: string; color: string }>;
}

export default function CategorySidebar({ currentCategory, categories }: CategorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update main content margin when sidebar state changes
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.style.marginLeft = isCollapsed ? '4rem' : '16rem';
    }
  }, [isCollapsed]);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r-2 border-gray-200 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-6 bg-[#87CEEB] text-white rounded-full p-3 shadow-lg hover:bg-[#87CEEB]/90 transition-all duration-200 hover:scale-110 z-50"
        aria-label={isCollapsed ? "Expandir navegación" : "Colapsar navegación"}
      >
        {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          {!isCollapsed ? (
            <h2 className="text-lg font-semibold text-gray-800">Categorías</h2>
          ) : (
            <div className="text-center">
              <span className="text-2xl">📋</span>
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-3">
          {categories.map((category) => {
            const isActive = category.name === currentCategory;
            
            return (
              <div key={category.slug} className="relative group">
                <Link
                  href={`/category/${category.slug}`}
                  className={`block mb-3 ${isCollapsed ? 'p-3' : 'p-4'} rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#87CEEB] text-white shadow-lg border-2 border-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow-md border-2 border-transparent'
                  } ${isCollapsed ? 'min-h-[60px]' : 'min-h-[70px]'} flex items-center relative`}
                  style={{
                    backgroundColor: isActive ? category.color : undefined
                  }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  )}
                  
                  <div className="flex items-center w-full">
                    <span className={`${isCollapsed ? 'text-3xl' : 'text-2xl'} ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} role="img" aria-label={category.name}>
                      {category.icon}
                    </span>
                    {!isCollapsed && (
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-sm leading-tight">
                          {category.name}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {category.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              Navegación rápida para barmans
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 