import { NotebookType, Status, RamConfig, Prisma } from '@prisma/client';

/**
 * Interface para os filtros de consulta de notebooks
 * Estende a interface do Prisma para compatibilidade
 */
export interface NotebookWhereInput extends Prisma.NotebookWhereInput {}

/**
 * Interface para opções de ordenação
 */
export interface OrderByInput {
  [key: string]: 'asc' | 'desc';
}

/**
 * Interface para opções de paginação
 */
export interface PaginationOptions {
  skip: number;
  take: number;
}

/**
 * Interface para resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface para filtros genéricos
 */
export interface FilterOptions {
  [key: string]: any;
}