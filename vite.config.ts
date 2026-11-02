import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080'

  // O backend responde sem prefixo: /api/authors -> http://localhost:8080/authors
  const proxy: Record<string, ProxyOptions> = {
    '/api': {
      target: proxyTarget,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      // O navegador envia o header Origin em POST/PUT/PATCH/DELETE mesmo sendo same-origin.
      // Repassado ao back, ele vira uma requisição CORS e o Spring responde 403 "Invalid CORS
      // request" quando a origem do front (ex.: http://127.0.0.1:5173) não está liberada.
      // Pelo proxy a chamada é same-origin para o navegador, então o header é removido.
      configure: (proxyServer) => {
        proxyServer.on('proxyReq', (proxyReq) => {
          proxyReq.removeHeader('origin')
        })
      },
    },
  }

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  }
})
