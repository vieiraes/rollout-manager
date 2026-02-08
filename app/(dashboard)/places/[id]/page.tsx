import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getPlace(id: number) {
  const res = await fetch(`http://localhost:3000/api/places/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch place');
  }
  
  return res.json();
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;
  const placeId = parseInt(id);
  
  if (isNaN(placeId)) {
    notFound();
  }
  
  const place = await getPlace(placeId);
  
  if (!place) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - mobile-first */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
            <Link href="/places">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold flex-1 truncate">{place.name}</h1>
          <Button asChild variant="outline" size="icon" className="min-h-[44px] min-w-[44px]">
            <Link href={`/places/${place.id}/editar`}>
              <Edit className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge variant={place.isActive ? 'default' : 'secondary'} className="text-base px-4 py-2">
            {place.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        {/* Main Info Card */}
        <Card className="p-4 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <p className="text-lg font-semibold">{place.name}</p>
          </div>
          
          {place.description && (
            <div>
              <p className="text-sm text-muted-foreground">Descrição</p>
              <p className="font-medium">{place.description}</p>
            </div>
          )}
        </Card>

        {/* Danger Zone */}
        <Card className="p-4 border-destructive/50">
          <Button variant="destructive" className="w-full min-h-[44px]">
            <Trash2 className="h-5 w-5 mr-2" />
            Excluir Local
          </Button>
        </Card>
      </div>
    </div>
  );
}
