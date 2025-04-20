import { Analyst, NotebookType, Status } from '@prisma/client';
import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';

export class InventoryFilterDto {
  @IsOptional()
  @IsNumber()
  locationId?: number; // Alterado para locationId
  
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