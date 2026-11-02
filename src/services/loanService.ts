import type { CreateLoanDTO, Loan, LoanStatus, ReturnLoanDTO } from '../types/loan';
import type { User } from '../types/user';
import { api } from './api';
import { toBook, type BookResponse } from './bookService';

// Empréstimo no formato da API (recurso /lendings)
interface LendingResponse {
  id: number;
  startDate: string;
  endDate: string;
  returnDate: string | null;
  status: LoanStatus;
  user: User;
  book: BookResponse;
}

export interface LoanFilters {
  userId?: number;
  status?: LoanStatus;
}

function toLoan(response: LendingResponse): Loan {
  return {
    id: response.id,
    startDate: response.startDate,
    endDate: response.endDate,
    returnDate: response.returnDate ?? null,
    status: response.status,
    user: response.user,
    book: toBook(response.book),
  };
}

function toQueryString(filters: LoanFilters): string {
  const params = new URLSearchParams();

  if (filters.userId !== undefined) {
    params.set('userId', String(filters.userId));
  }

  if (filters.status) {
    params.set('status', filters.status);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export const loanService = {
  list: async (filters: LoanFilters = {}) =>
    (await api.get<LendingResponse[]>(`/lendings${toQueryString(filters)}`)).map(toLoan),
  getById: async (id: number) => toLoan(await api.get<LendingResponse>(`/lendings/${id}`)),
  create: async (data: CreateLoanDTO) => toLoan(await api.post<LendingResponse>('/lendings', data)),
  returnBook: async (id: number, data: ReturnLoanDTO = {}) =>
    toLoan(await api.patch<LendingResponse>(`/lendings/${id}/return`, data)),
};
