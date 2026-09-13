import type { Book, Author, Genre } from '../types/book';
import type { Loan } from '../types/loan';
import type { User } from '../types/user';
import type { StatsProps } from '../components/StatsCard';

export const mockUsuarios: User[] = [
  { id: 1, name: 'Ana Souza', cpf: '123.456.789-01', debtFree: true },
  { id: 2, name: 'Bruno Oliveira', cpf: '234.567.890-12', debtFree: false },
  { id: 3, name: 'Carla Mendes', cpf: '345.678.901-23', debtFree: true },
  { id: 4, name: 'Diego Ferreira', cpf: '456.789.012-34', debtFree: true },
  { id: 5, name: 'Elena Rostova', cpf: '567.890.123-45', debtFree: false },
  { id: 6, name: 'Fernando Silva', cpf: '678.901.234-56', debtFree: true },
  { id: 7, name: 'Gabriela Lima', cpf: '789.012.345-67', debtFree: true },
  { id: 8, name: 'Heitor Costa', cpf: '890.123.456-78', debtFree: false },
];

export const mockAutores: Author[] = [
  { id: 1, name: 'Machado de Assis' },
  { id: 2, name: 'Clarice Lispector' },
  { id: 3, name: 'Jorge Amado' },
  { id: 4, name: 'J.R.R. Tolkien' },
  { id: 5, name: 'George Orwell' },
  { id: 6, name: 'Gabriel García Márquez' },
  { id: 7, name: 'Isaac Asimov' },
  { id: 8, name: 'Agatha Christie' },
];

export const mockGeneros: Genre[] = [
  { id: 1, name: 'Romance' },
  { id: 2, name: 'Ficção Científica' },
  { id: 3, name: 'Literatura Brasileira' },
  { id: 4, name: 'Fantasia' },
  { id: 5, name: 'Distopia' },
  { id: 6, name: 'Mistério e Suspense' },
  { id: 7, name: 'Realismo Mágico' },
];

export const mockLivros: Book[] = [
  {
    id: 1,
    title: 'Dom Casmurro',
    author: mockAutores[0],
    genre: mockGeneros[2],
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
  {
    id: 4,
    title: 'O Hobbit',
    author: mockAutores[3],
    genre: mockGeneros[3],
    publicationDate: '1937-09-21',
    publisher: 'HarperCollins',
  },
  {
    id: 5,
    title: '1984',
    author: mockAutores[4],
    genre: mockGeneros[4],
    publicationDate: '1949-06-08',
    publisher: 'Companhia das Letras',
  },
  {
    id: 6,
    title: 'Cem Anos de Solidão',
    author: mockAutores[5],
    genre: mockGeneros[6],
    publicationDate: '1967-05-30',
    publisher: 'Editorial Sudamericana',
  },
  {
    id: 7,
    title: 'Fundação',
    author: mockAutores[6],
    genre: mockGeneros[1],
    publicationDate: '1951-06-01',
    publisher: 'Gnome Press',
  },
  {
    id: 8,
    title: 'E Não Sobrou Nenhum',
    author: mockAutores[7],
    genre: mockGeneros[5],
    publicationDate: '1939-11-06',
    publisher: 'Globo Livros',
  },
  {
    id: 9,
    title: 'Memórias Póstumas de Brás Cubas',
    author: mockAutores[0],
    genre: mockGeneros[2],
    publicationDate: '1881-01-01',
    publisher: 'Tipografia Nacional',
  },
  {
    id: 10,
    title: 'A Revolução dos Bicho',
    author: mockAutores[4],
    genre: mockGeneros[4],
    publicationDate: '1945-08-17',
    publisher: 'Secker and Warburg',
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
  {
    id: 4,
    startDate: '2026-08-10',
    endDate: '2026-08-24',
    user: mockUsuarios[4],
    book: mockLivros[4],
    status: 'ATRASADO',
  },
  {
    id: 5,
    startDate: '2026-09-05',
    endDate: '2026-09-19',
    user: mockUsuarios[5],
    book: mockLivros[3],
    status: 'ATIVO',
  },
  {
    id: 6,
    startDate: '2026-08-15',
    endDate: '2026-08-29',
    user: mockUsuarios[7],
    book: mockLivros[7],
    status: 'ATRASADO',
  },
  {
    id: 7,
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    user: mockUsuarios[3],
    book: mockLivros[6],
    status: 'CONCLUIDO',
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
