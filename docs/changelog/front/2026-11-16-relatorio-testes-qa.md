# 2026-11-16: Relatório de testes de QA

Inclusão do relatório da rodada de QA de 16/11/2026, na branch `docs/relatorio-testes-qa`. É só documentação: nenhum arquivo de código, configuração ou dependência foi alterado.

## Por que

Registrar os testes feitos no site e no proxy `/api` (rodando com Docker, contra o backend real), com as falhas encontradas e as correções sugeridas, para o time decidir o que corrigir.

## O que mudou

- Novo [`../../qa/relatorio-testes.md`](../../qa/relatorio-testes.md): 50 casos do front (25 de Nginx e proxy, 25 de telas no navegador). 46 deram OK e 4 falharam: etiquetas cortadas em larguras médias, tabela estourada por nome longo e dois headers de segurança ausentes. O relatório também lista as divergências de documentação e observações de usabilidade e acessibilidade.
- `docs/INDEX.md`: nova seção "Qualidade (QA)" e esta entrada de changelog.
- A parte da API (250 casos) está no repositório `library-backend`, em `docs/qa/relatorio-testes.md`.

## Como validar

Abrir `docs/qa/relatorio-testes.md` e conferir os links do `docs/INDEX.md`. Para repetir os testes de tela, suba as duas stacks com `docker compose up -d --build` (rede `biblioteca-net`) e siga os casos F026–F050 em `http://localhost:8081`.
