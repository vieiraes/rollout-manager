import { Analyst, NotebookType, RamConfig, Status } from '@prisma/client';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateNotebookDto {
  @IsNotEmpty()
  @IsString()
  serviceTag: string;

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
  @IsNumber()
  locationId?: number; // Alterado para locationId

  @IsOptional()
  @IsEnum(Analyst)
  responsibleAnalyst?: Analyst;

  @IsOptional()
  @IsString()
  zurichEmployee?: string;
}