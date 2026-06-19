import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Helper to dispatch a BeforeInstallPromptEvent-like event on window.
function dispatchInstallPrompt(promptFn = vi.fn().mockResolvedValue({ outcome: 'accepted' })) {
  const event = new Event('beforeinstallprompt');
  Object.assign(event, { prompt: promptFn });
  window.dispatchEvent(event);
  return promptFn;
}

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches } as MediaQueryList));
}

const { useInstallPrompt } = await import('./use-install-prompt');

describe('useInstallPrompt — installable state', () => {
  beforeEach(() => {
    // Default: not installed, not iOS, matchMedia returns false.
    stubMatchMedia(false);
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Windows NT 10.0)', standalone: false });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with canPromptInstall false before the browser event fires', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canPromptInstall).toBe(false);
  });

  it('sets canPromptInstall to true after a dispatched beforeinstallprompt event', () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      dispatchInstallPrompt();
    });

    expect(result.current.canPromptInstall).toBe(true);
  });

  it('clears canPromptInstall when the appinstalled event fires', () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      dispatchInstallPrompt();
    });
    expect(result.current.canPromptInstall).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.canPromptInstall).toBe(false);
  });

  it('calls the deferred prompt and clears it on promptInstall()', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    const promptFn = vi.fn().mockResolvedValue({ outcome: 'accepted' });

    act(() => {
      dispatchInstallPrompt(promptFn);
    });

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(promptFn).toHaveBeenCalledOnce();
    expect(result.current.canPromptInstall).toBe(false);
  });

  it('cleans up event listeners on unmount', () => {
    const spy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useInstallPrompt());

    unmount();

    expect(spy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(spy).toHaveBeenCalledWith('appinstalled', expect.any(Function));
  });
});

describe('useInstallPrompt — installed detection (mock matchMedia)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports isInstalled true when display-mode is standalone', () => {
    stubMatchMedia(true);
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0', standalone: false });

    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current.isInstalled).toBe(true);
  });

  it('reports isInstalled true when navigator.standalone is true (iOS WebView)', () => {
    stubMatchMedia(false);
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 iPhone', standalone: true });

    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current.isInstalled).toBe(true);
  });

  it('reports isInstalled false in a normal browser tab', () => {
    stubMatchMedia(false);
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0', standalone: false });

    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current.isInstalled).toBe(false);
  });
});

describe('useInstallPrompt — iOS detection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports isIOS true for iPhone user-agent', () => {
    stubMatchMedia(false);
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      standalone: false,
    });

    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current.isIOS).toBe(true);
  });

  it('reports isIOS true for iPad user-agent', () => {
    stubMatchMedia(false);
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      standalone: false,
    });

    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current.isIOS).toBe(true);
  });

  it('reports isIOS false for a desktop Chrome user-agent', () => {
    stubMatchMedia(false);
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      standalone: false,
    });

    const { result } = renderHook(() => useInstallPrompt());

    expect(result.current.isIOS).toBe(false);
  });
});
