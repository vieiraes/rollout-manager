'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createNotebookSchema, updateNotebookSchema } from '@/lib/validations/notebook.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function createNotebook(data: z.infer<typeof createNotebookSchema>) {
  try {
    const validated = createNotebookSchema.parse(data);

    const res = await fetch(`${API_URL}/api/notebooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erro ao criar notebook');
    }

    const notebook = await res.json();
    
    revalidatePath('/notebooks');
    redirect(`/notebooks/${notebook.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Dados inválidos', details: error.errors };
    }
    throw error;
  }
}

export async function updateNotebook(
  id: number,
  data: z.infer<typeof updateNotebookSchema>
) {
  try {
    const validated = updateNotebookSchema.parse(data);

    const res = await fetch(`${API_URL}/api/notebooks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erro ao atualizar notebook');
    }

    const notebook = await res.json();
    
    revalidatePath('/notebooks');
    revalidatePath(`/notebooks/${id}`);
    redirect(`/notebooks/${notebook.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Dados inválidos', details: error.errors };
    }
    throw error;
  }
}

export async function deleteNotebook(id: number) {
  try {
    const res = await fetch(`${API_URL}/api/notebooks/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erro ao excluir notebook');
    }

    revalidatePath('/notebooks');
    redirect('/notebooks');
  } catch (error) {
    throw error;
  }
}
