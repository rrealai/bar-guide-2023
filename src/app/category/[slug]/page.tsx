import CategoryPageContent from '@/components/CategoryPageContent';
import AppWrapper from '@/components/AppWrapper';
import Header from '@/components/Header';
import { ChatProvider } from '@/context/ChatContext';
import { slugToCategory } from '@/lib/categories';
import seedMenu from '@/data/seedMenu.json';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryName = slugToCategory(slug);
  const category = seedMenu.find(cat => cat.category === categoryName);
  const items = category?.items || [];

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AppWrapper>
          <CategoryPageContent 
            items={items}
            categoryName={categoryName}
          />
        </AppWrapper>
      </div>
    </ChatProvider>
  );
} 