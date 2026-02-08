import { NextRequest, NextResponse } from 'next/server';
import { notebooksService } from '@/lib/services/notebooks.service';
import { inventoryFilterSchema } from '@/lib/validations/notebook.schema';
import { handleApiError } from '@/lib/middleware/error-handler';

/**
 * GET /api/notebooks/inventory
 * Get notebooks inventory with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filters = Object.fromEntries(searchParams.entries());

    // Validate filters
    const validatedFilters = inventoryFilterSchema.parse(filters);

    // Get inventory
    const notebooks = await notebooksService.findByFilters(validatedFilters);

    return NextResponse.json(notebooks);
  } catch (error) {
    return handleApiError(error);
  }
}
