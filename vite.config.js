
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to all network interfaces
    port: 5173,
    watch: {
      usePolling: true
    },
    allowedHosts: ['stomtest.nsmu.ru']
  }
})
