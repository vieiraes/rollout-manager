import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('excel')
  async exportToExcel(@Res() res: Response) {
    const buffer = await this.exportService.exportNotebooksToExcel();
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=rollout-report.xlsx',
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}