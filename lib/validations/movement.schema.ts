import { z } from 'zod';
import { StatusEnum, AnalystEnum } from './notebook.schema';

// Create Movement Schema
export const createMovementSchema = z.object({
  notebookId: z.number().int().positive(),
  originPlaceId: z.number().int().positive(),
  destinyPlaceId: z.number().int().positive(),
  previousStatus: StatusEnum,
  newStatus: StatusEnum,
  analyst: AnalystEnum,
  observation: z.string().optional(),
});

export type CreateMovementDto = z.infer<typeof createMovementSchema>;

// Create Movement by Service Tag Schema
export const createMovementByTagSchema = z.object({
  serviceTag: z.string().min(1, 'Service tag é obrigatório'),
  originPlaceId: z.number().int().positive(),
  destinyPlaceId: z.number().int().positive(),
  previousStatus: StatusEnum,
  newStatus: StatusEnum,
  analyst: AnalystEnum,
  observation: z.string().optional(),
});

export type CreateMovementByTagDto = z.infer<typeof createMovementByTagSchema>;
