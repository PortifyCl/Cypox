import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router') || id.includes('react-helmet')) return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
