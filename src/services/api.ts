// Cliente HTTP da API da biblioteca (wrapper de fetch com tratamento de erros padronizado)

const API_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '');

const UNREACHABLE_MESSAGE =
  'Não foi possível conectar à API. Verifique se o servidor está em execução e tente novamente.';
const INVALID_RESPONSE_MESSAGE =
  'A API retornou uma resposta inesperada. Verifique se o endereço da API está configurado corretamente.';
const SERVER_ERROR_MESSAGE =
  'O servidor encontrou um erro inesperado. Tente novamente em alguns instantes.';
const GENERIC_ERROR_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.';

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: 'Os dados enviados são inválidos.',
  404: 'Registro não encontrado.',
  409: 'A operação não pôde ser concluída por conflito com os dados existentes.',
};

export type FieldErrors = Record<string, string>;

// Corpo de erro devolvido pela API nas respostas 4xx
interface ApiErrorBody {
  status?: number;
  error?: string;
  message?: string;
  fields?: FieldErrors | null;
  timestamp?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fields: FieldErrors | null;

  constructor(status: number, message: string, fields: FieldErrors | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function isErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ApiErrorBody).message === 'string'
  );
}

function toApiError(status: number, body: unknown): ApiError {
  if (isErrorBody(body) && body.message) {
    return new ApiError(status, body.message, body.fields ?? null);
  }

  // 502/503/504 (Nginx) ou 500 sem corpo JSON (proxy do Vite) indicam backend fora do ar
  if ([502, 503, 504].includes(status) || (status === 500 && body === undefined)) {
    return new ApiError(status, UNREACHABLE_MESSAGE);
  }

  if (status >= 500) {
    return new ApiError(status, SERVER_ERROR_MESSAGE);
  }

  return new ApiError(status, DEFAULT_ERROR_MESSAGES[status] ?? GENERIC_ERROR_MESSAGE);
}

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;
  let text: string;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    text = response.status === 204 ? '' : await response.text();
  } catch {
    throw new ApiError(0, UNREACHABLE_MESSAGE);
  }

  let data: unknown = undefined;
  let invalidJson = false;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      invalidJson = true;
    }
  }

  if (!response.ok) {
    throw toApiError(response.status, data);
  }

  if (invalidJson) {
    throw new ApiError(response.status, INVALID_RESPONSE_MESSAGE);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: (path: string) => request<void>('DELETE', path),
};

// Mensagem amigável (pt-BR) para qualquer erro lançado pelas chamadas à API
export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE;
}

// 404/409 indicam que os dados exibidos estão desatualizados em relação ao back (registro
// removido, livro já emprestado, usuário que passou a ter pendência, devolução já registrada...)
export function isOutdatedDataError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.status === 409);
}
