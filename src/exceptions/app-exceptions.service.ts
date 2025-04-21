import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';

/**
 * Serviço centralizado para tratamento de exceções
 * Padroniza o formato e os tipos de erros lançados pela aplicação
 */
@Injectable()
export class AppExceptionsService {
  /**
   * Lança uma exceção NotFound (404) quando um recurso não é encontrado
   */
  notFound(resource: string, identifier: string | number): never {
    throw new NotFoundException(`${resource} with identifier ${identifier} not found`);
  }

  /**
   * Lança uma exceção BadRequest (400) quando os dados de entrada são inválidos
   */
  badRequest(message: string): never {
    throw new BadRequestException(message);
  }

  /**
   * Lança uma exceção Conflict (409) quando ocorre um conflito
   */
  conflict(message: string): never {
    throw new ConflictException(message);
  }

  /**
   * Lança uma exceção InternalServerError (500) para erros inesperados
   */
  internal(message: string = 'An unexpected error occurred'): never {
    throw new InternalServerErrorException(message);
  }
}