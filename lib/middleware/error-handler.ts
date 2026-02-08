import { NextResponse } from 'next/server';
import { formatErrorResponse, AppError } from '../exceptions';
import { ZodError } from 'zod';

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: 'Erro de validação',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
          issues: error.errors,
        },
      },
      { status: 400 }
    );
  }

  // App errors
  if (error instanceof AppError) {
    const errorData = formatErrorResponse(error);
    return NextResponse.json(errorData, { status: error.statusCode });
  }

  // Unknown errors
  const errorData = formatErrorResponse(error);
  return NextResponse.json(errorData, { status: 500 });
}
