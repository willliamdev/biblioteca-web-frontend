
# Project Guidelines for AI Agents

These instructions apply to AI assistants working on the Biblioteca Web Frontend repository.

## Project overview

- **Type:** Library lending system and librarian dashboard.
- **Stack:** React 19, Vite, TypeScript, Mantine UI 9, Day.js and Docker/Nginx.
- **Scope:** Books, authors, genres, users/students and loans. The UI has screens for the dashboard, books, authors, users and loans; there is no genres screen yet (genres only feed the book form selects).
- **Data source:** the REST API of the sibling repository `library-backend` (Spring Boot, port 8080), reached through the `/api` proxy (Vite in development, Nginx in the Docker image). The frontend does not use mock data at runtime.
- **Domain reference:** `docs/der.png` describes the relationships, but the TypeScript files in `src/types/` are the source of truth for frontend code.
- **Documentation:** start at `docs/INDEX.md`. API integration is in `docs/integracao/api.md` and the Docker image in `docs/docker/imagem.md`.

## Mandatory rules

### Naming and language

- Names of variables, functions, components, interfaces, types and new files must be in English.
- User-facing labels, messages and notifications must be in Brazilian Portuguese.
- Preserve existing names in `src/services/mockData.ts` unless a rename is explicitly requested; current mock exports use Portuguese names. That file is kept only as a reference: no application code imports it, and new code must not import it either (see "Data access").

### TypeScript

- `erasableSyntaxOnly` is enabled. Do not use `enum`, parameter properties or other TypeScript syntax that emits runtime code. Use string literal unions and `as const` objects instead.
- Do not use `any` when a real type can be defined.
- Reuse or add shared domain types in `src/types/` instead of duplicating interfaces.
- Use `import type` for type-only imports when appropriate.

### Domain types

The current types are the source of truth:

- `User`: `id`, `name`, `cpf` and `debtFree` (`false` when the user has an overdue loan).
- `Author` and `Genre`: `id` and `name`.
- `AuthorWithBookCount` and `GenreWithBookCount`: `Author`/`Genre` plus `bookCount`. They are the format returned by the author and genre listings (`authorService` and `genreService`).
- `Book`: `id`, `title`, `author`, `genre`, `publicationDate`, `publisher` and `available`. The API always fills `available` (`true` when the book has no open loan); it is optional in the type only to keep `src/services/mockData.ts` valid.
- `Loan`: `id`, `startDate`, `endDate`, `returnDate`, `user`, `book` and `status`. `returnDate` is the effective return date (`string | null`, `null` until the book is returned); the API always fills it, and it is optional in the type only for `mockData.ts`.
- Creation DTOs: `CreateBookDTO`, `CreateAuthorDTO`, `CreateGenreDTO`, `CreateUserDTO` and `CreateLoanDTO`. Do not invent `CreateLoanPayload` unless the codebase is intentionally changed.
- `ReturnLoanDTO`: optional `returnDate`; without it the API registers the return with today's date.
- Loan statuses currently use the literal values `'ATIVO'`, `'CONCLUIDO'` and `'ATRASADO'` (`LoanStatus`). The backend derives the status from the dates; the frontend only displays it.
- API-only shapes (`BookResponse`, the lending response and the book request) are details of the services layer (`bookService.ts` and `loanService.ts`) and stay there instead of `src/types/`.

### Data access (API)

- Application data comes from the API through `src/services/`. All HTTP goes through `src/services/api.ts` (`api.get`, `api.post`, `api.put`, `api.patch` and `api.delete`), with one service per resource: `authorService`, `bookService`, `genreService`, `loanService` and `userService`.
- Components, pages and hooks must never call `fetch` directly. They call a service.
- The mapping between the backend format and the frontend types lives in the services, not in components. Currently: `bookService` maps `publishDate` (API) to/from `publicationDate` (frontend), and `loanService` maps the `/lendings` resource to the `Loan` type. Keep the frontend type names from `src/types/`.
- The API base URL comes from `VITE_API_URL` (default `/api`). Do not hardcode hosts or ports in code. The proxy removes the `/api` prefix and the `Origin` header (see `vite.config.ts` and `nginx/default.conf.template`); keep that behavior in both places.
- Errors from the API are `ApiError` (`status`, `message` and `fields`). Messages from the API are already in Portuguese. Use `getErrorMessage` to get a user message and `isOutdatedDataError` (404/409) to detect stale data, which must trigger a data refresh.
- Notifications use `notifySuccess` and `notifyError`, and form submit errors use `handleFormError` (it puts the API `fields` on the form inputs). All of them are in `src/utils/feedback.ts`; do not call `notifications.show` elsewhere. If a form field has a different name in the API, pass an alias map (see `BOOK_FIELD_ALIASES` in `bookService.ts`).
- `src/hooks/useLibraryData.ts` loads all resources when the app opens and exposes `refresh(resources)`. After each mutation, refresh only the affected resources (see `BOOK_RESOURCES`, `AUTHOR_RESOURCES`, `USER_RESOURCES` and `LOAN_RESOURCES` in `src/App.tsx`).
- Business rules (loan status, `debtFree`, `available`, CPF validation, overdue blocking) belong to the backend. The frontend only mirrors simple validations for usability and shows the API messages.
- `src/services/mockData.ts` is kept only as a reference and is not imported. Do not import it, and do not use it to fake API data.

### Dates

- Dates in APIs and mock data must use ISO strings in the `YYYY-MM-DD` format.
- Use Day.js for UI formatting, normally as `DD/MM/YYYY`. `formatDate`, `todayIso` and `addDaysIso` in `src/utils/format.ts` already do this.
- Do not use localized display strings as the source of truth.

### Mantine and styling

- Use Mantine UI 9 components from `@mantine/core` for layouts and common UI.
- Prefer Mantine props such as `m`, `p`, `gap`, `mt`, `mb`, `Stack`, `Group` and `Grid` for simple layouts.
- Do not create raw CSS or CSS modules for simple spacing and layout. The two existing CSS modules (`BooksPage.module.css` and `TableRow.module.css`) only implement the hover effect that reveals the row actions.
- Keep `@mantine/core/styles.css` and `@mantine/dates/styles.css` loaded in `src/main.tsx`.
- The icon library and visual language have not been decided. Do not add an icon package or select an icon system without an explicit project decision.

## Project structure

- `src/App.tsx`: main application component (`AppShell`, navigation between screens, form modals and delete flow).
- `src/main.tsx`: React entry point, `MantineProvider`, notifications, Day.js locale and global Mantine styles.
- `src/pages/`: one page component per screen (`DashboardPage`, `BooksPage`, `AuthorsPage`, `UsersPage` and `LoansPage`), plus the CSS modules for row hover actions.
- `src/components/`: form modals (`BookFormModal`, `AuthorFormModal`, `UserFormModal`, `LoanFormModal` and `ReturnLoanModal`), each one next to its form hook (`useBookForm`, `useAuthorForm`, `useUserForm`, `useLoanForm` and `useReturnLoanForm`), plus `GenericModal`, `StatsCard` and `StatusContainer`.
- `src/hooks/`: `useLibraryData.ts`, which loads and refreshes the API data.
- `src/services/`: the API layer: `api.ts` (HTTP client, `ApiError`, error helpers) and one service per resource. `mockData.ts` is a leftover reference, not imported.
- `src/types/`: shared domain types and DTOs (`book.ts`, `loan.ts` and `user.ts`).
- `src/utils/`: `feedback.ts` (notifications and API field errors in forms) and `format.ts` (dates and CPF).
- `src/vite-env.d.ts`: types for `import.meta.env` (`VITE_API_URL`).
- `src/assets/`: assets imported by source code. The folder does not exist yet; create it when needed.
- `docs/`: documentation (in Portuguese, grouped by area, indexed in `docs/INDEX.md`) and project assets, including the DER image.
- `public/`: static files served directly by Vite.
- `nginx/default.conf.template`, `Dockerfile` and `scripts/build-image.sh`: production image (Nginx serving the SPA and proxying `/api`). Details in `docs/docker/imagem.md`.
- `vite.config.ts` and `.env.example`: dev/preview proxy (`VITE_PROXY_TARGET`) and environment variables.
- Create new folders under `src/` only when a feature needs them.

## Working rules for AI

- Inspect relevant files before editing and follow existing patterns.
- Make the smallest change that solves the request. Preserve unrelated user changes.
- Prefer existing dependencies over adding packages.
- Do not change dependency versions, global configuration or folder structure without explaining why.
- Do not add secrets, credentials, tokens or private data.
- Do not leave unused imports, debug `console.log` calls or placeholder code in a finished change.
- Do not claim validation that was not actually run.

## Validation

After code changes, run the relevant checks:

```bash
npm run format
npm run lint
npm run build
```

There is currently no automated test framework configured. Validate changed behavior manually in the browser as well, against the real backend (`library-backend` on port 8080, then `npm run dev`), including the error state with the API stopped.

Use a Node.js version supported by Vite 8 and ESLint 10 (20.19+, or 22.13+ on the 22 line; the Docker image uses `node:22-alpine`).

For changes that affect the production bundle, validate Docker when available. Port 8080 belongs to the backend, so publish the frontend on another port and point the proxy to a reachable backend (see `docs/docker/imagem.md`):

```bash
docker build -t biblioteca-web-frontend .
docker run --rm -p 8081:80 -e API_UPSTREAM=http://<backend-host>:8080 biblioteca-web-frontend
```

This repository has its own `docker-compose.yml`, which starts only the frontend. The backend has its own compose in the `library-backend` repository; the two containers stay separate and reach each other through the external Docker network `biblioteca-net` (`docker network create biblioteca-net`, once). Do not make one repository build the other.

## Documentation

- Write documentation in Brazilian Portuguese, in `docs/<area>/` subfolders (current areas: `integracao`, `docker` and `changelog/front`).
- After finishing a task, ask the project owner before documenting. When documenting, update or create the area doc, add a changelog entry named `docs/changelog/front/YYYY-MM-DD-description.md` and update `docs/INDEX.md` with the new links.
- Check commands and facts against the current code before writing them down.
- Never bump versions in `package.json` (the project owner decides versions).

When reporting the result, summarize what changed, which checks passed and any remaining limitation.
