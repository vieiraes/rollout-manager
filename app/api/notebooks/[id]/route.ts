import { NextRequest, NextResponse } from 'next/server';
import { notebooksService } from '@/lib/services/notebooks.service';
import { updateNotebookSchema } from '@/lib/validations/notebook.schema';
import { handleApiError } from '@/lib/middleware/error-handler';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/notebooks/[id]
 * Get notebook by ID
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

    const notebook = await notebooksService.findOne(id);
    return NextResponse.json(notebook);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/notebooks/[id]
 * Update notebook
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
    const validatedData = updateNotebookSchema.parse(body);

    const notebook = await notebooksService.update(id, validatedData);
    return NextResponse.json(notebook);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/notebooks/[id]
 * Delete notebook
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

    const notebook = await notebooksService.remove(id);
    return NextResponse.json(notebook);
  } catch (error) {
    return handleApiError(error);
  }
}
