import { Analyst, Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovementByTagDto {
  @IsNotEmpty()
  @IsString()
  serviceTag: string;
  
  @IsNotEmpty()
  @IsNumber()
  originRoomId: number; // Alterado para ID
  
  @IsNotEmpty()
  @IsNumber()
  destinyRoomId: number; // Alterado para ID
  
  @IsEnum(Status)
  previousStatus: Status;
  
  @IsEnum(Status)
  newStatus: Status;
  
  @IsEnum(Analyst)
  analyst: Analyst;
  
  @IsOptional()
  @IsString()
  observation?: string;
}