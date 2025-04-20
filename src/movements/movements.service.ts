import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Movement } from '@prisma/client';
import { CreateMovementDto } from './dto/create-movement.dto';
import { CreateMovementByTagDto } from './dto/create-movement-by-tag.dto';

@Injectable()
export class MovementsService {
  constructor(private prisma: PrismaService) {}

  async create(createMovementDto: CreateMovementDto): Promise<Movement> {
    // Check if notebook exists
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: createMovementDto.notebookId },
    });

    if (!notebook) {
      throw new NotFoundException(
        `Notebook with ID ${createMovementDto.notebookId} not found`,
      );
    }

    // Create the movement
    const movement = await this.prisma.movement.create({
      data: createMovementDto,
    });

    // Update notebook status and location
    await this.prisma.notebook.update({
      where: { id: notebook.id },
      data: {
        status: createMovementDto.newStatus,
        locationId: createMovementDto.destinyRoomId, // Usar o ID da sala
      },
    });

    return movement;
  }

  async createByServiceTag(createMovementByTagDto: CreateMovementByTagDto): Promise<Movement> {
    const { serviceTag, originRoomId, destinyRoomId, previousStatus, newStatus, analyst, observation } = createMovementByTagDto;
    
    const notebook = await this.prisma.notebook.findUnique({
      where: { serviceTag },
    });
    
    if (!notebook) {
      throw new NotFoundException(`Notebook with Service Tag ${serviceTag} not found`);
    }
    
    // Criar movimento
    const movement = await this.prisma.movement.create({
      data: {
        notebookId: notebook.id,
        originRoomId,
        destinyRoomId,
        previousStatus,
        newStatus,
        analyst,
        observation,
      },
    });
    
    // Atualizar notebook
    await this.prisma.notebook.update({
      where: { id: notebook.id },
      data: {
        status: newStatus,
        locationId: destinyRoomId,
      },
    });
    
    return movement;
  }

  async findAll(): Promise<Movement[]> {
    return this.prisma.movement.findMany({
      include: {
        notebook: true,
      },
    });
  }

  async findByNotebook(notebookId: number): Promise<Movement[]> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: notebookId },
    });

    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${notebookId} not found`);
    }

    return this.prisma.movement.findMany({
      where: { notebookId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByServiceTag(serviceTag: string): Promise<Movement[]> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { serviceTag },
    });

    if (!notebook) {
      throw new NotFoundException(`Notebook with Service Tag ${serviceTag} not found`);
    }

    return this.prisma.movement.findMany({
      where: { notebookId: notebook.id },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        notebook: true,
        originRoom: true,  // Incluir informações da sala de origem
        destinyRoom: true, // Incluir informações da sala de destino
      },
    });
  }

  async findOne(id: number): Promise<Movement> {
    const movement = await this.prisma.movement.findUnique({
      where: { id },
      include: {
        notebook: true,
      },
    });

    if (!movement) {
      throw new NotFoundException(`Movement with ID ${id} not found`);
    }

    return movement;
  }
}
