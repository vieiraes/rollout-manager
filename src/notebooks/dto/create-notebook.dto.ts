import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotebookType, RamConfig, Status, Analyst } from '@prisma/client';

export class CreateNotebookDto {
  @IsNotEmpty({ message: 'Service Tag é obrigatório' })
  @IsString()
  serviceTag: string;

  @IsOptional()
  @IsString()
  hostname?: string;

  @IsOptional()
  @IsString()
  brand?: string = 'Dell';

  @IsOptional()
  @IsString()
  model?: string = '5450';

  @IsOptional()
  @IsEnum(NotebookType)
  notebookType?: NotebookType = NotebookType.NEW;

  @IsOptional()
  @IsEnum(RamConfig)
  ramConfig?: RamConfig = RamConfig.GB16;

  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.PENDING_HOMOLOGATION;

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