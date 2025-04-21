/**
 * Interface para filtros de busca de salas
 */
export interface RoomWhereInput {
  id?: number;
  name?: string | { contains: string; mode: 'insensitive' };
  description?: string | { contains: string; mode: 'insensitive' };
  isActive?: boolean;
}