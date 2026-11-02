import dayjs from 'dayjs';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';

// Data de hoje no formato ISO (YYYY-MM-DD) usado pela API
export function todayIso(): string {
  return dayjs().format(ISO_DATE_FORMAT);
}

// Soma dias a uma data ISO e devolve outra data ISO
export function addDaysIso(date: string, days: number): string {
  return dayjs(date).add(days, 'day').format(ISO_DATE_FORMAT);
}

// Formata uma data ISO (YYYY-MM-DD) para exibição (DD/MM/YYYY)
export function formatDate(date: string | null | undefined, fallback = '—'): string {
  return date ? dayjs(date).format(DISPLAY_DATE_FORMAT) : fallback;
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

// Formata um CPF de 11 dígitos no padrão 000.000.000-00
export function formatCpf(cpf: string): string {
  const digits = onlyDigits(cpf);

  if (digits.length !== 11) {
    return cpf;
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
