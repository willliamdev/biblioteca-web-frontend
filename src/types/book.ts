export interface Author {
  id: number;
  name: string;
}

// Autor com a quantidade de livros vinculados (formato da listagem de autores)
export interface AuthorWithBookCount extends Author {
  bookCount: number;
}

export interface Genre {
  id: number;
  name: string;
}

// Gênero com a quantidade de livros vinculados (formato da listagem de gêneros)
export interface GenreWithBookCount extends Genre {
  bookCount: number;
}

export interface Book {
  id: number;
  title: string;
  author: Author;
  genre: Genre;
  publicationDate: string;
  publisher: string;
  available: boolean;
}

// Data Transfer Object - Objeto de Transferência de Dados

export interface CreateBookDTO {
  title: string;
  authorId: number;
  genreId: number;
  publicationDate: string;
  publisher: string;
}

export interface CreateAuthorDTO {
  name: string;
}

export interface CreateGenreDTO {
  name: string;
}
