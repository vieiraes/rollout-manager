import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PlacesList } from '@/components/places/places-list';

export const metadata = {
  title: 'Locais | Rollout Manager',
  description: 'Gerenciamento de locais',
};

export default function PlacesPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header - mobile-first */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Locais</h1>
          <Button asChild size="sm" className="min-h-[44px] min-w-[44px]">
            <Link href="/places/novo">
              <Plus className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Novo</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        }>
          <PlacesList />
        </Suspense>
      </div>
    </div>
  );
}
