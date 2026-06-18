import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/game-audio', () => ({
  gameAudio: {
    resume: vi.fn(),
    setMuted: vi.fn(),
    playSoundEffect: vi.fn(),
    setMusicContext: vi.fn(),
    skipTrack: vi.fn(),
    stopMusic: vi.fn(),
    dispose: vi.fn(),
  },
}));

const { gameAudio } = await import('@/lib/game-audio');
const { NextTrackButton } = await import('./next-track-button');

describe('NextTrackButton', () => {
  it('renders a labelled button', () => {
    render(<NextTrackButton />);

    expect(screen.getByRole('button', { name: 'Next track' })).toBeInTheDocument();
  });

  it('skips the track and plays a tap on click', () => {
    render(<NextTrackButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Next track' }));

    expect(gameAudio.skipTrack).toHaveBeenCalledOnce();
    expect(gameAudio.playSoundEffect).toHaveBeenCalledWith('tap');
  });

  it('renders an SVG icon inside the button', () => {
    render(<NextTrackButton />);

    // a11y: the icon-only control swaps emoji for a pixel-art SVG; verify it renders.
    expect(
      screen.getByRole('button', { name: 'Next track' }).querySelector('svg'),
    ).toBeInTheDocument();
  });
});
