import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/date.util';

interface NotebookDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getNotebook(id: number) {
  const res = await fetch(`http://localhost:3001/api/notebooks/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch notebook');
  }
  
  return res.json();
}

export default async function NotebookDetailPage({ params }: NotebookDetailPageProps) {
  const { id } = await params;
  const notebookId = parseInt(id);
  
  if (isNaN(notebookId)) {
    notFound();
  }
  
  const notebook = await getNotebook(notebookId);
  
  if (!notebook) {
    notFound();
  }

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
          <h1 className="text-xl font-semibold flex-1 truncate">{notebook.serviceTag}</h1>
          <Button asChild variant="outline" size="icon" className="min-h-[44px] min-w-[44px]">
            <Link href={`/notebooks/${notebook.id}/editar`}>
              <Edit className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge variant={
            notebook.status === 'DELIVERED' ? 'default' :
            notebook.status === 'HOMOLOGATED' ? 'secondary' :
            'outline'
          } className="text-base px-4 py-2">
            {notebook.status}
          </Badge>
        </div>

        {/* Main Info Card */}
        <Card className="p-4 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Service Tag</p>
            <p className="text-lg font-semibold">{notebook.serviceTag}</p>
          </div>
          
          {notebook.hostname && (
            <div>
              <p className="text-sm text-muted-foreground">Hostname</p>
              <p className="font-medium">{notebook.hostname}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Marca</p>
              <p className="font-medium">{notebook.brand}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Modelo</p>
              <p className="font-medium">{notebook.model}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="font-medium">{notebook.notebookType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RAM</p>
              <p className="font-medium">{notebook.ramConfig}</p>
            </div>
          </div>
        </Card>

        {/* Location Card */}
        {notebook.place && (
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Localização Atual</p>
                <p className="font-semibold">{notebook.place.name}</p>
                {notebook.place.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {notebook.place.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Employee Info */}
        {(notebook.responsibleAnalyst || notebook.zurichEmployee) && (
          <Card className="p-4 space-y-3">
            {notebook.responsibleAnalyst && (
              <div>
                <p className="text-sm text-muted-foreground">Analista Responsável</p>
                <p className="font-medium">{notebook.responsibleAnalyst}</p>
              </div>
            )}
            {notebook.zurichEmployee && (
              <div>
                <p className="text-sm text-muted-foreground">Colaborador</p>
                <p className="font-medium">{notebook.zurichEmployee}</p>
              </div>
            )}
          </Card>
        )}

        {/* Timestamps */}
        <Card className="p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Criado em {formatDate(new Date(notebook.createdAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Atualizado em {formatDate(new Date(notebook.updatedAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-4 border-destructive/50">
          <Button variant="destructive" className="w-full min-h-[44px]">
            <Trash2 className="h-5 w-5 mr-2" />
            Excluir Notebook
          </Button>
        </Card>
      </div>
    </div>
  );
}
