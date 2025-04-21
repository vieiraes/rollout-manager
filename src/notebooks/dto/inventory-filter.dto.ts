import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { NotebookType, Status, Analyst } from '@prisma/client';

export class InventoryFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  placeId?: number;

  @IsOptional()
  @IsEnum(NotebookType)
  notebookType?: NotebookType;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(Analyst)
  responsibleAnalyst?: Analyst;

  @IsOptional()
  @IsString()
  zurichEmployee?: string;
}