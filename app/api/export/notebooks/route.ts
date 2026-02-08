import { NextResponse } from 'next/server';
import { ExportService } from '@/lib/services/export.service';
import { handleApiError } from '@/lib/middleware/error-handler';
import * as fs from 'fs';

/**
 * GET /api/export/notebooks
 * Exporta dados de notebooks para arquivo Excel
 */
export async function GET() {
  try {
    const exportService = new ExportService();
    const { filePath, fileName } = await exportService.exportNotebooksToExcel();

    // Ler o arquivo gerado
    const fileBuffer = fs.readFileSync(filePath);

    // Retornar arquivo como download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
