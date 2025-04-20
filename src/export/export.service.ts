import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportNotebooksToExcel(): Promise<Buffer> {
    const notebooks = await this.prisma.notebook.findMany({
      include: {
        movements: true,
        location: true, // Incluir a relação com Room
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Notebooks');

    // Define headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Service Tag', key: 'serviceTag', width: 20 },
      { header: 'Hostname', key: 'hostname', width: 20 },
      { header: 'Brand', key: 'brand', width: 15 },
      { header: 'Model', key: 'model', width: 15 },
      { header: 'Type', key: 'notebookType', width: 15 },
      { header: 'RAM', key: 'ramConfig', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Analyst', key: 'responsibleAnalyst', width: 15 },
      { header: 'Employee', key: 'zurichEmployee', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];

    // Add data
    notebooks.forEach((notebook) => {
      worksheet.addRow({
        id: notebook.id,
        serviceTag: notebook.serviceTag,
        hostname: notebook.hostname || '',
        brand: notebook.brand,
        model: notebook.model,
        notebookType: notebook.notebookType,
        ramConfig: notebook.ramConfig,
        status: notebook.status,
        location: notebook.location?.name || '', // Usar o nome da sala
        responsibleAnalyst: notebook.responsibleAnalyst,
        zurichEmployee: notebook.zurichEmployee,
        createdAt: notebook.createdAt.toLocaleDateString('en-US'),
        updatedAt: notebook.updatedAt.toLocaleDateString('en-US'),
      });
    });

    // Create another sheet for movements
    const movementsSheet = workbook.addWorksheet('Movements');
    
    movementsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Notebook ID', key: 'notebookId', width: 15 },
      { header: 'Service Tag', key: 'serviceTag', width: 20 },
      { header: 'Origin Room', key: 'originRoom', width: 20 },
      { header: 'Destiny Room', key: 'destinyRoom', width: 20 },
      { header: 'Previous Status', key: 'previousStatus', width: 20 },
      { header: 'New Status', key: 'newStatus', width: 20 },
      { header: 'Analyst', key: 'analyst', width: 15 },
      { header: 'Observation', key: 'observation', width: 40 },
      { header: 'Date', key: 'createdAt', width: 20 },
    ];

    // Get all movements with related data
    const movements = await this.prisma.movement.findMany({
      include: {
        notebook: true,
        originRoom: true, // Incluir a sala de origem
        destinyRoom: true, // Incluir a sala de destino
      },
    });

    // Add movement data
    movements.forEach((mov) => {
      movementsSheet.addRow({
        id: mov.id,
        notebookId: mov.notebookId,
        serviceTag: mov.notebook.serviceTag,
        originRoom: mov.originRoom.name, // Usar o nome da sala
        destinyRoom: mov.destinyRoom.name, // Usar o nome da sala
        previousStatus: mov.previousStatus,
        newStatus: mov.newStatus,
        analyst: mov.analyst,
        observation: mov.observation,
        createdAt: mov.createdAt.toLocaleDateString('en-US'),
      });
    });

    // Format headers
    worksheet.getRow(1).font = { bold: true };
    movementsSheet.getRow(1).font = { bold: true };

    // Fix typing issue
    const buffer = await workbook.xlsx.writeBuffer() as unknown as Buffer;
    return buffer;
  }
}