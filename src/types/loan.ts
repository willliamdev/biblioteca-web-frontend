import type { User } from './user';
import type { Book } from './book';

export type LoanStatus = 'ATIVO' | 'CONCLUIDO' | 'ATRASADO';

export interface Loan {
  id: number;
  startDate: string;
  endDate: string;
  returnDate: string | null;
  user: User;
  book: Book;
  // Auxiliar para UI
  status: LoanStatus;
}

// DTO para criação de empréstimo
export interface CreateLoanDTO {
  userId: number;
  bookId: number;
  startDate: string;
  endDate: string;
}

// DTO para registrar devolução (sem returnDate, a API considera a data de hoje)
export interface ReturnLoanDTO {
  returnDate?: string | null;
}
