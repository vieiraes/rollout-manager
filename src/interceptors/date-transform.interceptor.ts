import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toLocalISOString } from '../utils/date.util';

/**
 * Interceptor que transforma datas em respostas HTTP
 * Converte datas UTC (Z) para o formato brasileiro (-03:00)
 */
@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.transformDates(data))
    );
  }

  /**
   * Transforma recursivamente todas as datas em um objeto
   */
  private transformDates(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map(item => this.transformDates(item));
    }

    if (typeof data === 'object' && data !== null) {
      const transformed = { ...data };
      
      for (const key of Object.keys(transformed)) {
        const value = transformed[key];
        
        if (value instanceof Date) {
          // Converte a data para string no formato ISO, mas com timezone Brasil
          transformed[key] = toLocalISOString(value.toISOString());
        } else if (typeof value === 'string' && this.isISODate(value)) {
          transformed[key] = toLocalISOString(value);
        } else if (typeof value === 'object' && value !== null) {
          transformed[key] = this.transformDates(value);
        }
      }
      
      return transformed;
    }

    return data;
  }

  /**
   * Verifica se uma string é uma data ISO válida
   */
  private isISODate(str: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(str);
  }
}