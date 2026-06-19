import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// VolumeSlider is backed by the settings store, which persists via localStorage;
// jsdom here has none, so stub one before the store module imports.
vi.hoisted(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => storage.clear(),
    key: () => null,
    length: 0,
  });
});

const { useSettingsStore } = await import('@/stores/use-settings-store');
const { VolumeSlider } = await import('./volume-slider');

describe('VolumeSlider', () => {
  beforeEach(() => {
    useSettingsStore.setState({ volume: 0.8 });
  });

  it('reflects the stored volume as a 0–100 percentage', () => {
    render(<VolumeSlider />);

    const slider = screen.getByRole('slider', { name: 'Volume' }) as HTMLInputElement;
    expect(slider.value).toBe('80');
  });

  it('writes the moved value back to the store as a 0–1 volume', () => {
    render(<VolumeSlider />);

    fireEvent.change(screen.getByRole('slider', { name: 'Volume' }), { target: { value: '50' } });

    expect(useSettingsStore.getState().volume).toBe(0.5);
  });
});
