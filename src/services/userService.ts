import type { CreateUserDTO, User } from '../types/user';
import { api } from './api';

export const userService = {
  list: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (data: CreateUserDTO) => api.post<User>('/users', data),
  update: (id: number, data: CreateUserDTO) => api.put<User>(`/users/${id}`, data),
  remove: (id: number) => api.delete(`/users/${id}`),
};
