'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createPlaceSchema } from '@/lib/validations/place.schema';

type PlaceFormData = z.infer<typeof createPlaceSchema>;

interface PlaceFormProps {
  initialData?: Partial<PlaceFormData>;
  placeId?: number;
  mode?: 'create' | 'edit';
}

export function PlaceForm({ initialData, placeId, mode = 'create' }: PlaceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaceFormData>({
    resolver: zodResolver(createPlaceSchema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: PlaceFormData) => {
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' && placeId 
        ? `/api/places/${placeId}`
        : '/api/places';
      
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao salvar local');
      }

      const place = await res.json();
      router.push(`/places/${place.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          Nome <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          {...register('name')}
          className="min-h-[44px]"
          placeholder="Ex: Sala 101, Estoque Principal"
          autoComplete="off"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base">Descrição</Label>
        <Textarea
          id="description"
          {...register('description')}
          className="min-h-[100px]"
          placeholder="Descrição do local"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 pt-4 pb-safe bg-background border-t -mx-4 px-4">
        <Button
          type="submit"
          className="w-full min-h-[44px]"
          disabled={loading}
        >
          {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
          {mode === 'edit' ? 'Salvar Alterações' : 'Criar Local'}
        </Button>
      </div>
    </form>
  );
}
