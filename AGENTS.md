
# Project Guidelines for AI Agents

These instructions apply to AI assistants working on the Biblioteca Web Frontend repository.

## Project overview

- **Type:** Library lending system and librarian dashboard.
- **Stack:** React 19, Vite, TypeScript, Mantine UI 9, Day.js and Docker/Nginx.
- **Scope:** Books, authors, genres, users/students and loans.
- **Domain reference:** `docs/der.png` describes the relationships, but the TypeScript files in `src/types/` are the source of truth for frontend code.

## Mandatory rules

### Naming and language

- Names of variables, functions, components, interfaces, types and new files must be in English.
- User-facing labels, messages and notifications must be in Brazilian Portuguese.
- Preserve existing names in `src/services/mockData.ts` unless a rename is explicitly requested; current mock exports use Portuguese names.

### TypeScript

- `erasableSyntaxOnly` is enabled. Do not use `enum`, parameter properties or other TypeScript syntax that emits runtime code. Use string literal unions and `as const` objects instead.
- Do not use `any` when a real type can be defined.
- Reuse or add shared domain types in `src/types/` instead of duplicating interfaces.
- Use `import type` for type-only imports when appropriate.

### Domain types

The current types are the source of truth:

- `User`: `id`, `name`, `cpf` and `debtFree`.
- `Author` and `Genre`: `id` and `name`.
- `Book`: `id`, `title`, `author`, `genre`, `publicationDate` and `publisher`.
- `Loan`: `id`, `startDate`, `endDate`, `user`, `book` and `status`.
- `CreateBookDTO` and `CreateLoanDTO` are the current creation DTO names. Do not invent `CreateLoanPayload` unless the codebase is intentionally changed.
- Loan statuses currently use the literal values `'ATIVO'`, `'CONCLUIDO'` and `'ATRASADO'`.

### Dates

- Dates in APIs and mock data must use ISO strings in the `YYYY-MM-DD` format.
- Use Day.js for UI formatting, normally as `DD/MM/YYYY`.
- Do not use localized display strings as the source of truth.

### Mantine and styling

- Use Mantine UI 9 components from `@mantine/core` for layouts and common UI.
- Prefer Mantine props such as `m`, `p`, `gap`, `mt`, `mb`, `Stack`, `Group` and `Grid` for simple layouts.
- Do not create raw CSS or CSS modules for simple spacing and layout.
- Keep `@mantine/core/styles.css` and `@mantine/dates/styles.css` loaded in `src/main.tsx`.
- The icon library and visual language have not been decided. Do not add an icon package or select an icon system without an explicit project decision.

## Project structure

- `src/App.tsx`: main application component.
- `src/main.tsx`: React entry point, `MantineProvider`, Day.js locale and global Mantine styles.
- `src/services/`: services and temporary mock data. The current mock file is `src/services/mockData.ts`.
- `src/types/`: shared domain types and DTOs.
- `src/assets/`: assets imported by source code.
- `docs/`: documentation and project assets, including the DER image.
- `public/`: static files served directly by Vite.
- Create `src/components/` or `src/pages/` only when the feature needs those folders; they are not currently present.

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

There is currently no automated test framework configured. Validate changed behavior manually in the browser as well.

For changes that affect the production bundle, validate Docker when available:

```bash
docker build -t biblioteca-web-frontend .
docker run --rm -p 8080:80 biblioteca-web-frontend
```

When reporting the result, summarize what changed, which checks passed and any remaining limitation.
