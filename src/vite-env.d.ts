/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API. Padrão: '/api' (o proxy do Vite/Nginx remove o prefixo antes do backend). */
  readonly VITE_API_URL?: string;
  /** Ativa a API simulada em memória para desenvolvimento local. */
  readonly VITE_API_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
