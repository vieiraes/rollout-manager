import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { CreateMovementByTagDto } from './dto/create-movement-by-tag.dto';
import { Movement } from '@prisma/client';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createMovementDto: CreateMovementDto): Promise<Movement> {
    return this.movementsService.create(createMovementDto);
  }

  @Post('by-service-tag')
  createByServiceTag(@Body() createMovementByTagDto: CreateMovementByTagDto): Promise<Movement> {
    return this.movementsService.createByServiceTag(createMovementByTagDto);
  }

  @Get()
  findAll(): Promise<Movement[]> {
    return this.movementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Movement> {
    return this.movementsService.findOne(+id);
  }

  @Get('notebook/:id')
  findByNotebookId(@Param('id') id: string): Promise<Movement[]> {
    return this.movementsService.findByNotebookId(+id);
  }

  @Get('service-tag/:serviceTag')
  findByServiceTag(@Param('serviceTag') serviceTag: string): Promise<Movement[]> {
    return this.movementsService.findByServiceTag(serviceTag);
  }
}
