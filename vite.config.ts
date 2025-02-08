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
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-bootstrap'],
        }
      }
    }
  },

  // Настройки сервера разработки
  server: {
    port: 5173,
    host: true,
    cors: {
      origin: 'http://stomtest.nsmu.ru:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    proxy: {
      '/api': {
        target: 'http://backend:3002',
        changeOrigin: true,
        secure: false
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
