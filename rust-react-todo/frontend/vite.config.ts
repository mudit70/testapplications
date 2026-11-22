import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api to the Rust backend during development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
