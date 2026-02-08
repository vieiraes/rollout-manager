import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NotebookForm } from '@/components/notebooks/notebook-form';

export const metadata = {
  title: 'Novo Notebook | Rollout Manager',
  description: 'Cadastrar novo notebook',
};

export default function NewNotebookPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header - mobile-first */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
            <Link href="/notebooks">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Novo Notebook</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <NotebookForm />
      </div>
    </div>
  );
}
