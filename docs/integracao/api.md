# Integração com a API

Como o frontend consome a API REST do backend `library-backend` (Spring Boot, repositório irmão, porta 8080). Tudo que está aqui foi conferido no código de `src/services`, `src/hooks`, `src/utils`, `vite.config.ts` e `nginx/default.conf.template`.

Fluxo geral:

```text
Componente / hook  ->  service (src/services/*Service.ts)  ->  api.ts (fetch)  ->  /api/...  ->  proxy  ->  backend (/...)
```

Componentes, páginas e hooks nunca chamam `fetch` direto: eles chamam um service. O service fala com `api.ts` e converte o formato do backend para os tipos de `src/types`.

## Base URL e proxy

A URL base vem de `VITE_API_URL` (padrão `/api`; barras no final são removidas). O navegador sempre chama o próprio servidor do frontend em `/api/...`, e um proxy repassa a chamada ao backend **sem o prefixo `/api`**: `/api/authors` vira `/authors`.

| Ambiente | Quem faz o proxy | Destino | Configuração |
| --- | --- | --- | --- |
| `npm run dev` (porta 5173) e `npm run preview` (porta 4173) | Vite (`server.proxy` e `preview.proxy`) | `VITE_PROXY_TARGET` (padrão `http://localhost:8080`) | `.env.local` ou variável de ambiente |
| Imagem Docker e stack do compose | Nginx (`location /api/`) | `API_UPSTREAM` (padrão `http://library-backend:8080`) | `-e API_UPSTREAM=...` ou `environment` do compose |

Evite uma URL absoluta em `VITE_API_URL`: o navegador passaria a chamar o backend direto, sem proxy, e só funcionaria se a origem do frontend estivesse na lista de CORS do backend (`app.cors.allowed-origins`, padrão `http://localhost:5173` e `http://localhost:4173`).

### Por que o header `Origin` é removido

Os navegadores enviam o header `Origin` em requisições POST, PUT, PATCH e DELETE, mesmo quando a chamada é da mesma origem. Se o proxy repassasse esse header, o Spring trataria a requisição como CORS e a compararia com a lista de origens liberadas. Quando o frontend é acessado por uma origem fora da lista (ex.: `http://127.0.0.1:5173`, `http://127.0.0.1:8081` ou o IP da máquina na rede), toda escrita seria recusada com 403 (CORS), enquanto as leituras (GET) continuariam funcionando.

Como, para o navegador, a chamada é same-origin (passa pelo proxy), os dois proxies removem o header:

- Vite (`vite.config.ts`): `proxyReq.removeHeader('origin')` no evento `proxyReq`.
- Nginx (`nginx/default.conf.template`): `proxy_set_header Origin "";` dentro de `location /api/` (valor vazio faz o Nginx não repassar o header).

Se alterar um dos dois proxies, mantenha esse comportamento nos dois.

### Headers repassados pelo Nginx

O Nginx também envia `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Forwarded-Host` e `X-Forwarded-Prefix: /api`. O backend usa `server.forward-headers-strategy=framework` para montar o header `Location` das respostas 201 com a URL pública (ex.: `http://localhost:8081/api/authors/1`). O frontend não lê o `Location`: depois de criar, ele recarrega as listas.

## Cliente HTTP (`src/services/api.ts`)

`api.get`, `api.post`, `api.put`, `api.patch` e `api.delete` chamam `request`, que:

1. Envia `Accept: application/json` e, só quando há corpo, `Content-Type: application/json` com o corpo em JSON.
2. Trata 204 como resposta sem corpo (`DELETE` devolve `void`).
3. Converte qualquer falha de rede (`fetch` rejeitado) em `ApiError` com status 0 e a mensagem de API fora do ar.
4. Lê o corpo como texto e tenta `JSON.parse`. Se a resposta não for 2xx, lança o `ApiError` correspondente (tabela abaixo). Se for 2xx, mas o corpo não for JSON, lança "A API retornou uma resposta inesperada..." (acontece, por exemplo, quando `VITE_API_URL` aponta para um endereço que devolve HTML).

## Erros: `ApiError`

O backend responde os erros em um corpo padrão (`ApiError` do Java):

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "O nome do autor é obrigatório.",
  "fields": { "name": "O nome do autor é obrigatório." },
  "timestamp": "2026-10-30T00:36:38.613815930Z"
}
```

`fields` só vem nos erros de validação (400); nos demais casos é `null`. As mensagens já estão em português.

No frontend, a classe `ApiError` (em `api.ts`) guarda `status`, `message` e `fields`. A mensagem exibida ao usuário depende do que chegou:

| Resposta | Mensagem (`message`) |
| --- | --- |
| Corpo JSON com `message` (os 4xx e 5xx do backend) | A mensagem do backend; `fields` vai junto |
| Falha de rede, 502, 503, 504, ou 500 sem corpo JSON (backend fora do ar; tanto o proxy do Vite 8 quanto o Nginx respondem 502 sem corpo JSON) | "Não foi possível conectar à API. Verifique se o servidor está em execução e tente novamente." |
| Demais 5xx sem corpo JSON | "O servidor encontrou um erro inesperado. Tente novamente em alguns instantes." |
| 400 sem corpo JSON | "Os dados enviados são inválidos." |
| 404 sem corpo JSON | "Registro não encontrado." |
| 409 sem corpo JSON | "A operação não pôde ser concluída por conflito com os dados existentes." |
| Outros 4xx sem corpo JSON (ex.: 403 em texto puro) | "Ocorreu um erro inesperado. Tente novamente." |
| 2xx com corpo que não é JSON | "A API retornou uma resposta inesperada. Verifique se o endereço da API está configurado corretamente." |

Funções auxiliares exportadas por `api.ts`:

- `getErrorMessage(error)`: devolve a mensagem do `ApiError` ou o texto genérico "Ocorreu um erro inesperado. Tente novamente.".
- `isOutdatedDataError(error)`: `true` para `ApiError` 404 ou 409, que indicam tela desatualizada em relação ao backend (registro já removido, livro já emprestado, usuário que passou a ter pendência, devolução já registrada, autor que ganhou livro...).

### Erros de campo nos formulários

`src/utils/feedback.ts` leva o `fields` da API para os campos do formulário:

- `applyApiFieldErrors(form, error, aliases)`: para cada `campo: mensagem` de `error.fields`, chama `form.setFieldError`. O nome do campo da API pode ser traduzido pelo mapa `aliases`, e campos que o formulário não possui são ignorados (a mensagem continua aparecendo no aviso).
- `handleFormError(form, error, title, aliases)`: aplica os erros de campo e mostra o aviso vermelho com `notifyError` (título + mensagem do erro).
- `notifySuccess(title, message)` e `notifyError(error, title)`: avisos verdes e vermelhos do Mantine. São o único ponto que chama `notifications.show`.

Hoje só o formulário de livro precisa de alias: a API devolve o erro em `publishDate`, e o campo do formulário se chama `publicationDate` (`BOOK_FIELD_ALIASES` em `bookService.ts`). Nos demais formulários os nomes coincidem: autor (`name`), usuário (`name`, `cpf`), empréstimo (`userId`, `bookId`, `startDate`, `endDate`) e devolução (`returnDate`).

Quando a falha é de rede ou 5xx, o formulário continua aberto, com os dados digitados, e o usuário vê o aviso vermelho. Só o sucesso fecha o modal.

### Regras que só o backend valida

O frontend repete algumas validações simples para dar retorno imediato, mas as regras de negócio são do backend, e o formulário mostra a mensagem dele no campo (400) ou no aviso (409):

| Operação | Resposta | Regra |
| --- | --- | --- |
| Criar empréstimo | 400 em `startDate` | Início futuro, anterior à publicação do livro ou anterior à última devolução do livro |
| Criar empréstimo | 400 em `endDate` | Devolução prevista anterior ao início ou anterior a hoje (o empréstimo não pode nascer atrasado) |
| Criar empréstimo | 409 | Usuário com empréstimo em atraso, ou livro já emprestado |
| Registrar devolução | 400 em `returnDate` | Data anterior ao início do empréstimo ou futura |
| Registrar devolução | 409 | Empréstimo já devolvido |
| Criar ou editar usuário | 400 em `cpf` / 409 | CPF inválido / CPF já cadastrado |
| Excluir autor, livro ou usuário | 409 | Autor com livros, livro com empréstimos, usuário com empréstimos |

Observação: no formulário de novo empréstimo, o frontend só exige início não futuro e devolução prevista igual ou posterior ao início. Uma devolução prevista anterior a hoje passa pela validação do formulário e é recusada pelo backend (400 em `endDate`), com a mensagem exibida no campo.

## Atualização dos dados (`src/hooks/useLibraryData.ts`)

Ao abrir o app, o hook carrega os cinco recursos (autores, gêneros, livros, usuários e empréstimos) em paralelo. Enquanto isso o app mostra "Carregando dados da biblioteca...".

`refresh(resources)` recarrega só os recursos pedidos. Depois de cada mutação, `src/App.tsx` pede os recursos que a mudança pode ter afetado:

| Mutação | Recursos recarregados |
| --- | --- |
| Livro (criar, editar, excluir) | `books`, `authors`, `genres`, `loans` |
| Autor (criar, editar, excluir) | `authors`, `books`, `loans` |
| Usuário (criar, editar, excluir) | `users`, `loans` |
| Empréstimo (criar, devolver) | `loans`, `books`, `users` |

Isso mantém coerentes o `bookCount` de autores e gêneros, o `available` dos livros, o `debtFree` dos usuários e o status dos empréstimos, todos calculados pelo backend.

Detalhes do `refresh`:

- Cada pedido de `refresh` recebe um número. Se uma resposta antiga chegar depois de uma mais nova para o mesmo recurso, ela é descartada. Limitação conhecida: se a atualização mais nova falhar, a resposta antiga descartada não é reaproveitada, e a tela fica como estava até a próxima ação.
- 404 e 409 (`isOutdatedDataError`) em uma exclusão ou em um formulário também disparam o `refresh`, para a tela refletir o estado real (nas exclusões, em `confirmAndDelete`; nos formulários, pela prop `onOutdatedData` dos modais).
- Se o `refresh` falhar, aparece o aviso vermelho "Não foi possível atualizar os dados" e a tela mantém os dados anteriores.

## API fora do ar

- Na abertura (carga inicial): a tela mostra um alerta vermelho "Não foi possível carregar os dados" com a mensagem do erro e o botão "Tentar novamente", que refaz a carga completa (`retry`).
- Durante o uso: cada ação que falha mostra um aviso vermelho com a mensagem (`notifyError`), sem fechar o modal aberto.
- Com o backend parado, o proxy do Vite (desenvolvimento) e o Nginx (imagem Docker) respondem 502 sem corpo JSON (conferido com Vite 8 e com a imagem), e o frontend mostra "Não foi possível conectar à API...". O ramo "500 sem corpo JSON" de `api.ts` é uma proteção extra para proxies que respondam 500.

## Services, endpoints e tipos

Todos os services ficam em `src/services`. O backend responde sem o prefixo `/api` (o proxy o remove). As colunas de tipo usam os nomes de `src/types`.

### `authorService` (`/authors`)

| Método | Endpoint | Corpo | Retorno |
| --- | --- | --- | --- |
| `list()` | `GET /authors` | | `AuthorWithBookCount[]` |
| `getById(id)` | `GET /authors/{id}` | | `AuthorWithBookCount` |
| `create(data)` | `POST /authors` | `CreateAuthorDTO` | `AuthorWithBookCount` |
| `update(id, data)` | `PUT /authors/{id}` | `CreateAuthorDTO` | `AuthorWithBookCount` |
| `remove(id)` | `DELETE /authors/{id}` | | `void` (204) |

### `bookService` (`/books`)

| Método | Endpoint | Corpo | Retorno |
| --- | --- | --- | --- |
| `list()` | `GET /books` | | `Book[]` |
| `getById(id)` | `GET /books/{id}` | | `Book` |
| `create(data)` | `POST /books` | `CreateBookDTO` convertido (`publishDate`) | `Book` |
| `update(id, data)` | `PUT /books/{id}` | `CreateBookDTO` convertido (`publishDate`) | `Book` |
| `remove(id)` | `DELETE /books/{id}` | | `void` (204) |

Mapeamento (`toBook` e `toBookRequest`): a API usa `publishDate`; o frontend usa `publicationDate`. A resposta (`BookResponse`) traz `available`, `author` e `genre` com `id` e `name`; o corpo enviado é `{ title, authorId, genreId, publishDate, publisher }`.

### `genreService` (`/genres`)

| Método | Endpoint | Corpo | Retorno |
| --- | --- | --- | --- |
| `list()` | `GET /genres` | | `GenreWithBookCount[]` |
| `getById(id)` | `GET /genres/{id}` | | `GenreWithBookCount` |
| `create(data)` | `POST /genres` | `CreateGenreDTO` | `GenreWithBookCount` |
| `update(id, data)` | `PUT /genres/{id}` | `CreateGenreDTO` | `GenreWithBookCount` |
| `remove(id)` | `DELETE /genres/{id}` | | `void` (204) |

Hoje só `list()` é usado (para o seletor de gênero do formulário de livro). `create`, `update` e `remove` estão prontos, mas não há tela de Gêneros.

### `loanService` (`/lendings`)

O recurso se chama `lendings` na API e `Loan` no frontend.

| Método | Endpoint | Corpo | Retorno |
| --- | --- | --- | --- |
| `list(filters?)` | `GET /lendings` (com `?userId=` e `?status=` quando informados) | | `Loan[]` |
| `getById(id)` | `GET /lendings/{id}` | | `Loan` |
| `create(data)` | `POST /lendings` | `CreateLoanDTO` | `Loan` |
| `returnBook(id, data?)` | `PATCH /lendings/{id}/return` | `ReturnLoanDTO` (`{ returnDate }` opcional) | `Loan` |

Não existe `DELETE` de empréstimo. `LoanFilters` aceita `userId` e `status` (`LoanStatus`), mas a tela de Empréstimos chama `list()` sem filtros e filtra por status no navegador. `toLoan` converte `returnDate` ausente em `null`.

### `userService` (`/users`)

| Método | Endpoint | Corpo | Retorno |
| --- | --- | --- | --- |
| `list()` | `GET /users` | | `User[]` |
| `getById(id)` | `GET /users/{id}` | | `User` |
| `create(data)` | `POST /users` | `CreateUserDTO` | `User` |
| `update(id, data)` | `PUT /users/{id}` | `CreateUserDTO` | `User` |
| `remove(id)` | `DELETE /users/{id}` | | `void` (204) |

O CPF pode ser enviado com ou sem pontuação; o formulário envia só os dígitos (`onlyDigits`). O backend devolve o CPF normalizado, e a tela o exibe formatado (`formatCpf`).

## Para adicionar um novo recurso

1. Crie os tipos (e DTOs) em `src/types`.
2. Crie `src/services/<recurso>Service.ts` usando `api`; faça a conversão de nomes ali, se o backend usar nomes diferentes.
3. Inclua o recurso em `LibraryResource` e em `useLibraryData`, se a tela precisar dele ao abrir.
4. Em `src/App.tsx`, defina quais recursos recarregar depois de cada mutação.
5. Nos formulários, use `handleFormError` e `notifySuccess` de `src/utils/feedback.ts`, e chame `onOutdatedData` quando `isOutdatedDataError` for verdadeiro.
6. Atualize esta página e o `docs/INDEX.md`.
