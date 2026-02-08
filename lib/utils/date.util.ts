import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Sao_Paulo';

/**
 * Formata uma data para string com timezone
 */
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy HH:mm'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const zonedDate = toZonedTime(dateObj, TIMEZONE);
  return format(zonedDate, formatStr);
}

/**
 * Gera timestamp para nomes de arquivo
 */
export function fileTimestamp(): string {
  return format(new Date(), 'yyyyMMdd-HHmmss');
}

/**
 * Converte string para Date (usado em forms)
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}
