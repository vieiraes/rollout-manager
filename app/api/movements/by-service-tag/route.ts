import { NextRequest, NextResponse } from 'next/server';
import { movementsService } from '@/lib/services/movements.service';
import { createMovementByTagSchema } from '@/lib/validations/movement.schema';
import { handleApiError } from '@/lib/middleware/error-handler';

/**
 * POST /api/movements/by-service-tag
 * Create movement by service tag
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createMovementByTagSchema.parse(body);

    // Create movement by service tag
    const movement = await movementsService.createByServiceTag(validatedData);

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
