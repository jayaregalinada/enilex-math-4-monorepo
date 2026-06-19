import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Generate PWA icon set from the standalone octopus pixel-art SVG.
// The minimal2023 preset produces: favicon.ico, favicon.svg, apple-touch-icon-180x180.png,
// pwa-192x192.png, pwa-512x512.png, and maskable-icon-512x512.png.
//
// The preset fills the maskable + apple icons with a white background by
// default; the source SVG already paints the dark app background edge-to-edge,
// so override the padding background to the same dark colour. That keeps the
// padded variants seamless (no white/black frame) on every platform.
const darkBackground = { background: { r: 0x0d, g: 0x0b, b: 0x1f, alpha: 1 } } as const;

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { ...minimal2023Preset.maskable.resizeOptions, ...darkBackground },
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: { ...minimal2023Preset.apple.resizeOptions, ...darkBackground },
    },
  },
  images: ['public/octopus-icon.svg'],
});
