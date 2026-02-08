import { NextRequest, NextResponse } from 'next/server';
import { placesService } from '@/lib/services/places.service';
import { updatePlaceSchema } from '@/lib/validations/place.schema';
import { handleApiError } from '@/lib/middleware/error-handler';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/places/[id]
 * Get place by ID
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

    const place = await placesService.findOne(id);
    return NextResponse.json(place);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/places/[id]
 * Update place
 */
export async function PATCH(request: NextRequest, props: RouteParams) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: { message: 'ID inválido', statusCode: 400 } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updatePlaceSchema.parse(body);

    const place = await placesService.update(id, validatedData);
    return NextResponse.json(place);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/places/[id]
 * Delete place
 */
export async function DELETE(request: NextRequest, props: RouteParams) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: { message: 'ID inválido', statusCode: 400 } },
        { status: 400 }
      );
    }

    const place = await placesService.remove(id);
    return NextResponse.json(place);
  } catch (error) {
    return handleApiError(error);
  }
}
