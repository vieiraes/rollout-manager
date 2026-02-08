import prisma from '@/lib/prisma';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { formatDate, fileTimestamp } from '@/lib/utils/date.util';
import { InternalServerError } from '@/lib/exceptions';

export interface ExportResult {
  filePath: string;
  fileName: string;
}

export class ExportService {
  /**
   * Exporta dados de notebooks para Excel
   */
  async exportNotebooksToExcel(): Promise<ExportResult> {
    try {
      // Criar diretório para exportações se não existir
      const exportDir = path.join(process.cwd(), 'exports');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Gerar nome de arquivo baseado em timestamp
      const timestamp = fileTimestamp();
      const fileName = `notebooks-export-${timestamp}.xlsx`;
      const filePath = path.join(exportDir, fileName);

      // Buscar dados
      const notebooks = await prisma.notebook.findMany({
        include: {
          movements: true,
          place: true,
        },
      });

      // Criar workbook e planilhas
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Notebooks');
      
      // Definir colunas
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

      // Adicionar dados de notebooks
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
          location: notebook.place?.name || '',
          responsibleAnalyst: notebook.responsibleAnalyst,
          zurichEmployee: notebook.zurichEmployee,
          createdAt: formatDate(notebook.createdAt, 'dd/MM/yyyy HH:mm'),
          updatedAt: formatDate(notebook.updatedAt, 'dd/MM/yyyy HH:mm'),
        });
      });

      // Criar planilha para movimentações
      const movementsSheet = workbook.addWorksheet('Movements');
      movementsSheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Notebook ID', key: 'notebookId', width: 15 },
        { header: 'Service Tag', key: 'serviceTag', width: 20 },
        { header: 'Origin Place', key: 'originPlace', width: 20 },
        { header: 'Destiny Place', key: 'destinyPlace', width: 20 },
        { header: 'Previous Status', key: 'previousStatus', width: 20 },
        { header: 'New Status', key: 'newStatus', width: 20 },
        { header: 'Analyst', key: 'analyst', width: 15 },
        { header: 'Observation', key: 'observation', width: 40 },
        { header: 'Date', key: 'createdAt', width: 20 },
      ];

      // Buscar movimentações com dados relacionados
      const movements = await prisma.movement.findMany({
        include: {
          notebook: true,
          originPlace: true,
          destinyPlace: true,
        },
      });

      // Adicionar dados de movimentações
      movements.forEach((mov) => {
        movementsSheet.addRow({
          id: mov.id,
          notebookId: mov.notebookId,
          serviceTag: mov.notebook.serviceTag,
          originPlace: mov.originPlace.name,
          destinyPlace: mov.destinyPlace.name, 
          previousStatus: mov.previousStatus,
          newStatus: mov.newStatus,
          analyst: mov.analyst,
          observation: mov.observation,
          createdAt: formatDate(mov.createdAt, 'dd/MM/yyyy HH:mm'),
        });
      });

      // Formatação
      worksheet.getRow(1).font = { bold: true };
      movementsSheet.getRow(1).font = { bold: true };

      // Salvar arquivo
      await workbook.xlsx.writeFile(filePath);

      // Retornar informações do arquivo
      return {
        filePath,
        fileName
      };
    } catch (error) {
      throw new InternalServerError(
        `Erro ao exportar para Excel: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
