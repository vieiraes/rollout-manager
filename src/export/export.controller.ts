import { Controller, Get, Res, Header } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('excel')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=notebooks-export.xlsx')
  async exportToExcel(@Res() res: Response): Promise<void> {
    const { filePath, fileName } = await this.exportService.exportNotebooksToExcel();
    
    // Atualizar o header com o nome do arquivo correto
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}`
    );
    
    // Enviar o arquivo como resposta
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
  
  @Get('excel/list')
  async listExportFiles(): Promise<{ files: { fileName: string; createdAt: Date; size: string }[] }> {
    const exportDir = 'exports';
    const files = fs.readdirSync(exportDir)
      .filter(file => file.endsWith('.xlsx'))
      .map(file => ({ 
        fileName: file,
        createdAt: fs.statSync(`${exportDir}/${file}`).ctime,
        size: Math.round(fs.statSync(`${exportDir}/${file}`).size / 1024) + ' KB'
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
    return { files };
  }
}