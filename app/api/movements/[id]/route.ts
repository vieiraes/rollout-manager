import { NextRequest, NextResponse } from 'next/server';
import { movementsService } from '@/lib/services/movements.service';
import { handleApiError } from '@/lib/middleware/error-handler';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/movements/[id]
 * Get movement by ID
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

    const movement = await movementsService.findOne(id);
    return NextResponse.json(movement);
  } catch (error) {
    return handleApiError(error);
  }
}
