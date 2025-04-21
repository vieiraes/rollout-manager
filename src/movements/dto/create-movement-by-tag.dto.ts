import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Analyst, Status } from '@prisma/client';

export class CreateMovementByTagDto {
  @IsNotEmpty()
  @IsString()
  serviceTag: string;

  @IsNotEmpty()
  @IsInt()
  originPlaceId: number;

  @IsNotEmpty()
  @IsInt()
  destinyPlaceId: number;

  @IsNotEmpty()
  @IsEnum(Status)
  previousStatus: Status;

  @IsNotEmpty()
  @IsEnum(Status)
  newStatus: Status;

  @IsNotEmpty()
  @IsEnum(Analyst)
  analyst: Analyst;

  @IsOptional()
  @IsString()
  observation?: string;
}