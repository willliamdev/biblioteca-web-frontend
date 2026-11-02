# Índice da documentação (frontend)

Índice central da documentação do repositório `biblioteca-web-frontend` (React 19, Vite, TypeScript e Mantine), o frontend do sistema de empréstimo de livros. Os links são relativos a esta pasta (`docs/`). Mantenha este arquivo atualizado ao criar, mover ou remover qualquer documento.

Repositório irmão: `library-backend` (API Spring Boot em `../library-backend`), com a própria documentação.

## Visão geral e regras

| Documento | Descrição |
| --- | --- |
| [README.md](../README.md) | Guia do time: pré-requisitos, como rodar com o backend, comandos, telas, Docker, estrutura do projeto, Mantine, contribuição, checklist e modelo de dados. |
| [AGENTS.md](../AGENTS.md) | Regras para agentes de IA (em inglês): visão do projeto, tipos de domínio, acesso a dados via `src/services`, datas, Mantine, estrutura, validação e documentação. |
| [CLAUDE.md](../CLAUDE.md) | Apenas importa o `AGENTS.md` (`@AGENTS.md`) para o Claude Code carregar as mesmas regras. |

## Integração com a API

| Documento | Descrição |
| --- | --- |
| [integracao/api.md](integracao/api.md) | Como o frontend consome a API: base URL e proxy (Vite e Nginx), remoção do header `Origin`, `ApiError` e erros de campo nos formulários, recarga de dados após mutações, API fora do ar e tabela service, endpoint e tipo. |

## Docker

| Documento | Descrição |
| --- | --- |
| [docker/imagem.md](docker/imagem.md) | Imagem de produção (Node e Nginx): Dockerfile, template do Nginx, variáveis `VITE_API_URL`, `API_UPSTREAM` e `NGINX_RESOLVER`, `scripts/build-image.sh`, execução sozinha e com o docker-compose do frontend (rede `biblioteca-net`), validação e problemas comuns. |

## Modelo de dados

| Documento | Descrição |
| --- | --- |
| [der.png](der.png) | Diagrama de Entidade-Relacionamento (Usuário, Empréstimo, Livro, Gênero e Autor). Os tipos do código estão em `src/types` e são descritos no README (seção Modelo de dados). |

## Changelog

| Documento | Descrição |
| --- | --- |
| [changelog/front/2026-10-29-integracao-api-autores-docker.md](changelog/front/2026-10-29-integracao-api-autores-docker.md) | Integração com a API, tela de Autores, devolução com data efetiva, imagem Docker com proxy `/api` e correções da revisão (trabalho de 28 e 29/10/2026). |

## Arquivos de referência (não são documentos)

| Arquivo | Para que serve |
| --- | --- |
| [../Dockerfile](../Dockerfile) | Build da imagem do frontend (Node e Nginx). |
| [../docker-compose.yml](../docker-compose.yml) | Sobe só o frontend, na rede `biblioteca-net` compartilhada com o backend. |
| [../nginx/default.conf.template](../nginx/default.conf.template) | Template do Nginx: SPA, proxy `/api/` e cache. |
| [../scripts/build-image.sh](../scripts/build-image.sh) | Gera a imagem e o `.tar.gz` com checksum. |
| [../.env.example](../.env.example) | Variáveis de ambiente (`VITE_API_URL`, `VITE_PROXY_TARGET`). |
| [../vite.config.ts](../vite.config.ts) | Proxy `/api` do Vite (dev e preview). |
| [../src/types](../src/types) | Tipos de domínio e DTOs (fonte de verdade para o código). |

## Como manter este índice

- Documentação em português, em subpastas por área: `docs/<área>/arquivo.md` (áreas atuais: `integracao`, `docker` e `changelog/front`).
- Toda entrega relevante ganha uma entrada em `docs/changelog/front/AAAA-MM-DD-descricao.md`, com o que mudou, por quê e como validar.
- Todo documento novo entra neste índice, com link relativo e uma linha de descrição.
