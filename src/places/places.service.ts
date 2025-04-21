import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Place, Prisma } from '@prisma/client';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { AppExceptionsService } from '../exceptions/app-exceptions.service';

@Injectable()
export class PlacesService {
  constructor(
    private prisma: PrismaService,
    private exceptions: AppExceptionsService
  ) {}

  /**
   * Cria um novo local
   */
  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    try {
      return await this.prisma.place.create({
        data: {
          ...createPlaceDto,
          isActive: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        this.exceptions.conflict(`Local com nome '${createPlaceDto.name}' já existe`);
      }
      this.exceptions.internal(`Erro ao criar local: ${error.message}`);
    }
  }

  /**
   * Busca todos os locais
   */
  async findAll(): Promise<Place[]> {
    return this.prisma.place.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Busca local por ID
   */
  async findOne(id: number): Promise<Place> {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        notebooks: true,
      },
    });

    if (!place) {
      this.exceptions.notFound('Local', id);
    }

    return place;
  }

  /**
   * Atualiza um local
   */
  async update(id: number, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    // Verificar se o local existe
    const place = await this.prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      this.exceptions.notFound('Local', id);
    }

    try {
      return await this.prisma.place.update({
        where: { id },
        data: updatePlaceDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        this.exceptions.conflict(`Local com nome '${updatePlaceDto.name}' já existe`);
      }
      this.exceptions.internal(`Erro ao atualizar local: ${error.message}`);
    }
  }

  /**
   * Remove um local
   */
  async remove(id: number): Promise<Place> {
    // Verificar se o local existe
    const place = await this.prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      this.exceptions.notFound('Local', id);
    }

    // Verificar se existem notebooks associados a este local
    const notebookCount = await this.prisma.notebook.count({
      where: { placeId: id },
    });

    if (notebookCount > 0) {
      this.exceptions.conflict(`Local possui ${notebookCount} notebooks associados e não pode ser removido`);
    }

    // Verificar se existem movimentações associadas a este local
    const originMovementCount = await this.prisma.movement.count({
      where: { originPlaceId: id },
    });

    const destinyMovementCount = await this.prisma.movement.count({
      where: { destinyPlaceId: id },
    });

    if (originMovementCount > 0 || destinyMovementCount > 0) {
      this.exceptions.conflict(
        `Local possui movimentações associadas e não pode ser removido. ` +
        `Movimentações como origem: ${originMovementCount}, ` +
        `Movimentações como destino: ${destinyMovementCount}`
      );
    }

    try {
      return await this.prisma.place.delete({
        where: { id },
      });
    } catch (error) {
      this.exceptions.internal(`Erro ao remover local: ${error.message}`);
    }
  }
}