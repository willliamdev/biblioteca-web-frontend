export interface Author {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: Author;
  genre: Genre;
  publicationDate: string;
  publisher: string;
}

// Data Transfer Object - Objeto de Transferência de Dados

export interface CreateBookDTO {
  title: string;
  authorId: number;
  genreId: number;
  publicationDate: string;
}
