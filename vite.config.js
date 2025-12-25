import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/foodchain/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'client/shared'),
    },
  },
});