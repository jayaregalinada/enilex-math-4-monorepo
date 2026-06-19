import '@testing-library/jest-dom/vitest';

// jsdom does not implement window.matchMedia; provide a minimal stub so any
// code that calls it (e.g. the PWA install-prompt hook) doesn't throw.
// Individual tests that care about the return value can override this with
// vi.stubGlobal('matchMedia', ...) in their own beforeEach.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList,
});
