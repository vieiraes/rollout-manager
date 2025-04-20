import { Status, NotebookType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class NotebookQueryDto {
  // Paginação com valores padrão
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1; // Valor padrão definido

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10; // Valor padrão definido

  // Ordenação com valores padrão
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt'; // Valor padrão definido

  @IsOptional()
  @IsString()
  sortOrder: 'asc' | 'desc' = 'desc'; // Valor padrão definido

  // Filtros
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(NotebookType)
  notebookType?: NotebookType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  locationId?: number;

  // Busca
  @IsOptional()
  @IsString()
  search?: string;
}