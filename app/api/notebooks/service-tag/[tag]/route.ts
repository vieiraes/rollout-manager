import { NextRequest, NextResponse } from 'next/server';
import { notebooksService } from '@/lib/services/notebooks.service';
import { handleApiError } from '@/lib/middleware/error-handler';

interface RouteParams {
  params: Promise<{
    tag: string;
  }>;
}

/**
 * GET /api/notebooks/service-tag/[tag]
 * Get notebook by service tag
 */
export async function GET(request: NextRequest, props: RouteParams) {
  try {
    const params = await props.params;
    const { tag } = params;

    if (!tag) {
      return NextResponse.json(
        { error: { message: 'Service tag é obrigatório', statusCode: 400 } },
        { status: 400 }
      );
    }

    const notebook = await notebooksService.findByServiceTag(tag);
    return NextResponse.json(notebook);
  } catch (error) {
    return handleApiError(error);
  }
}
