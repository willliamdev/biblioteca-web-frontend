import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../services/api';
import { authorService } from '../services/authorService';
import { bookService } from '../services/bookService';
import { genreService } from '../services/genreService';
import { loanService } from '../services/loanService';
import { userService } from '../services/userService';
import type { AuthorWithBookCount, Book, GenreWithBookCount } from '../types/book';
import type { Loan } from '../types/loan';
import type { User } from '../types/user';
import { notifyError } from '../utils/feedback';

export type LibraryResource = 'authors' | 'genres' | 'books' | 'users' | 'loans';

interface LibraryData {
  authors: AuthorWithBookCount[];
  genres: GenreWithBookCount[];
  books: Book[];
  users: User[];
  loans: Loan[];
}

const ALL_RESOURCES: readonly LibraryResource[] = ['authors', 'genres', 'books', 'users', 'loans'];

const EMPTY_DATA: LibraryData = {
  authors: [],
  genres: [],
  books: [],
  users: [],
  loans: [],
};

// Busca na API apenas os recursos pedidos (em paralelo)
async function fetchLibraryData(
  resources: readonly LibraryResource[]
): Promise<Partial<LibraryData>> {
  const shouldLoad = (resource: LibraryResource) => resources.includes(resource);

  const [authors, genres, books, users, loans] = await Promise.all([
    shouldLoad('authors') ? authorService.list() : undefined,
    shouldLoad('genres') ? genreService.list() : undefined,
    shouldLoad('books') ? bookService.list() : undefined,
    shouldLoad('users') ? userService.list() : undefined,
    shouldLoad('loans') ? loanService.list() : undefined,
  ]);

  return { authors, genres, books, users, loans };
}

// Aplica os recursos atualizados (filtrados por shouldApply) sobre os dados atuais
function mergeLibraryData(
  current: LibraryData,
  update: Partial<LibraryData>,
  shouldApply: (resource: LibraryResource) => boolean = () => true
): LibraryData {
  const pick = <K extends LibraryResource>(resource: K): LibraryData[K] =>
    (shouldApply(resource) ? update[resource] : undefined) ?? current[resource];

  return {
    authors: pick('authors'),
    genres: pick('genres'),
    books: pick('books'),
    users: pick('users'),
    loans: pick('loans'),
  };
}

// Carrega os dados da API ao abrir o app e permite recarregar só o necessário após mutações
export function useLibraryData() {
  const [data, setData] = useState<LibraryData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  // Id da atualização mais recente pedida para cada recurso (ver refresh)
  const refreshCounter = useRef(0);
  const latestRefreshIds = useRef<Record<LibraryResource, number>>({
    authors: 0,
    genres: 0,
    books: 0,
    users: 0,
    loans: 0,
  });

  useEffect(() => {
    let active = true;

    fetchLibraryData(ALL_RESOURCES)
      .then((result) => {
        if (active) {
          setData((current) => mergeLibraryData(current, result));
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(getErrorMessage(loadError));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  const refresh = useCallback(async (resources: readonly LibraryResource[] = ALL_RESOURCES) => {
    const requestId = ++refreshCounter.current;
    resources.forEach((resource) => {
      latestRefreshIds.current[resource] = requestId;
    });

    try {
      const result = await fetchLibraryData(resources);
      // Com rede lenta, uma atualização mais antiga pode terminar depois de uma mais nova:
      // só aplica os recursos que nenhuma atualização posterior pediu de novo
      const latestResources = resources.filter(
        (resource) => latestRefreshIds.current[resource] === requestId
      );
      setData((current) =>
        mergeLibraryData(current, result, (resource) => latestResources.includes(resource))
      );
    } catch (refreshError) {
      notifyError(refreshError, 'Não foi possível atualizar os dados');
    }
  }, []);

  return { ...data, loading, error, retry, refresh };
}
