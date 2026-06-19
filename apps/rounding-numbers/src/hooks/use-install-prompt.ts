import { useCallback, useEffect, useState } from 'react';

/** The browser's deferred install event. Not yet part of the standard lib types. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UseInstallPromptResult {
  /** True when a native install prompt is available to trigger. */
  canPromptInstall: boolean;
  /** True when the app is already running in standalone (installed) mode. */
  isInstalled: boolean;
  /** True when the browser is iOS Safari (no beforeinstallprompt; manual steps needed). */
  isIOS: boolean;
  /** Trigger the deferred native install prompt. No-op if unavailable. */
  promptInstall: () => Promise<void>;
}

/**
 * Captures the browser's `beforeinstallprompt` event so the install UI can be
 * surfaced at the right time rather than the default browser moment. Handles
 * three environments:
 *  - Chromium / Android: deferred prompt available via the event.
 *  - iOS Safari: no event; show manual share-sheet instructions instead.
 *  - Already installed (standalone): hide the install UI entirely.
 */
export function useInstallPrompt(): UseInstallPromptResult {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  // Detect standalone mode: either the CSS media feature (Chromium/Firefox) or
  // the legacy navigator.standalone property (iOS Safari / older WebKit).
  // Guard matchMedia for environments where it may be absent (jsdom in tests).
  const isInstalled =
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches) ||
    ('standalone' in navigator && (navigator as Navigator & { standalone: boolean }).standalone);

  // Detect iOS Safari: it does not fire beforeinstallprompt, so we need a
  // separate path with manual share-sheet instructions.
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      // Prevent the mini-infobar from auto-appearing; we'll prompt on user action.
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      // Clear the deferred prompt once the app is confirmed installed.
      setDeferred(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) {
      return;
    }
    await deferred.prompt();
    // Clear regardless of outcome — the event can only be used once.
    setDeferred(null);
  }, [deferred]);

  return {
    canPromptInstall: deferred !== null,
    isInstalled,
    isIOS,
    promptInstall,
  };
}
