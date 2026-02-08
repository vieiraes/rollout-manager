import { NextRequest, NextResponse } from 'next/server';
import { movementsService } from '@/lib/services/movements.service';
import { handleApiError } from '@/lib/middleware/error-handler';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/movements/notebook/[id]
 * Get movements by notebook ID
 */
export async function GET(request: NextRequest, props: RouteParams) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: { message: 'ID inválido', statusCode: 400 } },
        { status: 400 }
      );
    }

    const movements = await movementsService.findByNotebookId(id);
    return NextResponse.json(movements);
  } catch (error) {
    return handleApiError(error);
  }
}
