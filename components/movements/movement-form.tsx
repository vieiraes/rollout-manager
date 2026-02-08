'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createMovementSchema } from '@/lib/validations/movement.schema';

type MovementFormData = z.infer<typeof createMovementSchema>;

const STATUS_OPTIONS = [
  { value: 'PENDING_HOMOLOGATION', label: 'Pendente Homologação' },
  { value: 'HOMOLOGATED', label: 'Homologado' },
  { value: 'IN_ROLLOUT', label: 'Em Rollout' },
  { value: 'DELIVERED', label: 'Entregue' },
];

const ANALYST_OPTIONS = [
  { value: 'BRUNO', label: 'Bruno' },
  { value: 'CASSIA', label: 'Cássia' },
  { value: 'DANIEL', label: 'Daniel' },
  { value: 'NATALIA', label: 'Natália' },
];

interface Notebook {
  id: number;
  serviceTag: string;
}

interface Place {
  id: number;
  name: string;
}

export function MovementForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MovementFormData>({
    resolver: zodResolver(createMovementSchema),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notebooksRes, placesRes] = await Promise.all([
        fetch('/api/notebooks?limit=100'),
        fetch('/api/places'),
      ]);

      if (notebooksRes.ok) {
        const data = await notebooksRes.json();
        setNotebooks(data.data || []);
      }

      if (placesRes.ok) {
        const data = await placesRes.json();
        setPlaces(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const onSubmit = async (data: MovementFormData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao criar movimentação');
      }

      router.push('/movements');
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

      {/* Notebook */}
      <div className="space-y-2">
        <Label htmlFor="notebookId" className="text-base">
          Notebook <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('notebookId')?.toString()}
          onValueChange={(value) => setValue('notebookId', parseInt(value))}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o notebook" />
          </SelectTrigger>
          <SelectContent>
            {notebooks.map((nb) => (
              <SelectItem key={nb.id} value={nb.id.toString()}>
                {nb.serviceTag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.notebookId && (
          <p className="text-sm text-destructive">{errors.notebookId.message}</p>
        )}
      </div>

      {/* Origin Place */}
      <div className="space-y-2">
        <Label htmlFor="originPlaceId" className="text-base">
          Local de Origem <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('originPlaceId')?.toString()}
          onValueChange={(value) => setValue('originPlaceId', parseInt(value))}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o local de origem" />
          </SelectTrigger>
          <SelectContent>
            {places.map((place) => (
              <SelectItem key={place.id} value={place.id.toString()}>
                {place.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.originPlaceId && (
          <p className="text-sm text-destructive">{errors.originPlaceId.message}</p>
        )}
      </div>

      {/* Destiny Place */}
      <div className="space-y-2">
        <Label htmlFor="destinyPlaceId" className="text-base">
          Local de Destino <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('destinyPlaceId')?.toString()}
          onValueChange={(value) => setValue('destinyPlaceId', parseInt(value))}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o local de destino" />
          </SelectTrigger>
          <SelectContent>
            {places.map((place) => (
              <SelectItem key={place.id} value={place.id.toString()}>
                {place.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.destinyPlaceId && (
          <p className="text-sm text-destructive">{errors.destinyPlaceId.message}</p>
        )}
      </div>

      {/* Previous Status */}
      <div className="space-y-2">
        <Label htmlFor="previousStatus" className="text-base">
          Status Anterior <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('previousStatus')}
          onValueChange={(value) => setValue('previousStatus', value as any)}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o status anterior" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.previousStatus && (
          <p className="text-sm text-destructive">{errors.previousStatus.message}</p>
        )}
      </div>

      {/* New Status */}
      <div className="space-y-2">
        <Label htmlFor="newStatus" className="text-base">
          Novo Status <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('newStatus')}
          onValueChange={(value) => setValue('newStatus', value as any)}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o novo status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.newStatus && (
          <p className="text-sm text-destructive">{errors.newStatus.message}</p>
        )}
      </div>

      {/* Analyst */}
      <div className="space-y-2">
        <Label htmlFor="analyst" className="text-base">
          Analista <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('analyst')}
          onValueChange={(value) => setValue('analyst', value as any)}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o analista" />
          </SelectTrigger>
          <SelectContent>
            {ANALYST_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.analyst && (
          <p className="text-sm text-destructive">{errors.analyst.message}</p>
        )}
      </div>

      {/* Observation */}
      <div className="space-y-2">
        <Label htmlFor="observation" className="text-base">Observação</Label>
        <Textarea
          id="observation"
          {...register('observation')}
          className="min-h-[100px]"
          placeholder="Observações sobre a movimentação"
        />
        {errors.observation && (
          <p className="text-sm text-destructive">{errors.observation.message}</p>
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
          Criar Movimentação
        </Button>
      </div>
    </form>
  );
}
