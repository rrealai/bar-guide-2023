import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Image
            src="/real-tacos-logo.svg"
            alt="Real Tacos Logo"
            width={120}
            height={90}
            className="h-16 w-auto"
            priority
          />
        </div>
      </div>
    </header>
  );
} 