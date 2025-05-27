import CategoryGrid from '@/components/CategoryGrid';
import AppWrapper from '@/components/AppWrapper';
import Header from '@/components/Header';
import { ChatProvider } from '@/context/ChatContext';
import seedMenu from '@/data/seedMenu.json';

export default function Home() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AppWrapper>
          <CategoryGrid categories={seedMenu} />
        </AppWrapper>
      </div>
    </ChatProvider>
  );
}
