import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface ChatLayoutProps {
  children: ReactNode;
  showSettings?: boolean;
}

export function ChatLayout({ children, showSettings = true }: ChatLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Header - Using TopBar component with Settings */}
      <TopBar showLogo={true} showSettings={showSettings} />

      {/* Main Content */}
      <main className="pt-16 pb-4">
        <div className="max-w-2xl mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}