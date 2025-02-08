import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  // Базовые настройки
  base: '/',
  
  // Оптимизация сборки
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    minify: mode === 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-bootstrap']
        }
      }
    }
  },

  // Настройки сервера разработки
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['http://194.87.69.156:3000'],
    cors: {
      origin: ['http://194.87.69.156:3000', 'http://194.87.69.156:3002'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    proxy: {
      '/api': {
        target: 'http://backend:3002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  // Resolve алиасы для импортов
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "bootstrap/dist/css/bootstrap.min.css";`
      }
    }
  },
}))
