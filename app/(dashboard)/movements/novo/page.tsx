import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MovementForm } from '@/components/movements/movement-form';

export const metadata = {
  title: 'Nova Movimentação | Rollout Manager',
  description: 'Criar nova movimentação',
};

export default function NewMovementPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header - mobile-first */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
            <Link href="/movements">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Nova Movimentação</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <MovementForm />
      </div>
    </div>
  );
}
