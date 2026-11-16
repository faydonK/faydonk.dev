import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    assetsInlineLimit: (filePath) =>
      filePath.includes('/assets/logos/') || filePath.includes('/assets/mail/') ? false : undefined, // logos served as files, not inlined in the main bundle
  },
});
