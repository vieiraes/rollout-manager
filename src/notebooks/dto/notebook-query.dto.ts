import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { NotebookType, Status } from '@prisma/client';

export class NotebookQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(NotebookType)
  notebookType?: NotebookType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  placeId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}