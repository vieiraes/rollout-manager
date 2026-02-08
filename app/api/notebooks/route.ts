import { NextRequest, NextResponse } from 'next/server';
import { notebooksService } from '@/lib/services/notebooks.service';
import {
  createNotebookSchema,
  notebookQuerySchema,
} from '@/lib/validations/notebook.schema';
import { handleApiError } from '@/lib/middleware/error-handler';

/**
 * GET /api/notebooks
 * List notebooks with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = Object.fromEntries(searchParams.entries());

    // Validate and parse query params
    const validatedQuery = notebookQuerySchema.parse(query);

    // Get notebooks
    const result = await notebooksService.findAll(validatedQuery);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/notebooks
 * Create a new notebook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createNotebookSchema.parse(body);

    // Create notebook
    const notebook = await notebooksService.create(validatedData);

    return NextResponse.json(notebook, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
