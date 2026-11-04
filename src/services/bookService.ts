import type { Author, Book, CreateBookDTO, Genre } from '../types/book';
import { api } from './api';

// Livro no formato da API (o back usa publishDate; o front usa publicationDate)
export interface BookResponse {
  id: number;
  title: string;
  author: Author;
  genre: Genre;
  publishDate: string;
  publisher: string;
  available: boolean;
}

interface BookRequest {
  title: string;
  authorId: number;
  genreId: number;
  publishDate: string;
  publisher: string;
}

// Nomes de campo da API que diferem dos campos do formulário de livro
export const BOOK_FIELD_ALIASES: Record<string, string> = {
  publishDate: 'publicationDate',
};

export function toBook(response: BookResponse): Book {
  return {
    id: response.id,
    title: response.title,
    author: { id: response.author.id, name: response.author.name },
    genre: { id: response.genre.id, name: response.genre.name },
    publicationDate: response.publishDate,
    publisher: response.publisher,
    available: response.available,
  };
}

function toBookRequest(data: CreateBookDTO): BookRequest {
  return {
    title: data.title,
    authorId: data.authorId,
    genreId: data.genreId,
    publishDate: data.publicationDate,
    publisher: data.publisher,
  };
}

export const bookService = {
  list: async () => (await api.get<BookResponse[]>('/books')).map(toBook),
  getById: async (id: number) => toBook(await api.get<BookResponse>(`/books/${id}`)),
  create: async (data: CreateBookDTO) =>
    toBook(await api.post<BookResponse>('/books', toBookRequest(data))),
  update: async (id: number, data: CreateBookDTO) =>
    toBook(await api.put<BookResponse>(`/books/${id}`, toBookRequest(data))),
  remove: (id: number) => api.delete(`/books/${id}`),
};
