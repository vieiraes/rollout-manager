import { z } from 'zod';

// Enums
export const StatusEnum = z.enum([
  'PENDING_HOMOLOGATION',
  'HOMOLOGATED',
  'IN_HOMOLOGATION',
  'IN_ROLLOUT',
  'DELIVERED',
  'RETURNED',
  'COMPLETED',
]);

export const AnalystEnum = z.enum(['OSVALDO', 'DANIEL', 'THIAGO', 'BRUNO']);

export const NotebookTypeEnum = z.enum(['NEW', 'OLD']);

export const RamConfigEnum = z.enum(['GB16', 'GB32', 'OTHER']);

// Create Notebook Schema
export const createNotebookSchema = z.object({
  serviceTag: z.string().min(1, 'Service tag é obrigatório'),
  hostname: z.string().optional(),
  brand: z.string().default('Dell'),
  model: z.string().default('5450'),
  notebookType: NotebookTypeEnum.default('NEW'),
  ramConfig: RamConfigEnum.default('GB16'),
  status: StatusEnum.default('PENDING_HOMOLOGATION'),
  placeId: z.number().int().positive().default(1),
  responsibleAnalyst: AnalystEnum.optional(),
  zurichEmployee: z.string().optional(),
  oldNotebookId: z.number().int().positive().optional(),
});

export type CreateNotebookDto = z.infer<typeof createNotebookSchema>;

// Update Notebook Schema
export const updateNotebookSchema = createNotebookSchema.partial();

export type UpdateNotebookDto = z.infer<typeof updateNotebookSchema>;

// Notebook Query Schema (for list/filter)
export const notebookQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: StatusEnum.optional(),
  notebookType: NotebookTypeEnum.optional(),
  placeId: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
});

export type NotebookQueryDto = z.infer<typeof notebookQuerySchema>;

// Inventory Filter Schema
export const inventoryFilterSchema = z.object({
  placeId: z.coerce.number().int().positive().optional(),
  notebookType: NotebookTypeEnum.optional(),
  status: StatusEnum.optional(),
  responsibleAnalyst: AnalystEnum.optional(),
  zurichEmployee: z.string().optional(),
});

export type InventoryFilterDto = z.infer<typeof inventoryFilterSchema>;
