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
          // Другие зависимости, которые нужно разделить
        }
      }
    }
  },

  // Настройки сервера разработки
  server: {
    allowedHosts: ['stomtest.nsmu.ru'],
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://backend:3002',
        changeOrigin: true,
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
