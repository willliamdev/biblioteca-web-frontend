import type { User } from './user';
import type { Book } from './book';

export type LoanStatus = 'ATIVO' | 'CONCLUIDO' | 'ATRASADO';

export interface Loan {
  id: number;
  startDate: string;
  endDate: string;
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
