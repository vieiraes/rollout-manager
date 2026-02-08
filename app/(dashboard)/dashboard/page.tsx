import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Move, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Rollout Manager',
  description: 'Visão geral do sistema',
};

async function getStats() {
  try {
    const res = await fetch('http://localhost:3000/api/notebooks?page=1&limit=1', {
      cache: 'no-store',
    });
    
    if (!res.ok) return { total: 0 };
    
    const data = await res.json();
    return { total: data.total || 0 };
  } catch (error) {
    return { total: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Notebooks */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Notebooks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>

          {/* Pending */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </Card>

          {/* In Rollout */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Move className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Rollout</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </Card>

          {/* Delivered */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entregues</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/notebooks/novo">
                <Package className="h-5 w-5 mr-2" />
                Novo Notebook
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/movements/novo">
                <Move className="h-5 w-5 mr-2" />
                Nova Movimentação
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/places/novo">
                <MapPin className="h-5 w-5 mr-2" />
                Novo Local
              </Link>
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Atividades Recentes</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma atividade recente</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
