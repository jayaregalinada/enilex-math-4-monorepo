import { describe, expect, it } from 'vitest';
import { PLACES } from './places';

describe('PLACES', () => {
  it('is the eight-rung ladder from tens to hundred millions', () => {
    expect(PLACES).toHaveLength(8);
    expect(PLACES[0]?.label).toBe('tens');
    expect(PLACES[7]?.label).toBe('hundred millions');
  });

  it('keeps index 0..7 with exponent = index + 1', () => {
    PLACES.forEach((place, i) => {
      expect(place.index).toBe(i);
      expect(place.exponent).toBe(i + 1);
    });
  });
});
