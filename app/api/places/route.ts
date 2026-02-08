import { NextRequest, NextResponse } from 'next/server';
import { placesService } from '@/lib/services/places.service';
import { createPlaceSchema } from '@/lib/validations/place.schema';
import { handleApiError } from '@/lib/middleware/error-handler';

/**
 * GET /api/places
 * List all places
 */
export async function GET(request: NextRequest) {
  try {
    const places = await placesService.findAll();
    return NextResponse.json(places);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/places
 * Create a new place
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createPlaceSchema.parse(body);

    // Create place
    const place = await placesService.create(validatedData);

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
