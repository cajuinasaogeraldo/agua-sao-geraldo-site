import { I18N } from 'astrowind:config';

/**
 * Formatador de data padrão com localização configurada
 * Usa o locale definido em I18N.language
 */
export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(I18N?.language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/**
 * Formata uma data usando o formatter padrão
 * @param date - Data para formatar
 * @returns String com data formatada ou vazio se data inválida
 * @example getFormattedDate(new Date()) // "18 de dez. de 2025"
 */
export const getFormattedDate = (date: Date): string => (date ? formatter.format(date) : '');

/**
 * Remove caracteres específicos do início e fim de uma string
 * @param str - String para processar
 * @param ch - Caractere para remover (opcional)
 * @returns String com caracteres removidos das extremidades
 */
export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

/**
 * Formata números grandes em formato abreviado (K, M, B)
 * @param amount - Número para formatar
 * @returns String formatada com sufixo apropriado
 * @example
 * toUiAmount(1500) // "1.5K"
 * toUiAmount(2000000) // "2M"
 * toUiAmount(3500000000) // "3.5B"
 */
export const _toUiAmount = (amount: number) => {
  if (!amount) return 0;

  let value: string;

  if (amount >= 1000000000) {
    const formattedNumber = (amount / 1000000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'B';
    } else {
      value = formattedNumber + 'B';
    }
  } else if (amount >= 1000000) {
    const formattedNumber = (amount / 1000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'M';
    } else {
      value = formattedNumber + 'M';
    }
  } else if (amount >= 1000) {
    const formattedNumber = (amount / 1000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'K';
    } else {
      value = formattedNumber + 'K';
    }
  } else {
    value = Number(amount).toFixed(0);
  }

  return value;
};
