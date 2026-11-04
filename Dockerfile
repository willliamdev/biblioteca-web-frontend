# syntax=docker/dockerfile:1

# =============================================================================
# Etapa 1: build do bundle estático com Vite
# =============================================================================
FROM node:22-alpine AS build

WORKDIR /app

# Dependências primeiro, para aproveitar o cache enquanto o lockfile não mudar
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Só o que o build do bundle usa: mudanças em nginx/, docs ou configs de lint e
# formatação não invalidam o cache do "npm run build".
COPY index.html vite.config.ts postcss.config.cjs tsconfig*.json ./
COPY public ./public
COPY src ./src

# URL base da API embutida no bundle. O padrão /api é atendido pelo proxy do
# Nginx desta imagem; use uma URL absoluta só se a API ficar em outro host.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# =============================================================================
# Etapa 2: Nginx servindo o SPA e fazendo proxy de /api para o backend
# =============================================================================
FROM nginx:1.30-alpine

LABEL org.opencontainers.image.title="biblioteca-web-frontend" \
      org.opencontainers.image.description="Frontend do sistema de empréstimo de livros (React + Vite servido por Nginx)" \
      org.opencontainers.image.source="https://github.com/willliamdev/biblioteca-web-frontend"

# A config padrão é substituída pela gerada do template na inicialização: o
# entrypoint oficial roda envsubst em /etc/nginx/templates/*.template e grava
# o resultado em /etc/nginx/conf.d/.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

# Padrões do proxy (podem ser sobrescritos com -e / environment):
#   API_UPSTREAM    destino do /api, sem barra no final
#   NGINX_RESOLVER  DNS usado para resolver o API_UPSTREAM (127.0.0.11 = DNS embutido do Docker)
# NGINX_ENVSUBST_FILTER limita o envsubst a essas variáveis, preservando as do nginx ($uri, $host...).
ENV API_UPSTREAM=http://library-backend:8080 \
    NGINX_RESOLVER=127.0.0.11 \
    NGINX_ENVSUBST_FILTER="API_UPSTREAM|NGINX_RESOLVER"

EXPOSE 80

# Usa 127.0.0.1 em vez de "localhost": no Alpine o wget do busybox pode resolver
# localhost para ::1, e o Nginx escuta só em IPv4.
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
