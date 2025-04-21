import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notebook, Prisma } from '@prisma/client';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { InventoryFilterDto } from './dto/inventory-filter.dto';
import { NotebookQueryDto } from './dto/notebook-query.dto';
import { AppExceptionsService } from '../exceptions/app-exceptions.service';
import { PaginatedResponse } from '../interfaces/query.interfaces';

@Injectable()
export class NotebooksService {
  constructor(
    private prisma: PrismaService,
    private exceptions: AppExceptionsService
  ) {}

  /**
   * Cria um novo notebook
   */
  async create(createNotebookDto: CreateNotebookDto): Promise<Notebook> {
    if (!createNotebookDto.serviceTag) {
      this.exceptions.badRequest('ServiceTag é obrigatório');
    }
    
    try {
      // Verificar se o local existe antes de criar o notebook
      if (createNotebookDto.placeId) {
        const place = await this.prisma.place.findUnique({
          where: { id: createNotebookDto.placeId }
        });
        
        if (!place) {
          this.exceptions.notFound('Local', createNotebookDto.placeId);
        }
      }
      
      return this.prisma.notebook.create({
        data: createNotebookDto,
      });
    } catch (error) {
      if (error.code === 'P2002') { // Erro de unique constraint
        this.exceptions.conflict(`Notebook com service tag ${createNotebookDto.serviceTag} já existe`);
      } else if (error.code === 'P2003') { // Erro de violação de chave estrangeira
        this.exceptions.badRequest(`Referência inválida: O campo ${error.meta.field_name} referencia um registro que não existe`);
      }
      this.exceptions.internal(`Erro ao criar notebook: ${error.message}`);
    }
  }

  /**
   * Busca notebooks com paginação e filtros
   */
  async findAll(query: NotebookQueryDto): Promise<PaginatedResponse<Notebook>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, notebookType, placeId, search } = query;
    
    // Montar condições de busca
    const where: Prisma.NotebookWhereInput = {};
    
    if (status) where.status = status;
    if (notebookType) where.notebookType = notebookType;
    if (placeId) where.placeId = placeId;
    
    // Busca textual
    if (search) {
      where.OR = [
        { serviceTag: { contains: search } },
        { hostname: { contains: search } },
        { zurichEmployee: { contains: search } }
      ];
    }
    
    // Contar total de registros com os filtros
    const total = await this.prisma.notebook.count({ where });
    
    // Calcular skip para paginação
    const skip = (page - 1) * limit;
    
    // Definir ordenação
    const orderBy: Prisma.NotebookOrderByWithRelationInput = { [sortBy]: sortOrder };
    
    // Buscar os registros
    const data = await this.prisma.notebook.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        place: true
      }
    });
    
    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Busca notebook por ID
   */
  async findOne(id: number): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id },
      include: {
        place: true,
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            originPlace: true,
            destinyPlace: true
          }
        },
      },
    });

    if (!notebook) {
      this.exceptions.notFound('Notebook', id);
    }

    return notebook;
  }

  /**
   * Busca notebook por service tag
   */
  async findByServiceTag(serviceTag: string): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { serviceTag },
      include: {
        place: true,
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            originPlace: true,
            destinyPlace: true
          }
        },
      },
    });

    if (!notebook) {
      this.exceptions.notFound('Notebook', serviceTag);
    }

    return notebook;
  }

  /**
   * Busca notebooks por filtros de inventário
   */
  async findByFilters(filters: InventoryFilterDto): Promise<Notebook[]> {
    const { placeId, notebookType, status, responsibleAnalyst, zurichEmployee } = filters;
    
    const where: Prisma.NotebookWhereInput = {};
    
    if (placeId) where.placeId = placeId;
    if (notebookType) where.notebookType = notebookType;
    if (status) where.status = status;
    if (responsibleAnalyst) where.responsibleAnalyst = responsibleAnalyst;
    if (zurichEmployee) where.zurichEmployee = { contains: zurichEmployee };
    
    return this.prisma.notebook.findMany({
      where,
      include: {
        place: true,
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            originPlace: true,
            destinyPlace: true
          }
        },
      },
    });
  }

  /**
   * Atualiza um notebook
   */
  async update(id: number, updateNotebookDto: UpdateNotebookDto): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id },
    });

    if (!notebook) {
      this.exceptions.notFound('Notebook', id);
    }

    // Verificar se o local existe, se foi fornecido
    if (updateNotebookDto.placeId) {
      const place = await this.prisma.place.findUnique({
        where: { id: updateNotebookDto.placeId }
      });
      
      if (!place) {
        this.exceptions.notFound('Local', updateNotebookDto.placeId);
      }
    }

    const { oldNotebookId, ...updateData } = updateNotebookDto;

    const data: any = { ...updateData };

    if (oldNotebookId !== undefined) {
      data.oldNotebook = { 
        connect: { id: oldNotebookId } 
      };
    }

    try {
      return await this.prisma.notebook.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.exceptions.internal(`Erro ao atualizar notebook: ${error.message}`);
    }
  }

  /**
   * Remove um notebook
   */
  async remove(id: number): Promise<Notebook> {
    try {
      return await this.prisma.notebook.delete({
        where: { id },
      });
    } catch (error) {
      this.exceptions.notFound('Notebook', id);
    }
  }
}
