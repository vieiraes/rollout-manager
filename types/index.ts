import { Notebook, Movement, Place, Status, Analyst, NotebookType, RamConfig } from '@prisma/client';

export type {
  Notebook,
  Movement,
  Place,
  Status,
  Analyst,
  NotebookType,
  RamConfig,
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type NotebookWithRelations = Notebook & {
  place: Place;
  movements?: Movement[];
};

export type MovementWithRelations = Movement & {
  notebook: Notebook;
  originPlace: Place;
  destinyPlace: Place;
};
