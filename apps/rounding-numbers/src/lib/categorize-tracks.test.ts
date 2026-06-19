import { describe, expect, it } from 'vitest';
import { categorizeTracks } from './categorize-tracks';

describe('categorizeTracks', () => {
  it('splits files into the game-over, hard, and general pools by filename marker', () => {
    const result = categorizeTracks({
      '../assets/music/calm.mp3': '/calm.mp3',
      '../assets/music/boss-hard-mode.mp3': '/boss.mp3',
      '../assets/music/sad-game-over.mp3': '/sad.mp3',
    });

    expect(result.general).toEqual(['/calm.mp3']);
    expect(result.hard).toEqual(['/boss.mp3']);
    expect(result.gameOver).toEqual(['/sad.mp3']);
  });

  it('returns empty pools for empty input', () => {
    expect(categorizeTracks({})).toEqual({ general: [], hard: [], gameOver: [] });
  });
});
