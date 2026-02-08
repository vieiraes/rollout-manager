import { NextRequest, NextResponse } from 'next/server';
import { movementsService } from '@/lib/services/movements.service';
import { createMovementSchema } from '@/lib/validations/movement.schema';
import { handleApiError } from '@/lib/middleware/error-handler';

/**
 * GET /api/movements
 * List all movements
 */
export async function GET(request: NextRequest) {
  try {
    const movements = await movementsService.findAll();
    return NextResponse.json(movements);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/movements
 * Create a new movement
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createMovementSchema.parse(body);

    // Create movement
    const movement = await movementsService.create(validatedData);

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
