import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Movement, Status } from '@prisma/client';
import { CreateMovementDto } from './dto/create-movement.dto';
import { CreateMovementByTagDto } from './dto/create-movement-by-tag.dto';
import { AppExceptionsService } from '../exceptions/app-exceptions.service';

@Injectable()
export class MovementsService {
  constructor(
    private prisma: PrismaService,
    private exceptions: AppExceptionsService
  ) {}

  /**
   * Cria uma nova movimentação a partir do ID do notebook
   */
  async create(createMovementDto: CreateMovementDto): Promise<Movement> {
    try {
      // Verificar se o notebook existe
      const notebook = await this.prisma.notebook.findUnique({
        where: { id: createMovementDto.notebookId },
      });

      if (!notebook) {
        this.exceptions.notFound('Notebook', createMovementDto.notebookId);
      }

      // Verificar se os locais existem
      const originPlace = await this.prisma.place.findUnique({
        where: { id: createMovementDto.originPlaceId },
      });

      if (!originPlace) {
        this.exceptions.notFound('Local de origem', createMovementDto.originPlaceId);
      }

      const destinyPlace = await this.prisma.place.findUnique({
        where: { id: createMovementDto.destinyPlaceId },
      });

      if (!destinyPlace) {
        this.exceptions.notFound('Local de destino', createMovementDto.destinyPlaceId);
      }

      // Criar movimento
      const movement = await this.prisma.movement.create({
        data: createMovementDto,
        include: {
          notebook: true,
          originPlace: true,
          destinyPlace: true,
        },
      });

      // Atualizar notebook
      await this.prisma.notebook.update({
        where: { id: createMovementDto.notebookId },
        data: {
          status: createMovementDto.newStatus,
          placeId: createMovementDto.destinyPlaceId,
        },
      });

      return movement;
    } catch (error) {
      if (error.name === 'NotFoundError') throw error;
      this.exceptions.internal(`Erro ao criar movimentação: ${error.message}`);
    }
  }

  /**
   * Cria uma nova movimentação a partir da service tag do notebook
   */
  async createByServiceTag(createMovementByTagDto: CreateMovementByTagDto): Promise<Movement> {
    const { serviceTag, originPlaceId, destinyPlaceId, previousStatus, newStatus, analyst, observation } = createMovementByTagDto;
    
    // Verificar se o notebook existe
    const notebook = await this.prisma.notebook.findUnique({
      where: { serviceTag },
    });
    
    if (!notebook) {
      this.exceptions.notFound('Notebook', serviceTag);
    }
    
    // Verificar se os locais existem
    const originPlace = await this.prisma.place.findUnique({
      where: { id: originPlaceId },
    });

    if (!originPlace) {
      this.exceptions.notFound('Local de origem', originPlaceId);
    }

    const destinyPlace = await this.prisma.place.findUnique({
      where: { id: destinyPlaceId },
    });

    if (!destinyPlace) {
      this.exceptions.notFound('Local de destino', destinyPlaceId);
    }
    
    try {
      // Criar movimento
      const movement = await this.prisma.movement.create({
        data: {
          notebookId: notebook.id,
          originPlaceId,
          destinyPlaceId,
          previousStatus,
          newStatus,
          analyst,
          observation,
        },
        include: {
          notebook: true,
          originPlace: true,
          destinyPlace: true,
        },
      });
      
      // Atualizar notebook
      await this.prisma.notebook.update({
        where: { id: notebook.id },
        data: {
          status: newStatus,
          placeId: destinyPlaceId,
        },
      });
      
      return movement;
    } catch (error) {
      this.exceptions.internal(`Erro ao criar movimentação: ${error.message}`);
    }
  }

  /**
   * Busca todas as movimentações
   */
  async findAll(): Promise<Movement[]> {
    return this.prisma.movement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        notebook: true,
        originPlace: true,
        destinyPlace: true,
      },
    });
  }

  /**
   * Busca uma movimentação por ID
   */
  async findOne(id: number): Promise<Movement> {
    const movement = await this.prisma.movement.findUnique({
      where: { id },
      include: {
        notebook: true,
        originPlace: true,
        destinyPlace: true,
      },
    });

    if (!movement) {
      this.exceptions.notFound('Movement', id);
    }

    return movement;
  }

  /**
   * Busca movimentações de um notebook pelo ID
   */
  async findByNotebookId(notebookId: number): Promise<Movement[]> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: notebookId },
    });

    if (!notebook) {
      this.exceptions.notFound('Notebook', notebookId);
    }

    return this.prisma.movement.findMany({
      where: { notebookId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        notebook: true,
        originPlace: true,
        destinyPlace: true,
      },
    });
  }

  /**
   * Busca movimentações de um notebook pela service tag
   */
  async findByServiceTag(serviceTag: string): Promise<Movement[]> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { serviceTag },
    });

    if (!notebook) {
      this.exceptions.notFound('Notebook', serviceTag);
    }

    return this.prisma.movement.findMany({
      where: { notebookId: notebook.id },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        notebook: true,
        originPlace: true,
        destinyPlace: true,
      },
    });
  }
}
