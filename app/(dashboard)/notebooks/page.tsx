import { Suspense } from 'react';
import { NotebookList } from '@/components/notebooks/notebook-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Notebooks | Rollout Manager',
  description: 'Gerenciamento de notebooks',
};

export default function NotebooksPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header - mobile-first */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Notebooks</h1>
          <Button asChild size="sm" className="min-h-[44px] min-w-[44px]">
            <Link href="/notebooks/novo">
              <Plus className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Novo</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        }>
          <NotebookList />
        </Suspense>
      </div>
    </div>
  );
}
