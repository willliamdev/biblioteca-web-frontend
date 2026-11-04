# Imagem Docker do frontend

A imagem `biblioteca-web-frontend` entrega o SPA já compilado em um Nginx e faz o proxy de `/api/` para o backend `library-backend`. Os comandos desta página foram executados e conferidos em 29/10/2026 (Docker Engine no WSL Ubuntu).

## Resumo

| Item | Valor |
| --- | --- |
| Arquivos | `Dockerfile`, `nginx/default.conf.template`, `.dockerignore`, `scripts/build-image.sh` |
| Estágio de build | `node:22-alpine` (`npm ci` e `npm run build`) |
| Estágio final | `nginx:1.30-alpine`, porta 80 |
| Proxy | `/api/...` vai para `API_UPSTREAM` sem o prefixo `/api` e sem o header `Origin` |
| Variável de build | `VITE_API_URL` (padrão `/api`) |
| Variáveis de execução | `API_UPSTREAM`, `NGINX_RESOLVER` |
| Healthcheck | `wget` em `http://127.0.0.1/` a cada 15 s |
| Tamanho observado | cerca de 63 MB (imagem) e 25 MB (`.tar.gz`) |

## Dockerfile

### Estágio 1: build (`node:22-alpine`)

1. Copia `package.json` e `package-lock.json` e roda `npm ci --no-audit --no-fund`, com cache do npm (`--mount=type=cache`, que exige BuildKit). Enquanto o lockfile não mudar, essa camada vem do cache.
2. Copia só o que o build usa: `index.html`, `vite.config.ts`, `postcss.config.cjs`, `tsconfig*.json`, `public/` e `src/`. Por isso, mudar `nginx/`, `docs/`, ESLint ou Prettier não invalida o cache do `npm run build`.
3. Define `ARG VITE_API_URL=/api` e o repassa como variável de ambiente para o build, que a embute no bundle.
4. Roda `npm run build` (`tsc -b && vite build`), gerando `/app/dist`.

### Estágio 2: Nginx (`nginx:1.30-alpine`)

1. Remove o `conf.d/default.conf` padrão.
2. Copia `nginx/default.conf.template` para `/etc/nginx/templates/default.conf.template`. O entrypoint oficial da imagem Nginx roda o `envsubst` nos arquivos dessa pasta e grava o resultado em `/etc/nginx/conf.d/default.conf` a cada inicialização do container.
3. Copia o `dist` do estágio 1 para `/usr/share/nginx/html`.
4. Define os padrões de `API_UPSTREAM`, `NGINX_RESOLVER` e `NGINX_ENVSUBST_FILTER` (veja abaixo), expõe a porta 80 e inicia `nginx -g "daemon off;"`.

O `.dockerignore` deixa fora do contexto `node_modules`, `dist`, `.git`, `README.md`, `.env*`, `images/`, `scripts/`, `docs/`, `.github/` e arquivos de editor. Como `.env*` fica de fora, a URL da API da imagem só muda pelo argumento de build `VITE_API_URL`, nunca por um `.env.local`.

## Variáveis

| Variável | Quando | Padrão | O que faz |
| --- | --- | --- | --- |
| `VITE_API_URL` | Build (`--build-arg`) | `/api` | URL base da API embutida no bundle. Mantenha `/api` para usar o proxy do Nginx; use uma URL absoluta só se a API ficar em outro host (nesse caso o backend precisa liberar a origem no CORS). |
| `API_UPSTREAM` | Execução (`-e`) | `http://library-backend:8080` | Destino do proxy `/api/`. Sem barra no final. |
| `NGINX_RESOLVER` | Execução (`-e`) | `127.0.0.11` | Servidor DNS que o Nginx usa para resolver o nome do `API_UPSTREAM` a cada requisição (cache de 30 s). `127.0.0.11` é o DNS embutido do Docker. |
| `NGINX_ENVSUBST_FILTER` | Execução | `API_UPSTREAM\|NGINX_RESOLVER` | Limita o `envsubst` a essas duas variáveis, para não trocar as variáveis do próprio Nginx (`$uri`, `$host`...). Não altere. |

## Template do Nginx (`nginx/default.conf.template`)

- **Proxy de `/api/`**: o `rewrite ^/api/(.*)$ /$1 break;` remove o prefixo (`/api/books?x=1` chega ao backend como `/books?x=1`). O destino fica em uma variável (`set $api_upstream ${API_UPSTREAM};`) com `resolver ${NGINX_RESOLVER} valid=30s ipv6=off;`, então o Nginx sobe mesmo que o backend ainda não exista, e o nome é resolvido a cada requisição.
- **Headers para o backend**: `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Forwarded-Host` e `X-Forwarded-Prefix: /api`. O backend usa `server.forward-headers-strategy=framework` para montar o `Location` dos 201 com a URL pública.
- **Header `Origin` removido** (`proxy_set_header Origin "";`): evita o 403 "Invalid CORS request" nas escritas quando o frontend é acessado por uma origem não liberada no CORS do backend (ex.: `http://127.0.0.1:8081` ou o IP da rede). O motivo completo está em [`../integracao/api.md`](../integracao/api.md).
- **Timeouts**: conexão 5 s, leitura 60 s.
- **Estáticos**: `/assets/` (arquivos do Vite, com hash no nome) com `Cache-Control: public, max-age=31536000, immutable`; `/index.html` com `no-cache`, para o navegador pegar o deploy novo.
- **Fallback do SPA**: qualquer outra rota devolve `index.html` (`try_files $uri $uri/ /index.html`).
- **Compressão** gzip para texto, CSS, JavaScript, JSON e SVG, e `server_tokens off`.

### Resolução do nome do backend

O nome padrão `library-backend` só existe em uma rede Docker criada pelo usuário (o compose cria uma) onde haja um container com esse nome ou alias. Na rede `bridge` padrão do Docker o DNS `127.0.0.11` não existe e o nome não resolve: `/api/...` responde 502 e a tela mostra "Não foi possível carregar os dados". Para backend fora do Docker, informe `API_UPSTREAM` com um IP literal (o DNS não é consultado nesse caso). Para um nome DNS externo, ajuste também `NGINX_RESOLVER` para o IP de um DNS que o resolva.

## Gerar a imagem

### Direto com o Docker

```bash
docker build -t biblioteca-web-frontend .
```

Com outra URL da API embutida (raro; o padrão `/api` é o recomendado):

```bash
docker build --build-arg VITE_API_URL=/api -t biblioteca-web-frontend .
```

### Com `scripts/build-image.sh`

O script builda a imagem, aplica as tags e salva o `.tar.gz` com o checksum, para levar a imagem a outra máquina. Pode ser executado de qualquer pasta (ele sempre parte da raiz do repositório).

```bash
scripts/build-image.sh            # tag automática (git describe --always --dirty, ou "dev") e latest
scripts/build-image.sh 1.0.0      # tag explícita
scripts/build-image.sh --help     # ajuda
```

| Variável | Padrão | O que faz |
| --- | --- | --- |
| `TAG` | `git describe --always --dirty` (ou `dev`) | Tag da imagem; o argumento tem prioridade. A imagem também recebe `latest`. |
| `IMAGE_NAME` | `biblioteca-web-frontend` | Nome da imagem. |
| `OUTPUT_DIR` | `<repo>/images` | Pasta de saída (`images/` é ignorada pelo Git). |
| `VITE_API_URL` | (vazio: usa o padrão do Dockerfile, `/api`) | Repassada como `--build-arg`. |

Saída:

```text
images/biblioteca-web-frontend_<TAG>.tar.gz          imagem salva (name:TAG e name:latest)
images/biblioteca-web-frontend_<TAG>.tar.gz.sha256   checksum
```

Para conferir e carregar em outra máquina:

```bash
cd images
sha256sum -c biblioteca-web-frontend_<TAG>.tar.gz.sha256
docker load -i biblioteca-web-frontend_<TAG>.tar.gz
```

O script também grava labels OCI na imagem (versão, data de criação e, quando há git, a revisão). Os scripts `.sh` precisam estar com finais de linha LF (regra `*.sh text eol=lf` no `.gitattributes`); com CRLF eles falham com "bad interpreter".

## Rodar o container

### Sozinho, junto com o backend em container (mesma rede)

```bash
docker network create biblioteca-net
docker run -d --name library-backend --network biblioteca-net library-backend:latest
docker run --rm --network biblioteca-net -p 8081:80 biblioteca-web-frontend
```

O nome `library-backend` é o padrão de `API_UPSTREAM`, então nenhuma variável é necessária. Abra `http://localhost:8081`. Para limpar: `docker rm -f library-backend` e `docker network rm biblioteca-net`.

### Sozinho, com o backend rodando fora do Docker (porta 8080 da máquina)

Aponte o proxy para o IP da máquina. No Linux, o IP do host visto pelo container na rede padrão é o gateway da bridge, normalmente `172.17.0.1`:

```bash
docker network inspect bridge -f '{{(index .IPAM.Config 0).Gateway}}'
docker run --rm -p 8081:80 -e API_UPSTREAM=http://172.17.0.1:8080 biblioteca-web-frontend
```

O backend precisa aceitar conexões em todas as interfaces (o padrão do Spring) e a porta 8080 não pode estar bloqueada por firewall. Fora do Linux, use o IP da máquina na rede. A porta 8080 é a do backend, por isso o frontend é publicado na 8081.

### Com o docker-compose

O `docker-compose.yml` deste repositório sobe só o frontend (o backend tem o próprio compose, no repositório `library-backend`). Os dois containers se enxergam pela rede Docker `biblioteca-net`, declarada como externa nos dois compose e criada uma vez:

```bash
docker network create biblioteca-net
docker compose up -d --build   # builda a imagem e sobe o frontend
docker compose up -d           # reaproveita a imagem existente (ex.: carregada com docker load)
docker compose logs -f         # logs
docker compose down            # derruba o frontend
```

- Frontend em `http://localhost:8081`. A API sobe separada, pelo compose do `library-backend` (`http://localhost:8080`).
- O serviço usa `API_UPSTREAM` (padrão `http://library-backend:8080`, o nome do serviço do backend na rede) e builda com `VITE_API_URL` (padrão `/api`). Não há `depends_on`: o Nginx resolve o backend a cada requisição e sobe sem ele.
- Variáveis opcionais (ambiente ou `.env` ao lado do compose): `FRONTEND_PORT` (8081), `API_UPSTREAM` e `VITE_API_URL` (`/api`).
- Para carregar imagens salvas (`.tar.gz`) em outra máquina: `docker load -i <arquivo>.tar.gz`, depois `docker compose up -d`.

## Como validar

```bash
curl -i http://localhost:8081/                   # 200 (index.html)
curl -i http://localhost:8081/rota-qualquer      # 200 (fallback do SPA)
curl -i http://localhost:8081/api/genres         # 200 com JSON do backend (proxy)
docker exec <container> nginx -t                 # configuração gerada válida
docker inspect -f '{{.State.Health.Status}}' <container>   # healthy
```

Depois, no navegador (`http://localhost:8081`): os dados carregam, não há erros no console e uma escrita funciona (ex.: cadastrar um autor). Para testar o header `Origin`, acesse o frontend por `http://127.0.0.1:8081` e faça uma escrita: com a imagem atual ela deve funcionar mesmo que essa origem não esteja no CORS do backend.

O que foi conferido com a imagem atual:

- `nginx -t` passa com o template processado pelo `envsubst`; o arquivo gerado contém `resolver 127.0.0.11 valid=30s ipv6=off;`, `set $api_upstream http://library-backend:8080;` e `proxy_set_header Origin "";`.
- Na rede do Docker com o backend: `GET /` 200, `GET /rota-inexistente` 200, `GET /api/genres` 200 e `POST /api/authors` com `Origin: http://127.0.0.1:8081` 201 (sem o 403 de CORS). Um POST inválido devolve o 400 do backend com `fields`.
- Com `API_UPSTREAM` apontando para o IP do gateway da bridge, o proxy responde 200 (GET) e 201 (POST).
- Com um upstream que não existe (ou na bridge padrão, sem `library-backend`), `/api/...` responde 502.
- Alterar só `nginx/default.conf.template` mantém em cache o passo `npm run build`.

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| Tela com "Não foi possível carregar os dados" e `/api/...` com 502 | O Nginx não resolve ou não alcança o `API_UPSTREAM` | Suba o backend na mesma rede Docker (nome `library-backend`) ou informe `API_UPSTREAM` com um endereço alcançável (IP literal). |
| Escritas (POST, PUT, PATCH, DELETE) com 403 CORS, leituras funcionando | Imagem antiga, sem `proxy_set_header Origin "";`, ou acesso direto à porta do backend por uma origem não liberada | Gere a imagem de novo e acesse sempre pelo frontend (`/api`). |
| `bad interpreter` ao rodar `scripts/build-image.sh` | Finais de linha CRLF no script | Converta para LF (o `.gitattributes` já força `*.sh` em LF no checkout). |
| `docker compose up` falha com "network biblioteca-net declared as external, but could not be found" | A rede compartilhada com o backend ainda não foi criada | `docker network create biblioteca-net` (uma vez). |
| Container `unhealthy` | O Nginx não subiu (configuração inválida) | `docker logs <container>` e `docker exec <container> nginx -t`. |
