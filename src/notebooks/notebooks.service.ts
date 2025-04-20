import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notebook } from '@prisma/client';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { InventoryFilterDto } from './dto/inventory-filter.dto';
import { NotebookQueryDto } from './dto/notebook-query.dto';

@Injectable()
export class NotebooksService {
  constructor(private prisma: PrismaService) {}

  async create(createNotebookDto: CreateNotebookDto): Promise<Notebook> {
    // Verificar se o serviceTag foi fornecido
    if (!createNotebookDto.serviceTag) {
      throw new Error('ServiceTag é obrigatório');
    }
    
    return this.prisma.notebook.create({
      data: createNotebookDto,
    });
  }

  async findAll(query: NotebookQueryDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, notebookType, locationId, search } = query;
    
    // Montar condições de busca
    const where: any = {};
    
    if (status) where.status = status;
    if (notebookType) where.notebookType = notebookType;
    if (locationId) where.locationId = locationId;
    
    // Busca textual
    if (search) {
      where.OR = [
        { serviceTag: { contains: search, mode: 'insensitive' } },
        { hostname: { contains: search, mode: 'insensitive' } },
        { zurichEmployee: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Contar total de registros com os filtros
    const total = await this.prisma.notebook.count({ where });
    
    // Calcular skip para paginação
    const skip = (page - 1) * limit;
    
    // Buscar os registros
    const data = await this.prisma.notebook.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy as string]: sortOrder // Adicionar tipo string para resolver o erro
      },
      include: {
        location: true
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

  async findOne(id: number): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id },
      include: {
        movements: true,
        oldNotebook: true,
      },
    });
    
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }
    
    return notebook;
  }

  async findByServiceTag(serviceTag: string): Promise<any> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { serviceTag },
      include: {
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            originRoom: true, // Incluir a sala de origem
            destinyRoom: true, // Incluir a sala de destino
          },
        },
        location: true, // Incluir informações da sala
        oldNotebook: true,
      },
    });
    
    if (!notebook) {
      throw new NotFoundException(`Notebook with Service Tag ${serviceTag} not found`);
    }
    
    // Informações do notebook antigo (se houver)
    const oldNotebookInfo = notebook.oldNotebook ? {
      serviceTag: notebook.oldNotebook.serviceTag,
      hostname: notebook.oldNotebook.hostname,
    } : null;
    
    // Criar o histórico de estados a partir das movimentações
    const statusHistory = notebook.movements.map(movement => ({
      date: movement.createdAt,
      previousStatus: movement.previousStatus,
      newStatus: movement.newStatus,
      analyst: movement.analyst,
      originRoom: movement.originRoom.name, // Usa o nome da sala
      destinyRoom: movement.destinyRoom.name, // Usa o nome da sala
      observation: movement.observation || '',
    }));
    
    // Remover o array de movements da resposta para evitar redundância
    const { movements, ...notebookData } = notebook;
    
    // Construir a resposta incluindo apenas os dados necessários
    const response = {
      ...notebookData,
      oldNotebookInfo,
      locationName: notebook.location?.name, // Adicionar o nome da sala
      statusHistory,
    };
    
    return response;
  }

  async findByFilters(filters: InventoryFilterDto): Promise<Notebook[]> {
    // Alterado de 'location' para 'locationId'
    const { locationId, notebookType, status, responsibleAnalyst, zurichEmployee } = filters;
    
    const where: any = {};
    
    if (locationId) where.locationId = locationId; // Usando locationId
    if (notebookType) where.notebookType = notebookType;
    if (status) where.status = status;
    if (responsibleAnalyst) where.responsibleAnalyst = responsibleAnalyst;
    if (zurichEmployee) where.zurichEmployee = { contains: zurichEmployee };
    
    return this.prisma.notebook.findMany({
      where,
      include: {
        location: true, // Incluir informações da sala
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            originRoom: true,
            destinyRoom: true
          }
        },
      },
    });
  }

  async update(id: number, updateNotebookDto: UpdateNotebookDto): Promise<Notebook> {
    try {
      // Verificar se o notebook existe
      const notebook = await this.prisma.notebook.findUnique({
        where: { id },
      });

      if (!notebook) {
        throw new NotFoundException(`Notebook with ID ${id} not found`);
      }

      // Separar o oldNotebookId do resto dos dados
      const { oldNotebookId, ...updateData } = updateNotebookDto;

      // Criar objeto de dados para atualização
      const data: any = { ...updateData };

      // Se oldNotebookId foi fornecido, adicionar no formato correto para o Prisma
      if (oldNotebookId !== undefined) {
        data.oldNotebook = { 
          connect: { id: oldNotebookId } 
        };
      }

      // Atualizar notebook
      return await this.prisma.notebook.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to update notebook with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: number): Promise<Notebook> {
    try {
      return await this.prisma.notebook.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }
  }
}
