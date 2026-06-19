import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config';

// Generate PWA icon set from the standalone octopus pixel-art SVG.
// The minimal2023 preset produces: favicon.ico, favicon.svg, apple-touch-icon-180x180.png,
// pwa-192x192.png, pwa-512x512.png, and maskable-icon-512x512.png.
export default defineConfig({
  preset,
  images: ['public/octopus-icon.svg'],
});
