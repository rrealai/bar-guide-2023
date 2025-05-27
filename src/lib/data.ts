// import fs from 'fs'; // Not needed with direct JSON import
// import path from 'path'; // Not needed with direct JSON import
import seedMenu from '@/data/seedMenu.json';

export interface MenuItem {
  name: string;
  recipe?: string; // Recipe is optional as per GARNISH category
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// Type guard to ensure the imported JSON matches our expected structure
function isMenuData(data: any): data is MenuCategory[] {
  if (!Array.isArray(data)) return false;
  return data.every(category => 
    typeof category === 'object' && 
    category !== null &&
    'category' in category && 
    typeof category.category === 'string' &&
    'items' in category &&
    Array.isArray(category.items) &&
    category.items.every(item => 
      typeof item === 'object' && 
      item !== null &&
      'name' in item && 
      typeof item.name === 'string' &&
      (item.recipe === undefined || typeof item.recipe === 'string') // recipe can be missing or string
    )
  );
}

// Validate the imported data once
const validatedSeedMenu: MenuCategory[] = (() => {
  if (isMenuData(seedMenu)) {
    return seedMenu;
  }
  console.error("CRITICAL: Invalid seedMenu.json data structure. Please check the file.", seedMenu);
  // In a real app, you might throw an error here or return a default empty state
  // For now, returning empty array to prevent runtime errors if data is malformed.
  return []; 
})();

export function getMenuData(): MenuCategory[] {
  return validatedSeedMenu;
}

export function getCategories(): string[] {
  return validatedSeedMenu.map(cat => cat.category);
}

export function getItemsByCategory(categoryName: string): MenuItem[] | undefined {
  const category = validatedSeedMenu.find(cat => cat.category === categoryName);
  return category?.items;
}

export function getItem(categoryName: string, itemName: string): MenuItem | undefined {
  const items = getItemsByCategory(categoryName);
  return items?.find(item => item.name === itemName);
} 