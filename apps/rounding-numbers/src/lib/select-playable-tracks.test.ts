import { describe, expect, it } from 'vitest';
import { type AudioFormat, selectPlayableTracks } from './select-playable-tracks';

/** A `canPlay` predicate that only accepts the given formats. */
function only(...formats: AudioFormat[]) {
  return (format: AudioFormat) => formats.includes(format);
}

describe('selectPlayableTracks', () => {
  it('prefers ogg when the browser can decode it', () => {
    const result = selectPlayableTracks(
      {
        '../assets/music/kawaii.ogg': '/kawaii.ogg',
        '../assets/music/kawaii.m4a': '/kawaii.m4a',
      },
      only('ogg', 'm4a'),
    );

    expect(result).toEqual({ '../assets/music/kawaii': '/kawaii.ogg' });
  });

  it('falls back to m4a when ogg is not decodable (Safari/iOS)', () => {
    const result = selectPlayableTracks(
      {
        '../assets/music/kawaii.ogg': '/kawaii.ogg',
        '../assets/music/kawaii.m4a': '/kawaii.m4a',
      },
      only('m4a'),
    );

    expect(result).toEqual({ '../assets/music/kawaii': '/kawaii.m4a' });
  });

  it('keeps the filename markers on the stem so categorisation still works', () => {
    const result = selectPlayableTracks(
      {
        '../assets/music/boss-hard-mode.ogg': '/boss.ogg',
        '../assets/music/boss-hard-mode.m4a': '/boss.m4a',
        '../assets/music/ping-game-over.ogg': '/ping.ogg',
        '../assets/music/ping-game-over.m4a': '/ping.m4a',
      },
      only('m4a'),
    );

    expect(result).toEqual({
      '../assets/music/boss-hard-mode': '/boss.m4a',
      '../assets/music/ping-game-over': '/ping.m4a',
    });
  });

  it('chooses one url per song even when only a single format exists', () => {
    const result = selectPlayableTracks(
      {
        '../assets/music/only-ogg.ogg': '/only-ogg.ogg',
        '../assets/music/only-m4a.m4a': '/only-m4a.m4a',
      },
      only('ogg', 'm4a'),
    );

    expect(result).toEqual({
      '../assets/music/only-ogg': '/only-ogg.ogg',
      '../assets/music/only-m4a': '/only-m4a.m4a',
    });
  });

  it('still picks a track when no format probes as playable, rather than dropping it', () => {
    const result = selectPlayableTracks(
      {
        '../assets/music/kawaii.ogg': '/kawaii.ogg',
        '../assets/music/kawaii.m4a': '/kawaii.m4a',
      },
      // An over-strict browser that claims it can play nothing.
      () => false,
    );

    // Falls back to the first-preference available format (ogg).
    expect(result).toEqual({ '../assets/music/kawaii': '/kawaii.ogg' });
  });

  it('ignores files with unrecognised extensions', () => {
    const result = selectPlayableTracks(
      {
        '../assets/music/readme.txt': '/readme.txt',
        '../assets/music/kawaii.ogg': '/kawaii.ogg',
      },
      only('ogg'),
    );

    expect(result).toEqual({ '../assets/music/kawaii': '/kawaii.ogg' });
  });

  it('returns an empty map for empty input', () => {
    expect(selectPlayableTracks({}, only('ogg'))).toEqual({});
  });
});
