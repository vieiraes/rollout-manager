import { z } from 'zod';

// Create Place Schema
export const createPlaceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreatePlaceDto = z.infer<typeof createPlaceSchema>;

// Update Place Schema
export const updatePlaceSchema = createPlaceSchema.partial();

export type UpdatePlaceDto = z.infer<typeof updatePlaceSchema>;
