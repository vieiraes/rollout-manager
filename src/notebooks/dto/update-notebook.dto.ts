import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { NotebookType, RamConfig, Status, Analyst } from '@prisma/client';

export class UpdateNotebookDto {
  @IsOptional()
  @IsString()
  serviceTag?: string;

  @IsOptional()
  @IsString()
  hostname?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(NotebookType)
  notebookType?: NotebookType;

  @IsOptional()
  @IsEnum(RamConfig)
  ramConfig?: RamConfig;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsInt()
  placeId?: number;

  @IsOptional()
  @IsInt()
  oldNotebookId?: number;

  @IsOptional()
  @IsEnum(Analyst)
  responsibleAnalyst?: Analyst;

  @IsOptional()
  @IsString()
  zurichEmployee?: string;
}