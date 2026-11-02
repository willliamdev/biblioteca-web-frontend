import type { AuthorWithBookCount, CreateAuthorDTO } from '../types/book';
import { api } from './api';

export const authorService = {
  list: () => api.get<AuthorWithBookCount[]>('/authors'),
  getById: (id: number) => api.get<AuthorWithBookCount>(`/authors/${id}`),
  create: (data: CreateAuthorDTO) => api.post<AuthorWithBookCount>('/authors', data),
  update: (id: number, data: CreateAuthorDTO) =>
    api.put<AuthorWithBookCount>(`/authors/${id}`, data),
  remove: (id: number) => api.delete(`/authors/${id}`),
};
