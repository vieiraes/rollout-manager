import prisma from '../prisma';
import { Movement } from '@prisma/client';
import {
  CreateMovementDto,
  CreateMovementByTagDto,
} from '../validations/movement.schema';
import {
  NotFoundError,
  InternalServerError,
  handlePrismaError,
} from '../exceptions';

export class MovementsService {
  /**
   * Cria uma nova movimentação a partir do ID do notebook
   */
  async create(createMovementDto: CreateMovementDto): Promise<Movement> {
    try {
      // Verificar se o notebook existe
      const notebook = await prisma.notebook.findUnique({
        where: { id: createMovementDto.notebookId },
      });

      if (!notebook) {
        throw new NotFoundError('Notebook', createMovementDto.notebookId);
      }

      // Verificar se os locais existem
      const originPlace = await prisma.place.findUnique({
        where: { id: createMovementDto.originPlaceId },
      });

      if (!originPlace) {
        throw new NotFoundError('Local de origem', createMovementDto.originPlaceId);
      }

      const destinyPlace = await prisma.place.findUnique({
        where: { id: createMovementDto.destinyPlaceId },
      });

      if (!destinyPlace) {
        throw new NotFoundError('Local de destino', createMovementDto.destinyPlaceId);
      }

      // Criar movimento
      const movement = await prisma.movement.create({
        data: createMovementDto,
        include: {
          notebook: true,
          originPlace: true,
          destinyPlace: true,
        },
      });

      // Atualizar notebook
      await prisma.notebook.update({
        where: { id: createMovementDto.notebookId },
        data: {
          status: createMovementDto.newStatus,
          placeId: createMovementDto.destinyPlaceId,
        },
      });

      return movement;
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError(`Erro ao criar movimentação: ${error.message}`);
    }
  }

  /**
   * Cria uma nova movimentação a partir da service tag do notebook
   */
  async createByServiceTag(
    createMovementByTagDto: CreateMovementByTagDto
  ): Promise<Movement> {
    const {
      serviceTag,
      originPlaceId,
      destinyPlaceId,
      previousStatus,
      newStatus,
      analyst,
      observation,
    } = createMovementByTagDto;

    // Verificar se o notebook existe
    const notebook = await prisma.notebook.findUnique({
      where: { serviceTag },
    });

    if (!notebook) {
      throw new NotFoundError('Notebook', serviceTag);
    }

    // Verificar se os locais existem
    const originPlace = await prisma.place.findUnique({
      where: { id: originPlaceId },
    });

    if (!originPlace) {
      throw new NotFoundError('Local de origem', originPlaceId);
    }

    const destinyPlace = await prisma.place.findUnique({
      where: { id: destinyPlaceId },
    });

    if (!destinyPlace) {
      throw new NotFoundError('Local de destino', destinyPlaceId);
    }

    try {
      // Criar movimento
      const movement = await prisma.movement.create({
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
      await prisma.notebook.update({
        where: { id: notebook.id },
        data: {
          status: newStatus,
          placeId: destinyPlaceId,
        },
      });

      return movement;
    } catch (error: any) {
      throw new InternalServerError(`Erro ao criar movimentação: ${error.message}`);
    }
  }

  /**
   * Busca todas as movimentações
   */
  async findAll(): Promise<Movement[]> {
    return await prisma.movement.findMany({
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
    const movement = await prisma.movement.findUnique({
      where: { id },
      include: {
        notebook: true,
        originPlace: true,
        destinyPlace: true,
      },
    });

    if (!movement) {
      throw new NotFoundError('Movement', id);
    }

    return movement;
  }

  /**
   * Busca movimentações de um notebook pelo ID
   */
  async findByNotebookId(notebookId: number): Promise<Movement[]> {
    const notebook = await prisma.notebook.findUnique({
      where: { id: notebookId },
    });

    if (!notebook) {
      throw new NotFoundError('Notebook', notebookId);
    }

    return await prisma.movement.findMany({
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
    const notebook = await prisma.notebook.findUnique({
      where: { serviceTag },
    });

    if (!notebook) {
      throw new NotFoundError('Notebook', serviceTag);
    }

    return await prisma.movement.findMany({
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

// Export singleton instance
export const movementsService = new MovementsService();
