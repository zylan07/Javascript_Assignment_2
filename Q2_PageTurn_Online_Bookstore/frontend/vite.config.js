import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React dev server on 5174, API calls proxied to Express on 5002
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: { '/api': 'http://localhost:5002' },
  },
});
