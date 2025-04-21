import { Status } from '@prisma/client';

/**
 * Interface para filtros de movimentação
 */
export interface MovementWhereInput {
  id?: number;
  notebookId?: number;
  originRoomId?: number;
  destinyRoomId?: number;
  analyst?: string;
  previousStatus?: Status;
  newStatus?: Status;
  createdAt?: Date | { gte?: Date; lte?: Date };
  notebook?: {
    serviceTag?: string;
  };
}