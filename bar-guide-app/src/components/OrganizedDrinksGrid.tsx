"use client";

import { Item } from '@/types';

interface OrganizedDrinksGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

interface DrinkCategory {
  title: string;
  items: Item[];
  icon: string;
  description: string;
}

export default function OrganizedDrinksGrid({ items, onItemClick }: OrganizedDrinksGridProps) {
  // Función para categorizar las bebidas
  const categorizeDrinks = (drinks: Item[]): DrinkCategory[] => {
    const categories: DrinkCategory[] = [
      {
        title: "Margaritas Clásicas",
        items: [],
        icon: "🍹",
        description: "Nuestras margaritas tradicionales y favoritas"
      },
      {
        title: "Margaritas Frozen",
        items: [],
        icon: "🧊",
        description: "Refrescantes margaritas heladas"
      },
      {
        title: "Margaritas Premium",
        items: [],
        icon: "⭐",
        description: "Margaritas especiales con ingredientes premium"
      },
      {
        title: "Flights & Experiencias",
        items: [],
        icon: "🎯",
        description: "Vuelos de degustación y experiencias únicas"
      },
      {
        title: "Otras Bebidas",
        items: [],
        icon: "🍸",
        description: "Cócteles especiales y bebidas únicas"
      }
    ];

    drinks.forEach(drink => {
      const name = drink.name.toLowerCase();
      
      if (name.includes('frozen')) {
        categories[1].items.push(drink);
      } else if (name.includes('flight') || name.includes('titanic')) {
        categories[3].items.push(drink);
      } else if (name.includes('premium') || name.includes('hennessy') || name.includes('clase azul') || name.includes('texas')) {
        categories[2].items.push(drink);
      } else if (name.includes('margarita') || name.includes('mezcalita')) {
        categories[0].items.push(drink);
      } else {
        categories[4].items.push(drink);
      }
    });

    // Filtrar categorías que tienen items
    return categories.filter(category => category.items.length > 0);
  };

  const categorizedDrinks = categorizeDrinks(items);

  return (
    <div className="p-6 space-y-8">
      {categorizedDrinks.map((category, categoryIndex) => (
        <div key={categoryIndex} className="max-w-6xl mx-auto">
          {/* Título de la categoría */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl" role="img" aria-label={category.title}>
                {category.icon}
              </span>
              <h2 className="text-2xl font-bold text-gray-800">
                {category.title}
              </h2>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {category.description}
            </p>
            <div className="w-full h-0.5 bg-gradient-to-r from-[#87CEEB] to-transparent"></div>
          </div>

          {/* Grid de items */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.items.map((item, index) => (
              <button
                key={index}
                onClick={() => onItemClick(item)}
                className="w-full px-4 py-3 bg-[#87CEEB] text-black font-bold text-sm
                         rounded-lg hover:bg-[#7BC4E8] transition-all duration-200
                         border-b-4 border-[#4A90E2] hover:border-[#357ABD]
                         shadow-sm hover:shadow-md transform hover:scale-105
                         text-center leading-tight"
                aria-label={`Ver receta de ${item.name}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 