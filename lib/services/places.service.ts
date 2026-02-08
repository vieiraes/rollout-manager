import prisma from '../prisma';
import { Place } from '@prisma/client';
import {
  CreatePlaceDto,
  UpdatePlaceDto,
} from '../validations/place.schema';
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
  handlePrismaError,
} from '../exceptions';

export class PlacesService {
  /**
   * Cria um novo local
   */
  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    try {
      return await prisma.place.create({
        data: {
          ...createPlaceDto,
          isActive: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError(`Local com nome '${createPlaceDto.name}' já existe`);
      }
      throw new InternalServerError(`Erro ao criar local: ${error.message}`);
    }
  }

  /**
   * Busca todos os locais
   */
  async findAll(): Promise<Place[]> {
    return await prisma.place.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Busca local por ID
   */
  async findOne(id: number): Promise<Place> {
    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        notebooks: true,
      },
    });

    if (!place) {
      throw new NotFoundError('Local', id);
    }

    return place;
  }

  /**
   * Atualiza um local
   */
  async update(id: number, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    // Verificar se o local existe
    const place = await prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      throw new NotFoundError('Local', id);
    }

    try {
      return await prisma.place.update({
        where: { id },
        data: updatePlaceDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError(`Local com nome '${updatePlaceDto.name}' já existe`);
      }
      throw new InternalServerError(`Erro ao atualizar local: ${error.message}`);
    }
  }

  /**
   * Remove um local
   */
  async remove(id: number): Promise<Place> {
    // Verificar se o local existe
    const place = await prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      throw new NotFoundError('Local', id);
    }

    // Verificar se existem notebooks associados a este local
    const notebookCount = await prisma.notebook.count({
      where: { placeId: id },
    });

    if (notebookCount > 0) {
      throw new ConflictError(
        `Local possui ${notebookCount} notebooks associados e não pode ser removido`
      );
    }

    // Verificar se existem movimentações associadas a este local
    const originMovementCount = await prisma.movement.count({
      where: { originPlaceId: id },
    });

    const destinyMovementCount = await prisma.movement.count({
      where: { destinyPlaceId: id },
    });

    if (originMovementCount > 0 || destinyMovementCount > 0) {
      throw new ConflictError(
        `Local possui movimentações associadas e não pode ser removido. ` +
          `Movimentações como origem: ${originMovementCount}, ` +
          `Movimentações como destino: ${destinyMovementCount}`
      );
    }

    try {
      return await prisma.place.delete({
        where: { id },
      });
    } catch (error: any) {
      throw new InternalServerError(`Erro ao remover local: ${error.message}`);
    }
  }
}

// Export singleton instance
export const placesService = new PlacesService();
