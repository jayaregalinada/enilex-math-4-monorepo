import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // PWA dev mode disabled — the SW intercepts HMR and breaks the dev loop.
      devOptions: { enabled: false },
      workbox: {
        // Cache all app assets; 6 MB ceiling covers the woff2 font and ogg tracks.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ogg}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Rounding Numbers — Enilex Math 4',
        short_name: 'Round Numbers',
        description: 'Round whole numbers to the nearest place value.',
        display: 'standalone',
        theme_color: '#0d0b1f',
        background_color: '#0d0b1f',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    css: false,
    // Unit tests are co-located under src; Playwright e2e specs live in e2e/.
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
