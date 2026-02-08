'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MapPin, Laptop } from 'lucide-react';

interface Place {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  _count?: {
    notebooks: number;
  };
}

export function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await fetch('/api/places');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum local cadastrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {places.map((place) => (
        <Link key={place.id} href={`/places/${place.id}`}>
          <Card className="p-4 hover:bg-accent transition-colors active:scale-[0.98] min-h-[120px]">
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{place.name}</h3>
                </div>
                <Badge variant={place.isActive ? 'default' : 'secondary'}>
                  {place.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {/* Description */}
              {place.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {place.description}
                </p>
              )}

              {/* Notebook Count */}
              {place._count && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Laptop className="h-4 w-4" />
                  <span>{place._count.notebooks} notebooks</span>
                </div>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
