import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2018', // 兼容较老的 iOS Safari / 微信 webview
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('themes.json')) return 'themes';
          if (id.includes('node_modules/react')) return 'react';
        },
      },
    },
  },
});
