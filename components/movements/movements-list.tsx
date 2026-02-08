'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/date.util';

interface Movement {
  id: number;
  notebookId: number;
  originPlaceId: number;
  destinyPlaceId: number;
  previousStatus: string;
  newStatus: string;
  analyst: string;
  observation: string | null;
  createdAt: string;
  notebook: {
    serviceTag: string;
    brand: string;
    model: string;
  };
  originPlace: {
    name: string;
  };
  destinyPlace: {
    name: string;
  };
}

export function MovementsList() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const res = await fetch('/api/movements');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMovements(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (movements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma movimentação registrada</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {movements.map((movement) => (
        <Card key={movement.id} className="p-4">
          <div className="space-y-3">
            {/* Notebook Info */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{movement.notebook.serviceTag}</h3>
                <p className="text-sm text-muted-foreground">
                  {movement.notebook.brand} {movement.notebook.model}
                </p>
              </div>
              <Badge variant="outline">{movement.analyst}</Badge>
            </div>

            {/* Movement Path */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{movement.originPlace.name}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-4 w-4" />
                <span>{movement.destinyPlace.name}</span>
              </div>
            </div>

            {/* Status Change */}
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{movement.previousStatus}</Badge>
              <ArrowRight className="h-4 w-4" />
              <Badge>{movement.newStatus}</Badge>
            </div>

            {/* Observation */}
            {movement.observation && (
              <p className="text-sm text-muted-foreground italic">
                "{movement.observation}"
              </p>
            )}

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(new Date(movement.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
