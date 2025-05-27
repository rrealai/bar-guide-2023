export interface CategoryInfo {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export function categoryToSlug(categoryName: string): string {
  return categoryName.toLowerCase().replace(/\s+/g, '-');
}

export function slugToCategory(slug: string): string {
  return slug.replace(/-/g, ' ').toUpperCase();
}

export const categoryMappings: Record<string, CategoryInfo> = {
  'DRINKS': {
    name: 'DRINKS',
    slug: 'drinks',
    icon: '🍹',
    color: '#87CEEB'
  },
  'CUMMING DRINKS': {
    name: 'CUMMING DRINKS',
    slug: 'cumming-drinks',
    icon: '🥃',
    color: '#DDA0DD'
  },
  'MOCKTAILS': {
    name: 'MOCKTAILS',
    slug: 'mocktails',
    icon: '🥤',
    color: '#98FB98'
  },
  'AM OPENING SIDEWORK': {
    name: 'AM OPENING SIDEWORK',
    slug: 'am-opening-sidework',
    icon: '🌅',
    color: '#FFB347'
  },
  'PM OPENING SIDEWORK': {
    name: 'PM OPENING SIDEWORK',
    slug: 'pm-opening-sidework',
    icon: '🌆',
    color: '#FF6B6B'
  },
  'PM CLOSING SIDEWORK': {
    name: 'PM CLOSING SIDEWORK',
    slug: 'pm-closing-sidework',
    icon: '🌙',
    color: '#4169E1'
  },
  'CHECK OF CHECKLIST': {
    name: 'CHECK OF CHECKLIST',
    slug: 'check-of-checklist',
    icon: '✅',
    color: '#32CD32'
  },
  'MIXERS CHECKLIST': {
    name: 'MIXERS CHECKLIST',
    slug: 'mixers-checklist',
    icon: '🧪',
    color: '#FF69B4'
  }
};

export function getAllCategories(): CategoryInfo[] {
  return Object.values(categoryMappings);
}

export function getCategoryInfo(categoryName: string): CategoryInfo | undefined {
  return categoryMappings[categoryName];
} 