import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/date.util';

interface NotebookCardProps {
  notebook: {
    id: number;
    serviceTag: string;
    hostname: string | null;
    brand: string;
    model: string;
    notebookType: string;
    ramConfig: string;
    status: string;
    place: {
      id: number;
      name: string;
    } | null;
    updatedAt: string;
  };
}

export function NotebookCard({ notebook }: NotebookCardProps) {
  return (
    <Link href={`/notebooks/${notebook.id}`} className="block">
      <Card className="p-4 hover:bg-accent transition-colors active:scale-[0.98] min-h-[96px]">
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{notebook.serviceTag}</h3>
              {notebook.hostname && (
                <p className="text-sm text-muted-foreground truncate">{notebook.hostname}</p>
              )}
            </div>
            <Badge variant={
              notebook.status === 'DELIVERED' ? 'default' :
              notebook.status === 'HOMOLOGATED' ? 'secondary' :
              'outline'
            } className="shrink-0">
              {notebook.status}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{notebook.brand} {notebook.model}</span>
            <span>•</span>
            <span>{notebook.ramConfig}</span>
          </div>

          {/* Location */}
          {notebook.place && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{notebook.place.name}</span>
            </div>
          )}

          {/* Updated timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Atualizado {formatDate(new Date(notebook.updatedAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
