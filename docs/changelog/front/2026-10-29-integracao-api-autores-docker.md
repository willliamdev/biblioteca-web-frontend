# 2026-10-29: Integração com a API, tela de Autores e imagem Docker

Trabalho desenvolvido entre 28 e 29/10/2026 na branch `feat/integracao-api` (alterações ainda não commitadas na data desta entrada). Passa o frontend de dados mockados para a API REST do backend `library-backend`, cria a tela de Autores e a imagem Docker de produção.

## Por que

O frontend rodava com dados fixos de `src/services/mockData.ts`, sem persistência. Com o backend pronto (Spring Boot, H2 em memória, endpoints REST), o frontend passou a ler e gravar dados reais, a cobrir o ciclo completo de empréstimo (inclusive devolução) e a ser entregue como imagem Docker, sozinha ou junto com o backend no `docker-compose.yml` do repositório `library-backend`.

## O que mudou

### Integração com a API

- Nova camada `src/services`: `api.ts` (cliente HTTP com `ApiError`, mensagens em português e detecção de API fora do ar) e um service por recurso (`authorService`, `bookService`, `genreService`, `loanService`, `userService`). A conversão entre o formato do backend e o do frontend fica nos services: `publishDate` <-> `publicationDate` nos livros e o recurso `/lendings` como `Loan`.
- `src/hooks/useLibraryData.ts`: carrega os cinco recursos ao abrir o app e recarrega só o que a mutação afetou (`refresh`). Descarta respostas antigas quando duas atualizações se sobrepõem.
- `src/utils/feedback.ts`: avisos de sucesso e erro e envio dos erros de campo da API (`fields`) para os formulários. `src/utils/format.ts`: datas ISO <-> `DD/MM/YYYY` e CPF.
- Proxy `/api` no `vite.config.ts` (dev e preview), com destino em `VITE_PROXY_TARGET` e remoção do header `Origin`. Novos `.env.example` e `src/vite-env.d.ts`.
- `mockData.ts` foi mantido sem alterações, apenas como referência, e não é mais importado.
- Detalhes: [`../../integracao/api.md`](../../integracao/api.md).

### Telas

- **Livros**: dados da API (antes `mockLivros` em estado local), seletores de autor (antes um campo de texto) e de gênero, coluna Situação (Disponível ou Emprestado) e exclusão com confirmação que avisa quando o livro é o último do autor.
- **Autores (nova)**: lista com quantidade de livros, cadastro, edição e exclusão. Autor sem livros mostra a etiqueta "Sem livros" (regra do acervo: Livro 1..* para 1 Autor), sem bloquear o cadastro.
- **Usuários**: antes só o título e o botão de cadastro; agora lista, cadastro, edição e exclusão, com CPF formatado e situação (Sem pendências ou Com pendências).
- **Empréstimos**: antes só o título; agora lista com filtro por status, novo empréstimo (só livros disponíveis; usuários com pendências desabilitados) e devolução.
- **Dashboard**: cartões e totais calculados com dados reais (antes `mockDashboardStatsData`).
- Tipos novos em `src/types`: `AuthorWithBookCount`, `GenreWithBookCount`, `CreateAuthorDTO`, `CreateGenreDTO`, `CreateUserDTO`, `ReturnLoanDTO`, `Book.available` e `Loan.returnDate`.

### Docker

- `Dockerfile` reescrito: build com `node:22-alpine` e execução em `nginx:1.30-alpine`, com `ARG VITE_API_URL` (padrão `/api`) e healthcheck.
- `nginx/default.conf.template`: serve o SPA (fallback para `index.html`, cache longo em `/assets/`), faz proxy de `/api/` para `API_UPSTREAM` removendo o prefixo e o header `Origin`. Variáveis `API_UPSTREAM` e `NGINX_RESOLVER`.
- `scripts/build-image.sh`: gera a imagem e salva `images/<nome>_<tag>.tar.gz` com `.sha256`.
- `.dockerignore`, `.gitignore` (`images/`) e `.gitattributes` (`*.sh text eol=lf`) ajustados.
- A stack completa (backend + frontend) sobe pelo `docker-compose.yml` do repositório `library-backend`.
- Detalhes: [`../../docker/imagem.md`](../../docker/imagem.md).

### Documentação

`README.md` e `AGENTS.md` atualizados, `CLAUDE.md` criado (apenas importa o `AGENTS.md`), e novos `docs/integracao/api.md`, `docs/docker/imagem.md` e `docs/INDEX.md`.

## Correções da revisão do dia 29/10

Depois da integração, uma revisão apontou problemas. Foram corrigidos:

| Problema | Correção |
| --- | --- |
| O Nginx repassava o header `Origin` ao backend: escritas por origem não liberada no CORS (ex.: `http://127.0.0.1:8081`) davam 403 | `proxy_set_header Origin "";` em `location /api/` (igual ao que o `vite.config.ts` já fazia) |
| Scripts `.sh` podiam ser extraídos com CRLF (ex.: Git no Windows) e quebrar no Linux e no WSL | `.gitattributes` com `*.sh text eol=lf` |
| Autor sem livros ficava invisível na tela, contra a regra Livro 1..* para 1 Autor | Etiqueta "Sem livros" com explicação na lista de autores; aviso no confirm ao excluir o último livro do autor; orientação no aviso ao cadastrar um autor |
| A devolução sempre gravava a data de hoje | Modal "Registrar Devolução" com a data efetiva (padrão hoje, entre o início do empréstimo e hoje), enviada em `PATCH /lendings/{id}/return` |
| Empréstimo com início futuro deixava o livro bloqueado sem como devolver | O formulário recusa início futuro (`max` no campo e validação). Como a devolução aceita data retroativa, um início errado no passado se corrige pela tela |
| 404 e 409 em exclusões e formulários deixavam a tela desatualizada | Esses erros agora recarregam os recursos afetados (`isOutdatedDataError` e `onOutdatedData`) |
| Respostas antigas de `refresh` podiam sobrescrever as novas, e a devolução tinha um único indicador de "em andamento" | `refresh` ignora resposta antiga por recurso; a devolução, agora em modal, usa o `submitting` do formulário |
| `COPY . .` no Dockerfile invalidava o cache do `npm run build` a cada mudança em `nginx/`, `docs/` ou configs | O estágio de build copia só `index.html`, configs do Vite/TypeScript, `public/` e `src/` |

### Decisões e itens rejeitados

- O formulário de empréstimo não limita a "Devolução prevista" a hoje no frontend (só exige que seja igual ou posterior ao início), para permitir registro histórico (início e fim no passado). O backend atual, porém, recusa devolução prevista anterior a hoje (400 em `endDate`); o frontend mostra essa mensagem no campo. Alinhar a regra no formulário é uma melhoria possível.
- Não foi definido limite mínimo para a data de início: a validação de datas retroativas é do backend (data de publicação do livro e última devolução).

## Pendências e limitações conhecidas

- **Sem tela de Gêneros**: `genreService` tem o CRUD completo, mas nenhuma tela o usa; o catálogo fica nos gêneros do seed. Sugestão: `GenresPage` e `GenreFormModal`/`useGenreForm` espelhando Autores, com recursos `['genres', 'books', 'loans']` e item no menu. Se a equipe preferir não ter a tela, registrar como desvio do escopo.
- **Atualização falha**: se duas atualizações do mesmo recurso se sobrepõem e a mais nova falha, a resposta antiga descartada não é reaproveitada; a tela fica como estava, com o aviso "Não foi possível atualizar os dados", até a próxima ação.
- **Bug anterior à integração, não corrigido**: com `defaultColorScheme="auto"` e o sistema em modo escuro, o botão do rodapé mostra "Tema escuro" em vez de "Tema claro" (o texto só considera `colorScheme === 'dark'`).
- **Comentário desatualizado em `src/services/api.ts`**: ele diz que o proxy do Vite responde 500 com o backend parado; com o Vite 8 a resposta é 502 sem corpo. O comportamento está correto (502 também vira "API fora do ar"), apenas o comentário não foi atualizado.

## Como validar

Checagens de código (na raiz do frontend):

```bash
npm run format
npm run lint
npm run build
```

Com o backend (`cd ../library-backend && mvn spring-boot:run`) e o frontend (`npm run dev`, porta 5173):

1. As cinco telas carregam com dados do seed; derrubar o backend e recarregar mostra "Não foi possível carregar os dados" com "Tentar novamente".
2. Autores: cadastrar um autor novo mostra o aviso com a orientação e a etiqueta "Sem livros" amarela na lista.
3. Livros: excluir o último livro de um autor mostra o aviso no confirm, e o autor passa a "Sem livros".
4. Empréstimos: registrar a devolução de um empréstimo atrasado com uma data passada (ex.: a do prazo) conclui o empréstimo com essa data em "Devolvido em".
5. Empréstimos: início futuro é bloqueado no formulário.
6. Exclusões desatualizadas: excluir pelo backend (ou outra aba) um livro ainda listado e tentar excluí-lo na tela mostra a mensagem do backend (404) e a linha some da lista; excluir um autor que ganhou livros em outra aba mostra o 409 e a lista recarrega com a contagem nova.

Imagem Docker (veja [`../../docker/imagem.md`](../../docker/imagem.md)):

```bash
docker build -t biblioteca-web-frontend .
cd ../library-backend && docker compose up -d --build
curl -i http://localhost:8081/api/genres
```

## Validação executada

- `npm run format`, `npm run lint` (zero erros) e `npm run build` verdes após a última alteração de código.
- Testes manuais no navegador contra o backend isolado: aviso e etiqueta de autor sem livros, bloqueio de início futuro, devolução retroativa, 404 e 409 com recarga das listas e confirm de exclusão do último livro do autor.
- Imagem Docker: `nginx -t` com o template processado, remoção do header `Origin` confirmada com um servidor de eco atrás do proxy, cache do passo `npm run build` mantido ao alterar só o template, `/` e rota inexistente respondendo 200.
- Documentação (29/10/2026): comandos de `docs/docker/imagem.md` e do README executados (rede Docker com backend e frontend, `API_UPSTREAM` com o IP do gateway da bridge, `scripts/build-image.sh` com checksum e `docker load`, `VITE_PROXY_TARGET` com o Vite em desenvolvimento, 502 com backend parado).

## Arquivos

Alterados: `.dockerignore`, `.gitignore`, `Dockerfile`, `vite.config.ts`, `src/App.tsx`, `src/components/BookFormModal.tsx`, `src/components/StatusContainer.tsx`, `src/components/UserFormModal.tsx`, `src/components/useBookForm.ts`, `src/components/useUserForm.ts`, `src/pages/BooksPage.tsx`, `src/pages/DashboardPage.tsx`, `src/pages/LoansPage.tsx`, `src/pages/UsersPage.tsx`, `src/types/book.ts`, `src/types/loan.ts`, `src/types/user.ts`, `README.md` e `AGENTS.md`.

Novos: `.env.example`, `.gitattributes`, `CLAUDE.md`, `nginx/default.conf.template`, `scripts/build-image.sh`, `src/vite-env.d.ts`, `src/services/*` (exceto `mockData.ts`), `src/hooks/useLibraryData.ts`, `src/utils/*`, `src/pages/AuthorsPage.tsx`, `src/pages/TableRow.module.css`, `src/components/` (`AuthorFormModal`, `LoanFormModal`, `ReturnLoanModal` e os hooks `useAuthorForm`, `useLoanForm`, `useReturnLoanForm`) e `docs/` (`INDEX.md`, `integracao/api.md`, `docker/imagem.md` e este arquivo).
