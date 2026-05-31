import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Esto fuerza a Vite a usar una conexión WebSocket estable
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    // Opcional: Esto ayuda si tienes problemas con proxies o contenedores
    watch: {
      usePolling: true,
    },
  },
})