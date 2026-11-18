import { addDaysIso, todayIso } from '../utils/format';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type LoanStatus = 'ATIVO' | 'CONCLUIDO' | 'ATRASADO';

interface AuthorRecord {
  id: number;
  name: string;
}

interface GenreRecord {
  id: number;
  name: string;
}

interface UserRecord {
  id: number;
  name: string;
  cpf: string;
  debtFree: boolean;
}

interface BookRecord {
  id: number;
  title: string;
  authorId: number;
  genreId: number;
  publishDate: string;
  publisher: string;
}

interface LoanRecord {
  id: number;
  startDate: string;
  endDate: string;
  returnDate: string | null;
  status: LoanStatus;
  userId: number;
  bookId: number;
}

const authors: AuthorRecord[] = [
  { id: 1, name: 'Machado de Assis' },
  { id: 2, name: 'Clarice Lispector' },
  { id: 3, name: 'Jorge Amado' },
  { id: 4, name: 'J.R.R. Tolkien' },
  { id: 5, name: 'George Orwell' },
  { id: 6, name: 'Gabriel García Márquez' },
  { id: 7, name: 'Isaac Asimov' },
  { id: 8, name: 'Agatha Christie' },
];

const genres: GenreRecord[] = [
  { id: 1, name: 'Romance' },
  { id: 2, name: 'Ficção Científica' },
  { id: 3, name: 'Literatura Brasileira' },
  { id: 4, name: 'Fantasia' },
  { id: 5, name: 'Distopia' },
  { id: 6, name: 'Mistério e Suspense' },
  { id: 7, name: 'Realismo Mágico' },
];

const users: UserRecord[] = [
  { id: 1, name: 'Ana Souza', cpf: '123.456.789-01', debtFree: true },
  { id: 2, name: 'Bruno Oliveira', cpf: '234.567.890-12', debtFree: true },
  { id: 3, name: 'Carla Mendes', cpf: '345.678.901-23', debtFree: true },
  { id: 4, name: 'Diego Ferreira', cpf: '456.789.012-34', debtFree: true },
  { id: 5, name: 'Elena Rostova', cpf: '567.890.123-45', debtFree: true },
  { id: 6, name: 'Fernando Silva', cpf: '678.901.234-56', debtFree: true },
  { id: 7, name: 'Gabriela Lima', cpf: '789.012.345-67', debtFree: true },
  { id: 8, name: 'Heitor Costa', cpf: '890.123.456-78', debtFree: true },
];

const books: BookRecord[] = [
  {
    id: 1,
    title: 'Dom Casmurro',
    authorId: 1,
    genreId: 3,
    publishDate: '1899-01-01',
    publisher: 'Livraria Garnier',
  },
  {
    id: 2,
    title: 'A Hora da Estrela',
    authorId: 2,
    genreId: 1,
    publishDate: '1977-10-26',
    publisher: 'Livraria José Olympio Editora',
  },
  {
    id: 3,
    title: 'Capitães da Areia',
    authorId: 3,
    genreId: 3,
    publishDate: '1937-01-01',
    publisher: 'Editora José Olympio',
  },
  {
    id: 4,
    title: 'O Hobbit',
    authorId: 4,
    genreId: 4,
    publishDate: '1937-09-21',
    publisher: 'HarperCollins',
  },
  {
    id: 5,
    title: '1984',
    authorId: 5,
    genreId: 5,
    publishDate: '1949-06-08',
    publisher: 'Companhia das Letras',
  },
  {
    id: 6,
    title: 'Cem Anos de Solidão',
    authorId: 6,
    genreId: 7,
    publishDate: '1967-05-30',
    publisher: 'Editorial Sudamericana',
  },
  {
    id: 7,
    title: 'Fundação',
    authorId: 7,
    genreId: 2,
    publishDate: '1951-06-01',
    publisher: 'Gnome Press',
  },
  {
    id: 8,
    title: 'E Não Sobrou Nenhum',
    authorId: 8,
    genreId: 6,
    publishDate: '1939-11-06',
    publisher: 'Globo Livros',
  },
  {
    id: 9,
    title: 'Memórias Póstumas de Brás Cubas',
    authorId: 1,
    genreId: 3,
    publishDate: '1881-01-01',
    publisher: 'Tipografia Nacional',
  },
  {
    id: 10,
    title: 'A Revolução dos Bichos',
    authorId: 5,
    genreId: 5,
    publishDate: '1945-08-17',
    publisher: 'Secker and Warburg',
  },
];

const today = todayIso();
const loans: LoanRecord[] = [
  {
    id: 1,
    startDate: addDaysIso(today, -2),
    endDate: addDaysIso(today, 12),
    returnDate: null,
    status: 'ATIVO',
    userId: 1,
    bookId: 1,
  },
  {
    id: 2,
    startDate: addDaysIso(today, -40),
    endDate: addDaysIso(today, -26),
    returnDate: addDaysIso(today, -25),
    status: 'CONCLUIDO',
    userId: 2,
    bookId: 2,
  },
  {
    id: 3,
    startDate: addDaysIso(today, -20),
    endDate: addDaysIso(today, -6),
    returnDate: null,
    status: 'ATRASADO',
    userId: 3,
    bookId: 3,
  },
  {
    id: 4,
    startDate: addDaysIso(today, -18),
    endDate: addDaysIso(today, -4),
    returnDate: null,
    status: 'ATRASADO',
    userId: 5,
    bookId: 5,
  },
  {
    id: 5,
    startDate: addDaysIso(today, -4),
    endDate: addDaysIso(today, 10),
    returnDate: null,
    status: 'ATIVO',
    userId: 6,
    bookId: 4,
  },
  {
    id: 6,
    startDate: addDaysIso(today, -15),
    endDate: addDaysIso(today, -1),
    returnDate: null,
    status: 'ATRASADO',
    userId: 8,
    bookId: 8,
  },
  {
    id: 7,
    startDate: addDaysIso(today, -50),
    endDate: addDaysIso(today, -36),
    returnDate: addDaysIso(today, -35),
    status: 'CONCLUIDO',
    userId: 4,
    bookId: 7,
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function emptyResponse(): Response {
  return new Response(null, { status: 204 });
}

function errorResponse(status: number, message: string, fields?: Record<string, string>): Response {
  return jsonResponse({ status, message, fields: fields ?? null }, status);
}

function notFound(resource: string): Response {
  return errorResponse(404, `${resource} não encontrado.`);
}

function conflict(message: string): Response {
  return errorResponse(409, message);
}

function nextId(records: readonly { id: number }[]): number {
  return records.reduce((maximum, record) => Math.max(maximum, record.id), 0) + 1;
}

function syncDerivedData(): void {
  const currentDate = todayIso();

  for (const loan of loans) {
    loan.status = loan.returnDate ? 'CONCLUIDO' : loan.endDate < currentDate ? 'ATRASADO' : 'ATIVO';
  }

  for (const user of users) {
    user.debtFree = !loans.some(
      (loan) => loan.userId === user.id && loan.status === 'ATRASADO' && loan.returnDate === null
    );
  }
}

function authorResponse(author: AuthorRecord) {
  return {
    ...author,
    bookCount: books.filter((book) => book.authorId === author.id).length,
  };
}

function genreResponse(genre: GenreRecord) {
  return {
    ...genre,
    bookCount: books.filter((book) => book.genreId === genre.id).length,
  };
}

function userResponse(user: UserRecord) {
  return { ...user };
}

function bookResponse(book: BookRecord) {
  const author = authors.find((item) => item.id === book.authorId);
  const genre = genres.find((item) => item.id === book.genreId);

  if (!author || !genre) {
    throw new Error('O mock encontrou um livro sem autor ou gênero associado.');
  }

  return {
    id: book.id,
    title: book.title,
    author: { id: author.id, name: author.name },
    genre: { id: genre.id, name: genre.name },
    publishDate: book.publishDate,
    publisher: book.publisher,
    available: !loans.some((loan) => loan.bookId === book.id && loan.returnDate === null),
  };
}

function loanResponse(loan: LoanRecord) {
  const user = users.find((item) => item.id === loan.userId);
  const book = books.find((item) => item.id === loan.bookId);

  if (!user || !book) {
    throw new Error('O mock encontrou um empréstimo sem usuário ou livro associado.');
  }

  return {
    id: loan.id,
    startDate: loan.startDate,
    endDate: loan.endDate,
    returnDate: loan.returnDate,
    status: loan.status,
    user: userResponse(user),
    book: bookResponse(book),
  };
}

function findId(pathId: string | undefined): number | null {
  if (!pathId || !/^\d+$/.test(pathId)) {
    return null;
  }

  const id = Number(pathId);
  return Number.isSafeInteger(id) ? id : null;
}

function resourceName(resource: string): string {
  const names: Record<string, string> = {
    authors: 'Autor',
    genres: 'Gênero',
    books: 'Livro',
    users: 'Usuário',
    lendings: 'Empréstimo',
  };

  return names[resource] ?? 'Registro';
}

function handleAuthors(method: HttpMethod, id: number | null, body: unknown): Response {
  if (id === null) {
    if (method === 'GET') {
      return jsonResponse(authors.map(authorResponse));
    }

    if (method !== 'POST') {
      return errorResponse(405, 'Método não permitido.');
    }

    const name = isRecord(body) && typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return errorResponse(400, 'Informe o nome do autor.', { name: 'O nome é obrigatório.' });
    }

    if (authors.some((author) => author.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      return conflict('Já existe um autor com esse nome.');
    }

    const author = { id: nextId(authors), name };
    authors.push(author);
    return jsonResponse(authorResponse(author), 201);
  }

  const author = authors.find((item) => item.id === id);
  if (!author) {
    return notFound('Autor');
  }

  if (method === 'GET') {
    return jsonResponse(authorResponse(author));
  }

  if (method === 'PUT') {
    const name = isRecord(body) && typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return errorResponse(400, 'Informe o nome do autor.', { name: 'O nome é obrigatório.' });
    }

    if (
      authors.some(
        (item) => item.id !== id && item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      )
    ) {
      return conflict('Já existe um autor com esse nome.');
    }

    author.name = name;
    return jsonResponse(authorResponse(author));
  }

  if (method === 'DELETE') {
    if (books.some((book) => book.authorId === id)) {
      return conflict('Não é possível remover um autor associado a livros.');
    }

    authors.splice(authors.indexOf(author), 1);
    return emptyResponse();
  }

  return errorResponse(405, 'Método não permitido.');
}

function handleGenres(method: HttpMethod, id: number | null, body: unknown): Response {
  if (id === null) {
    if (method === 'GET') {
      return jsonResponse(genres.map(genreResponse));
    }

    if (method !== 'POST') {
      return errorResponse(405, 'Método não permitido.');
    }

    const name = isRecord(body) && typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return errorResponse(400, 'Informe o nome do gênero.', { name: 'O nome é obrigatório.' });
    }

    if (genres.some((genre) => genre.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      return conflict('Já existe um gênero com esse nome.');
    }

    const genre = { id: nextId(genres), name };
    genres.push(genre);
    return jsonResponse(genreResponse(genre), 201);
  }

  const genre = genres.find((item) => item.id === id);
  if (!genre) {
    return notFound('Gênero');
  }

  if (method === 'GET') {
    return jsonResponse(genreResponse(genre));
  }

  if (method === 'PUT') {
    const name = isRecord(body) && typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return errorResponse(400, 'Informe o nome do gênero.', { name: 'O nome é obrigatório.' });
    }

    if (
      genres.some(
        (item) => item.id !== id && item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      )
    ) {
      return conflict('Já existe um gênero com esse nome.');
    }

    genre.name = name;
    return jsonResponse(genreResponse(genre));
  }

  if (method === 'DELETE') {
    if (books.some((book) => book.genreId === id)) {
      return conflict('Não é possível remover um gênero associado a livros.');
    }

    genres.splice(genres.indexOf(genre), 1);
    return emptyResponse();
  }

  return errorResponse(405, 'Método não permitido.');
}

function handleUsers(method: HttpMethod, id: number | null, body: unknown): Response {
  if (id === null) {
    if (method === 'GET') {
      return jsonResponse(users.map(userResponse));
    }

    if (method !== 'POST') {
      return errorResponse(405, 'Método não permitido.');
    }

    const name = isRecord(body) && typeof body.name === 'string' ? body.name.trim() : '';
    const cpf = isRecord(body) && typeof body.cpf === 'string' ? body.cpf.trim() : '';
    const fields: Record<string, string> = {};

    if (!name) fields.name = 'O nome é obrigatório.';
    if (!cpf) fields.cpf = 'O CPF é obrigatório.';
    if (Object.keys(fields).length) {
      return errorResponse(400, 'Preencha os dados do usuário.', fields);
    }

    if (users.some((user) => user.cpf === cpf)) {
      return conflict('Já existe um usuário cadastrado com esse CPF.');
    }

    const user = { id: nextId(users), name, cpf, debtFree: true };
    users.push(user);
    return jsonResponse(userResponse(user), 201);
  }

  const user = users.find((item) => item.id === id);
  if (!user) {
    return notFound('Usuário');
  }

  if (method === 'GET') {
    return jsonResponse(userResponse(user));
  }

  if (method === 'PUT') {
    const name = isRecord(body) && typeof body.name === 'string' ? body.name.trim() : '';
    const cpf = isRecord(body) && typeof body.cpf === 'string' ? body.cpf.trim() : '';
    const fields: Record<string, string> = {};

    if (!name) fields.name = 'O nome é obrigatório.';
    if (!cpf) fields.cpf = 'O CPF é obrigatório.';
    if (Object.keys(fields).length) {
      return errorResponse(400, 'Preencha os dados do usuário.', fields);
    }

    if (users.some((item) => item.id !== id && item.cpf === cpf)) {
      return conflict('Já existe um usuário cadastrado com esse CPF.');
    }

    user.name = name;
    user.cpf = cpf;
    return jsonResponse(userResponse(user));
  }

  if (method === 'DELETE') {
    if (loans.some((loan) => loan.userId === id)) {
      return conflict('Não é possível remover um usuário associado a empréstimos.');
    }

    users.splice(users.indexOf(user), 1);
    return emptyResponse();
  }

  return errorResponse(405, 'Método não permitido.');
}

function parseBook(body: unknown): Omit<BookRecord, 'id'> | Response {
  const fields: Record<string, string> = {};
  const record = isRecord(body) ? body : {};
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const publisher = typeof record.publisher === 'string' ? record.publisher.trim() : '';
  const authorId = record.authorId;
  const genreId = record.genreId;
  const publishDate = record.publishDate;

  if (!title) fields.title = 'O título é obrigatório.';
  if (typeof authorId !== 'number' || !Number.isInteger(authorId)) {
    fields.authorId = 'Selecione um autor válido.';
  } else if (!authors.some((author) => author.id === authorId)) {
    fields.authorId = 'O autor selecionado não foi encontrado.';
  }
  if (typeof genreId !== 'number' || !Number.isInteger(genreId)) {
    fields.genreId = 'Selecione um gênero válido.';
  } else if (!genres.some((genre) => genre.id === genreId)) {
    fields.genreId = 'O gênero selecionado não foi encontrado.';
  }
  if (!isIsoDate(publishDate)) fields.publishDate = 'Informe uma data válida.';
  if (!publisher) fields.publisher = 'A editora é obrigatória.';

  if (Object.keys(fields).length) {
    return errorResponse(400, 'Verifique os dados do livro.', fields);
  }

  if (typeof authorId !== 'number' || typeof genreId !== 'number' || !isIsoDate(publishDate)) {
    return errorResponse(400, 'Verifique os dados do livro.', fields);
  }

  return {
    title,
    authorId,
    genreId,
    publishDate,
    publisher,
  };
}

function handleBooks(method: HttpMethod, id: number | null, body: unknown): Response {
  if (id === null) {
    if (method === 'GET') {
      return jsonResponse(books.map(bookResponse));
    }

    if (method !== 'POST') {
      return errorResponse(405, 'Método não permitido.');
    }

    const parsed = parseBook(body);
    if (parsed instanceof Response) return parsed;

    const book = { id: nextId(books), ...parsed };
    books.push(book);
    syncDerivedData();
    return jsonResponse(bookResponse(book), 201);
  }

  const book = books.find((item) => item.id === id);
  if (!book) {
    return notFound('Livro');
  }

  if (method === 'GET') {
    return jsonResponse(bookResponse(book));
  }

  if (method === 'PUT') {
    const parsed = parseBook(body);
    if (parsed instanceof Response) return parsed;

    Object.assign(book, parsed);
    return jsonResponse(bookResponse(book));
  }

  if (method === 'DELETE') {
    if (loans.some((loan) => loan.bookId === id)) {
      return conflict('Não é possível remover um livro associado a empréstimos.');
    }

    books.splice(books.indexOf(book), 1);
    return emptyResponse();
  }

  return errorResponse(405, 'Método não permitido.');
}

function parseLoan(body: unknown): Omit<LoanRecord, 'id' | 'returnDate' | 'status'> | Response {
  const record = isRecord(body) ? body : {};
  const fields: Record<string, string> = {};
  const userId = record.userId;
  const bookId = record.bookId;
  const startDate = record.startDate;
  const endDate = record.endDate;

  if (typeof userId !== 'number' || !Number.isInteger(userId)) {
    fields.userId = 'Selecione um usuário válido.';
  } else if (!users.some((user) => user.id === userId)) {
    fields.userId = 'O usuário selecionado não foi encontrado.';
  }
  if (typeof bookId !== 'number' || !Number.isInteger(bookId)) {
    fields.bookId = 'Selecione um livro válido.';
  } else if (!books.some((book) => book.id === bookId)) {
    fields.bookId = 'O livro selecionado não foi encontrado.';
  }
  if (!isIsoDate(startDate)) fields.startDate = 'Informe uma data de início válida.';
  if (!isIsoDate(endDate)) fields.endDate = 'Informe uma data de devolução válida.';
  if (isIsoDate(startDate) && isIsoDate(endDate) && endDate < startDate) {
    fields.endDate = 'A data de devolução deve ser posterior à data de início.';
  }

  if (Object.keys(fields).length) {
    return errorResponse(400, 'Verifique os dados do empréstimo.', fields);
  }

  if (
    typeof userId !== 'number' ||
    typeof bookId !== 'number' ||
    !isIsoDate(startDate) ||
    !isIsoDate(endDate)
  ) {
    return errorResponse(400, 'Verifique os dados do empréstimo.', fields);
  }

  return {
    userId,
    bookId,
    startDate,
    endDate,
  };
}

function handleLendings(
  method: HttpMethod,
  id: number | null,
  isReturnRequest: boolean,
  body: unknown,
  searchParams: URLSearchParams
): Response {
  if (id === null) {
    if (method === 'GET') {
      const userIdFilter = searchParams.get('userId');
      const statusFilter = searchParams.get('status');
      const filteredLoans = loans.filter(
        (loan) =>
          (!userIdFilter || loan.userId === Number(userIdFilter)) &&
          (!statusFilter || loan.status === statusFilter)
      );
      return jsonResponse(filteredLoans.map(loanResponse));
    }

    if (method !== 'POST') {
      return errorResponse(405, 'Método não permitido.');
    }

    const parsed = parseLoan(body);
    if (parsed instanceof Response) return parsed;

    const user = users.find((item) => item.id === parsed.userId);
    const book = books.find((item) => item.id === parsed.bookId);
    if (!user || !book) {
      return errorResponse(400, 'O usuário ou livro selecionado não foi encontrado.');
    }
    if (!user.debtFree) {
      return conflict(
        'O usuário possui empréstimos em atraso e não pode realizar um novo empréstimo.'
      );
    }
    if (loans.some((loan) => loan.bookId === book.id && loan.returnDate === null)) {
      return conflict('O livro selecionado não está disponível.');
    }

    const loan: LoanRecord = {
      id: nextId(loans),
      ...parsed,
      returnDate: null,
      status: 'ATIVO',
    };
    loans.push(loan);
    syncDerivedData();
    return jsonResponse(loanResponse(loan), 201);
  }

  const loan = loans.find((item) => item.id === id);
  if (!loan) {
    return notFound('Empréstimo');
  }

  if (isReturnRequest) {
    if (method !== 'PATCH') {
      return errorResponse(405, 'Método não permitido.');
    }
    if (loan.returnDate) {
      return conflict('Este empréstimo já foi devolvido.');
    }

    const requestedDate = isRecord(body) ? body.returnDate : undefined;
    if (requestedDate !== undefined && requestedDate !== null && !isIsoDate(requestedDate)) {
      return errorResponse(400, 'Informe uma data de devolução válida.', {
        returnDate: 'A data deve estar no formato AAAA-MM-DD.',
      });
    }
    const returnDate = isIsoDate(requestedDate) ? requestedDate : todayIso();
    if (returnDate < loan.startDate) {
      return errorResponse(
        400,
        'A data de devolução deve ser igual ou posterior ao início do empréstimo.',
        {
          returnDate: 'A data não pode ser anterior ao início do empréstimo.',
        }
      );
    }

    loan.returnDate = returnDate;
    syncDerivedData();
    return jsonResponse(loanResponse(loan));
  }

  if (method === 'GET') {
    return jsonResponse(loanResponse(loan));
  }

  return errorResponse(405, 'Método não permitido.');
}

export async function handleMockRequest(
  method: HttpMethod,
  path: string,
  body?: unknown
): Promise<Response> {
  syncDerivedData();

  const url = new URL(path, 'http://mock.local');
  const segments = url.pathname.split('/').filter(Boolean);
  const [resource, pathId, action] = segments;
  const id = pathId === undefined ? null : findId(pathId);

  if (pathId !== undefined && id === null) {
    return notFound(resourceName(resource ?? ''));
  }

  if (resource === 'authors' && segments.length <= 2) {
    return handleAuthors(method, id, body);
  }
  if (resource === 'genres' && segments.length <= 2) {
    return handleGenres(method, id, body);
  }
  if (resource === 'users' && segments.length <= 2) {
    return handleUsers(method, id, body);
  }
  if (resource === 'books' && segments.length <= 2) {
    return handleBooks(method, id, body);
  }
  if (resource === 'lendings' && segments.length === 1) {
    return handleLendings(method, null, false, body, url.searchParams);
  }
  if (resource === 'lendings' && segments.length === 2) {
    return handleLendings(method, id, false, body, url.searchParams);
  }
  if (resource === 'lendings' && segments.length === 3 && action === 'return') {
    return handleLendings(method, id, true, body, url.searchParams);
  }

  return notFound(resourceName(resource ?? ''));
}
