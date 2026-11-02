import type { CreateGenreDTO, GenreWithBookCount } from '../types/book';
import { api } from './api';

export const genreService = {
  list: () => api.get<GenreWithBookCount[]>('/genres'),
  getById: (id: number) => api.get<GenreWithBookCount>(`/genres/${id}`),
  create: (data: CreateGenreDTO) => api.post<GenreWithBookCount>('/genres', data),
  update: (id: number, data: CreateGenreDTO) => api.put<GenreWithBookCount>(`/genres/${id}`, data),
  remove: (id: number) => api.delete(`/genres/${id}`),
};
