import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages deployment requires base path
  // Set to '/' for custom domain or root deployment
  // Set to '/repository-name/' for username.github.io/repository-name
  base: process.env.VITE_BASE_PATH || '/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['jspdf']
        }
      }
    }
  },

  server: {
    port: 5173,
    open: true
  },

  preview: {
    port: 4173,
    open: true
  }
});
