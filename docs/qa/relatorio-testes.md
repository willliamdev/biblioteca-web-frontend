# Relatório de testes de QA (front-end)

Resultado da rodada de QA de 16/11/2026 sobre o site (`biblioteca-web-frontend`), na stack Docker (Nginx em `http://localhost:8081`, API em `http://localhost:8080`). Este arquivo traz só os **principais** casos do front. O catálogo completo tem 300 casos: 250 do back e 50 do front. A parte da API está em `library-backend/docs/qa/relatorio-testes.md`.

## Sumário

- [Resumo](#resumo)
- [Como foi testado](#como-foi-testado)
- [Nginx e proxy /api (F001–F025)](#nginx-e-proxy-api-f001f025)
- [Telas no navegador (F026–F050)](#telas-no-navegador-f026f050)
- [Casos que falharam e correções sugeridas](#casos-que-falharam-e-correções-sugeridas)
- [Divergências entre documentação e comportamento](#divergências-entre-documentação-e-comportamento)
- [Outras observações](#outras-observações)

## Resumo

| Item | Resultado |
| --- | --- |
| Casos do front (F001–F050) | **50 executados: 46 OK, 4 falharam** |
| Achados críticos | Nenhum |
| Achados médios | 2: etiquetas de status cortadas em telas médias (F047) e tabela estourada por nome longo (F049) |
| Achados baixos | 2 falhas de boa prática (F024, F025), 3 divergências de documentação e 7 observações |

As telas carregam dados reais, as validações dos formulários funcionam antes de chamar a API, os erros da API aparecem como aviso, e o site se recupera quando a API volta ("Tentar novamente"). O proxy `/api` repassa leitura e escrita, remove o `Origin` e devolve o `Location` com `/api`.

## Como foi testado

- `docker compose up -d --build` no front e no back, na rede `biblioteca-net`. Os dois containers ficaram `healthy`.
- **F001–F025:** requisições HTTP automáticas ao Nginx (headers, cache, gzip, fallback do SPA, proxy).
- **F026–F050:** navegação real num navegador (cliques, formulários, larguras de 375px, ~970px e 1440px, tema escuro, API fora do ar). Os dados de teste criados foram removidos, e o back foi reiniciado no fim (voltou ao seed).

## Nginx e proxy /api (F001–F025)

| # | Caso | Esperado | Obtido | |
| --- | --- | --- | --- | --- |
| F001–F002 | Página inicial abre com título "Biblioteca" | 200 | 200 | ✅ |
| F003 | `index.html` sem cache | `Cache-Control: no-cache` | igual | ✅ |
| F004 | Nginx não expõe a versão | `Server: nginx` | igual | ✅ |
| F005–F007 | JS do build com cache longo e gzip | `max-age=31536000, immutable` + `gzip` | igual | ✅ |
| F008 | Rota desconhecida do site devolve o app (SPA) | 200 + index | igual | ✅ |
| F009 | Asset inexistente não cai no index | 404 | 404 | ✅ |
| F011–F016 | `/api/authors`, `/genres`, `/books`, `/users` e `/lendings` pelo proxy, com a mesma quantidade do back | 200 | 200 | ✅ |
| F017 | Rota inexistente da API pelo proxy | 404 | 404 | ✅ |
| F018 | POST pelo proxy com `Origin` de outra máquina (o proxy remove o header) | 201 | 201 | ✅ |
| F019 | `Location` pelo proxy inclui `/api` | `http://localhost:8081/api/genres/{id}` | igual | ✅ |
| F020–F021 | PUT e DELETE pelo proxy | 200 / 204 | igual | ✅ |
| F022 | Erro 409 chega intacto pelo proxy | 409 | 409 | ✅ |
| F023 | Query string repassada (`?status=ATRASADO`) | 200 | 200 | ✅ |
| F024 | Header `X-Content-Type-Options: nosniff` (boa prática) | presente | ausente | ❌ |
| F025 | Header `X-Frame-Options` (boa prática) | presente | ausente | ❌ |

## Telas no navegador (F026–F050)

| # | Caso | Resultado observado | |
| --- | --- | --- | --- |
| F026 | Dashboard mostra os mesmos totais da API | livros, ativos, atrasados e autores iguais aos da API | ✅ |
| F027 | Menu navega entre as 5 telas | Dashboard, Livros, Autores, Usuários e Empréstimos | ✅ |
| F028 | Livros: linhas e "Emprestado" batem com a API | 24 linhas e 9 emprestados, iguais à API | ✅ |
| F029 | Etiqueta "Sem livros" em autor sem livros | aparece nos 7 autores com `bookCount` 0 | ✅ |
| F030 | Nome `<script>alert(1)</script>` | exibido como texto, nada executado (sem XSS) | ✅ |
| F031 | Excluir autor com livros | aviso "Não foi possível excluir o autor" e nada apagado | ✅ |
| F032 | Cadastrar autor | aparece na lista, com aviso de sucesso e lembrete de cadastrar um livro | ✅ |
| F033 | Nome de autor vazio | "O nome deve ter pelo menos 2 caracteres", sem chamar a API | ✅ |
| F034–F035 | Editar e excluir autor sem livros (com confirmação) | funcionam, com aviso | ✅ |
| F036 | Usuários: CPF formatado e situação de pendência | `123.456.789-01`; pendentes corretos | ✅ |
| F037 | CPF com 10 dígitos | "O CPF deve conter 11 dígitos", sem chamar a API | ✅ |
| F038 | CPF duplicado | aviso "Já existe um usuário cadastrado com este CPF" e formulário continua aberto | ✅ |
| F039–F040 | Novo empréstimo: usuários com pendência desabilitados; só livros disponíveis | iguais à API | ✅ |
| F041 | Registrar empréstimo | criado como ATIVO, com aviso de sucesso | ✅ |
| F042 | Registrar devolução (data padrão = hoje, limitada entre o início e hoje) | status "CONCLUÍDO" e livro disponível de novo | ✅ |
| F043 | Aba "Atrasados" | só empréstimos atrasados | ✅ |
| F044 | Livro com data futura | "A data de lançamento não pode ser futura", sem chamar a API | ✅ |
| F045 | Excluir o último livro de um autor | a confirmação avisa que o autor ficará sem livros | ✅ |
| F046 | Tema escuro | alterna e volta | ✅ |
| F047 | Etiquetas de situação em ~970px | **24 de 24 cortadas** ("EMPRÉ…", "DISPO…") | ❌ |
| F048 | Menu no celular (375px) | abre e fecha | ✅ |
| F049 | Nome longo sem espaços (255 caracteres) | **a tabela fica com 2070px numa área de 956px** | ❌ |
| F050 | API fora do ar | "Não foi possível carregar os dados" + "Tentar novamente"; recarrega quando a API volta | ✅ |

## Casos que falharam e correções sugeridas

| # | Problema | Gravidade | Sugestão de correção |
| --- | --- | --- | --- |
| F047 | Em larguras médias (notebook pequeno, tela dividida), as etiquetas de situação e status ficam truncadas nas telas Livros e Empréstimos ("EMPRÉ…", "ATRASA…", "CONCL…"), e a coluna Ações sai da área visível | Média | Dar largura mínima à coluna de status (`miw`/`w` na `Table.Th`), envolver a tabela em `Table.ScrollContainer` com `minWidth` ou esconder colunas menos importantes (editora, lançamento) abaixo de um breakpoint. Em 1440px tudo cabe. |
| F049 | Um nome sem espaços (por exemplo, 255 letras) estica a tabela de Autores para mais que o dobro da área | Média | Usar `word-break: break-word` / `overflow-wrap: anywhere` nas células de texto, ou truncar com `lineClamp` e mostrar o nome inteiro num `Tooltip`. |
| F024 | Falta o header `X-Content-Type-Options: nosniff` | Baixa | Adicionar `add_header X-Content-Type-Options "nosniff" always;` em `nginx/default.conf.template`. |
| F025 | Falta o header `X-Frame-Options` (proteção contra o site ser embutido em iframe) | Baixa | Adicionar `add_header X-Frame-Options "SAMEORIGIN" always;` ou `Content-Security-Policy: frame-ancestors 'self'`. |

## Divergências entre documentação e comportamento

| # | Divergência | Onde | Gravidade | Sugestão |
| --- | --- | --- | --- | --- |
| D1 | O README diz que, com o back fora do ar, as chamadas `/api` "respondem 502"; com o container do back parado, o proxy respondeu **504** (depois de alguns segundos) | `README.md` (Rodando com Docker) e `docker-compose.yml` | Baixa | Mudar o texto para "502 ou 504". A tela trata os dois casos do mesmo jeito. |
| D2 | O README diz que "o backend **valida os dígitos**" do CPF, mas o back não confere os dígitos verificadores (só exige 11 dígitos) | `README.md`, tabela Telas, linha Usuários | Baixa | Trocar por "o backend confere se há 11 dígitos e recusa CPF repetido". |
| D3 | O front exige no mínimo 2 caracteres no nome do autor, mas a API aceita 1 caractere | `useAuthorForm.ts` × API | Baixa | Alinhar as duas regras (e documentar a escolhida). |

## Outras observações

- **A URL não muda ao trocar de tela.** Ela fica sempre em `/`: o F5 volta ao Dashboard e não dá para compartilhar o link de uma tela. Sugestão: usar rotas (`/livros`, `/autores`...).
- **O botão do menu no celular não tem nome acessível** (`aria-label`), então um leitor de tela anuncia só "botão". Sugestão: `aria-label="Abrir menu"`.
- **O exemplo do campo CPF é o CPF da Ana, do seed** (`123.456.789-01`). Quem copiar o exemplo recebe "CPF já cadastrado". Sugestão: `000.000.000-00`.
- **A confirmação de exclusão de livro não avisa se o livro tem histórico de empréstimo,** e nesse caso a API vai recusar com 409. Sugestão: avisar antes, ou esconder o botão quando houver histórico.
- **Texto do Dashboard:** "Bem vindo" deveria ser "Bem-vindo". "exemplares cadastrados" pode confundir, porque cada livro é um exemplar único.
- **Build:** o Vite avisa que o arquivo JS passa de 500 kB. Sugestão: dividir o código por tela (`React.lazy`).
- **Nomes repetidos vindos da API** (dois "Machado de Assis", dois "Romance") aparecem lado a lado nas listas e nos seletores. A correção sugerida é no back (ver o relatório do back, B064/B093).
