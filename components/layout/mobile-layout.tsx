'use client';

import { ReactNode } from 'react';
import Navigation from './navigation';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      {/* Main Content */}
      <main className="flex-1 safe-area-inset">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <Navigation />
    </div>
  );
}
