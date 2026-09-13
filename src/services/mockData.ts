import type { Book, Author, Genre } from '../types/book';
import type { Loan } from '../types/loan';
import type { User } from '../types/user';
import type { StatsProps } from '../components/StatsCard';

export const mockUsuarios: User[] = [
  {
    id: 1,
    name: 'Ana Souza',
    cpf: '123.456.789-01',
    debtFree: true,
  },
  {
    id: 2,
    name: 'Bruno Oliveira',
    cpf: '234.567.890-12',
    debtFree: false,
  },
  {
    id: 3,
    name: 'Carla Mendes',
    cpf: '345.678.901-23',
    debtFree: true,
  },
];

export const mockAutores: Author[] = [
  { id: 1, name: 'Machado de Assis' },
  { id: 2, name: 'Clarice Lispector' },
  { id: 3, name: 'Jorge Amado' },
];

export const mockGeneros: Genre[] = [
  { id: 1, name: 'Romance' },
  { id: 2, name: 'Ficção' },
  { id: 3, name: 'Literatura brasileira' },
];

export const mockLivros: Book[] = [
  {
    id: 1,
    title: 'Dom Casmurro',
    author: mockAutores[0],
    genre: mockGeneros[1],
    publicationDate: '1899-01-01',
    publisher: 'Livraria Garnier',
  },
  {
    id: 2,
    title: 'A Hora da Estrela',
    author: mockAutores[1],
    genre: mockGeneros[0],
    publicationDate: '1977-10-26',
    publisher: 'Livraria José Olympio Editora',
  },
  {
    id: 3,
    title: 'Capitães da Areia',
    author: mockAutores[2],
    genre: mockGeneros[2],
    publicationDate: '1937-01-01',
    publisher: 'Editora José Olympio',
  },
];

export const mockEmprestimos: Loan[] = [
  {
    id: 1,
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    user: mockUsuarios[0],
    book: mockLivros[0],
    status: 'ATIVO',
  },
  {
    id: 2,
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    user: mockUsuarios[1],
    book: mockLivros[1],
    status: 'CONCLUIDO',
  },
  {
    id: 3,
    startDate: '2026-09-03',
    endDate: '2026-09-17',
    user: mockUsuarios[2],
    book: mockLivros[2],
    status: 'ATIVO',
  },
];

export const mockDashboardStatsData: StatsProps[] = [
  {
    title: 'Total de Livros',
    value: mockLivros.length,
    description: 'exemplares cadastrados',
  },
  {
    title: 'Empréstimos Ativos',
    value: mockEmprestimos.filter((loan) => loan.status === 'ATIVO').length,
    description: 'livros emprestados',
  },
  {
    title: 'Empréstimos em Atraso',
    value: mockEmprestimos.filter((loan) => loan.status === 'ATRASADO').length,
    description: 'livros em atraso',
    color: 'red',
  },
];
