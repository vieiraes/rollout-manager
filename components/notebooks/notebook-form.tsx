'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNotebookSchema } from '@/lib/validations/notebook.schema';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type NotebookFormData = z.infer<typeof createNotebookSchema>;

const STATUS_OPTIONS = [
  { value: 'PENDING_HOMOLOGATION', label: 'Pendente Homologação' },
  { value: 'HOMOLOGATED', label: 'Homologado' },
  { value: 'IN_ROLLOUT', label: 'Em Rollout' },
  { value: 'DELIVERED', label: 'Entregue' },
];

const TYPE_OPTIONS = [
  { value: 'NEW', label: 'Novo' },
  { value: 'REPLACEMENT', label: 'Substituição' },
];

const RAM_OPTIONS = [
  { value: 'GB8', label: '8 GB' },
  { value: 'GB16', label: '16 GB' },
  { value: 'GB32', label: '32 GB' },
];

const ANALYST_OPTIONS = [
  { value: 'BRUNO', label: 'Bruno' },
  { value: 'CASSIA', label: 'Cássia' },
  { value: 'DANIEL', label: 'Daniel' },
  { value: 'NATALIA', label: 'Natália' },
];

interface NotebookFormProps {
  initialData?: Partial<NotebookFormData>;
  notebookId?: number;
  mode?: 'create' | 'edit';
}

export function NotebookForm({ initialData, notebookId, mode = 'create' }: NotebookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NotebookFormData>({
    resolver: zodResolver(createNotebookSchema),
    defaultValues: initialData || {
      status: 'PENDING_HOMOLOGATION',
      notebookType: 'NEW',
    },
  });

  const onSubmit = async (data: NotebookFormData) => {
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' && notebookId 
        ? `/api/notebooks/${notebookId}`
        : '/api/notebooks';
      
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao salvar notebook');
      }

      const notebook = await res.json();
      router.push(`/notebooks/${notebook.id}`);
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

      {/* Service Tag - Required */}
      <div className="space-y-2">
        <Label htmlFor="serviceTag" className="text-base">
          Service Tag <span className="text-destructive">*</span>
        </Label>
        <Input
          id="serviceTag"
          {...register('serviceTag')}
          className="min-h-[44px]"
          placeholder="Ex: ABC1234"
          autoComplete="off"
        />
        {errors.serviceTag && (
          <p className="text-sm text-destructive">{errors.serviceTag.message}</p>
        )}
      </div>

      {/* Hostname */}
      <div className="space-y-2">
        <Label htmlFor="hostname" className="text-base">Hostname</Label>
        <Input
          id="hostname"
          {...register('hostname')}
          className="min-h-[44px]"
          placeholder="Ex: NB-001"
          autoComplete="off"
        />
        {errors.hostname && (
          <p className="text-sm text-destructive">{errors.hostname.message}</p>
        )}
      </div>

      {/* Brand - Required */}
      <div className="space-y-2">
        <Label htmlFor="brand" className="text-base">
          Marca <span className="text-destructive">*</span>
        </Label>
        <Input
          id="brand"
          {...register('brand')}
          className="min-h-[44px]"
          placeholder="Ex: Dell, Lenovo, HP"
          autoComplete="off"
        />
        {errors.brand && (
          <p className="text-sm text-destructive">{errors.brand.message}</p>
        )}
      </div>

      {/* Model - Required */}
      <div className="space-y-2">
        <Label htmlFor="model" className="text-base">
          Modelo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="model"
          {...register('model')}
          className="min-h-[44px]"
          placeholder="Ex: Latitude 5420"
          autoComplete="off"
        />
        {errors.model && (
          <p className="text-sm text-destructive">{errors.model.message}</p>
        )}
      </div>

      {/* Type - Required */}
      <div className="space-y-2">
        <Label htmlFor="notebookType" className="text-base">
          Tipo <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('notebookType')}
          onValueChange={(value) => setValue('notebookType', value as any)}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.notebookType && (
          <p className="text-sm text-destructive">{errors.notebookType.message}</p>
        )}
      </div>

      {/* RAM Config - Required */}
      <div className="space-y-2">
        <Label htmlFor="ramConfig" className="text-base">
          Memória RAM <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('ramConfig')}
          onValueChange={(value) => setValue('ramConfig', value as any)}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione a memória" />
          </SelectTrigger>
          <SelectContent>
            {RAM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ramConfig && (
          <p className="text-sm text-destructive">{errors.ramConfig.message}</p>
        )}
      </div>

      {/* Status - Required */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-base">
          Status <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('status')}
          onValueChange={(value) => setValue('status', value as any)}
        >
          <SelectTrigger className="min-h-[44px]">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </div>

      {/* Place ID */}
      <div className="space-y-2">
        <Label htmlFor="placeId" className="text-base">Local (ID)</Label>
        <Input
          id="placeId"
          type="number"
          {...register('placeId', { valueAsNumber: true })}
          className="min-h-[44px]"
          placeholder="Ex: 1"
        />
        {errors.placeId && (
          <p className="text-sm text-destructive">{errors.placeId.message}</p>
        )}
      </div>

      {/* Responsible Analyst */}
      <div className="space-y-2">
        <Label htmlFor="responsibleAnalyst" className="text-base">Analista Responsável</Label>
        <Select
          value={watch('responsibleAnalyst') || ''}
          onValueChange={(value) => setValue('responsibleAnalyst', value as any)}
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
        {errors.responsibleAnalyst && (
          <p className="text-sm text-destructive">{errors.responsibleAnalyst.message}</p>
        )}
      </div>

      {/* Zurich Employee */}
      <div className="space-y-2">
        <Label htmlFor="zurichEmployee" className="text-base">Colaborador</Label>
        <Input
          id="zurichEmployee"
          {...register('zurichEmployee')}
          className="min-h-[44px]"
          placeholder="Nome do colaborador"
          autoComplete="off"
        />
        {errors.zurichEmployee && (
          <p className="text-sm text-destructive">{errors.zurichEmployee.message}</p>
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
          {mode === 'edit' ? 'Salvar Alterações' : 'Criar Notebook'}
        </Button>
      </div>
    </form>
  );
}
