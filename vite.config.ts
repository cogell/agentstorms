import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5111,
    strictPort: true,
    open: false,
    proxy: {
      // Proxy WebSocket requests to the Worker in development
      '/ws': {
        target: 'ws://localhost:8711',
        ws: true,
        changeOrigin: true,
        rewriteWsOrigin: true,
      },
      // Proxy API requests to the Worker in development
      '/api': {
        target: 'http://localhost:8711',
        changeOrigin: true,
      },
    },
  },
})
