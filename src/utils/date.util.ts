import { format, addHours, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Timezone para Brasil (Brasília)
export const TIMEZONE = 'America/Sao_Paulo';
export const UTC_OFFSET = -3;

/**
 * Converte uma data para o horário de Brasília (UTC-3)
 */
export function toBrazilianTime(date: Date | string): Date {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(parsedDate, TIMEZONE);
}

/**
 * Cria uma data no horário de Brasília
 */
export function brazilianDate(): Date {
  const now = new Date();
  return toBrazilianTime(now);
}

/**
 * Converte uma data do horário de Brasília para UTC
 */
export function fromBrazilianTimeToUTC(date: Date): Date {
  return fromZonedTime(date, TIMEZONE);
}

/**
 * Formata uma data usando o horário de Brasília
 */
export function formatBrazilianDate(
  date: Date | string,
  formatString: string = 'dd/MM/yyyy HH:mm:ss'
): string {
  const brazilianDate = toBrazilianTime(date);
  return format(brazilianDate, formatString);
}

/**
 * Cria um timestamp de arquivo válido no horário de Brasília
 */
export function brazilianTimestamp(): string {
  const now = brazilianDate();
  return format(now, "yyyy-MM-dd'T'HH-mm-ss");
}

/**
 * Formata uma data para exibição no padrão brasileiro
 * @param date Data a ser formatada
 * @param formatString Padrão de formatação (opcional)
 * @returns String formatada
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'dd/MM/yyyy HH:mm:ss'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatString);
}

/**
 * Gera um timestamp para nome de arquivo
 * @returns String no formato yyyy-MM-dd'T'HH-mm-ss
 */
export function fileTimestamp(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH-mm-ss");
}

/**
 * Transforma uma data ISO string para o formato brasileiro (UTC-3)
 * Útil para APIs que retornam datas em formato ISO
 * @param isoString String ISO de data (com Z no final)
 * @returns String ISO com UTC-3 (-03:00 no final)
 */
export function toLocalISOString(isoString: string): string {
  if (!isoString) return isoString;
  return isoString.replace('Z', '-03:00');
}