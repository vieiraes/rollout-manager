import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { Notebook } from '@prisma/client';
import { InventoryFilterDto } from './dto/inventory-filter.dto'; // Adicione esta importação
import { NotebookQueryDto } from './dto/notebook-query.dto'; // Adicione esta importação

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  create(@Body() createNotebookDto: CreateNotebookDto): Promise<Notebook> {
    console.log('Dados recebidos:', createNotebookDto);
    return this.notebooksService.create(createNotebookDto);
  }

  @Get()
  findAll(@Query() query: NotebookQueryDto): Promise<{
    data: any[]; // Alterado para tipo mais genérico
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.notebooksService.findAll(query);
  }

  @Get('service-tag/:serviceTag')
  findByServiceTag(@Param('serviceTag') serviceTag: string): Promise<Notebook> {
    return this.notebooksService.findByServiceTag(serviceTag);
  }

  @Get('inventory')
  async getInventory(@Query() filters: InventoryFilterDto): Promise<Notebook[]> {
    return this.notebooksService.findByFilters(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notebook> {
    return this.notebooksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotebookDto: UpdateNotebookDto): Promise<Notebook> {
    return this.notebooksService.update(+id, updateNotebookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Notebook> {
    return this.notebooksService.remove(+id);
  }
}
