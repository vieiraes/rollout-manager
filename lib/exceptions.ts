export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(`${resource} com ID ${id} não encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}

// Prisma error handler
export function handlePrismaError(error: any): AppError {
  if (error.code === 'P2002') {
    return new ConflictError('Registro duplicado: ' + error.meta?.target);
  }
  if (error.code === 'P2025') {
    return new NotFoundError('Registro', 'desconhecido');
  }
  if (error.code === 'P2003') {
    return new BadRequestError('Referência inválida: ' + error.meta?.field_name);
  }
  return new InternalServerError(error.message || 'Erro interno no servidor');
}

// Error response formatter
export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    };
  }

  // Validation errors (Zod)
  if (typeof error === 'object' && error !== null && 'issues' in error) {
    return {
      error: {
        message: 'Erro de validação',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        issues: (error as any).issues,
      },
    };
  }

  return {
    error: {
      message: 'Erro interno no servidor',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    },
  };
}
