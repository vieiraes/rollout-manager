'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Package, Move, MapPin, Home } from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/notebooks',
    icon: Home,
  },
  {
    name: 'Notebooks',
    href: '/notebooks',
    icon: Package,
  },
  {
    name: 'Movimentos',
    href: '/movements',
    icon: Move,
  },
  {
    name: 'Locais',
    href: '/places',
    icon: MapPin,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden safe-area-inset">
        <div className="grid h-16 grid-cols-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||  pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex touch-target flex-col items-center justify-center gap-1 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:z-40 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">Rollout Manager</h1>
        </div>
        <div className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
