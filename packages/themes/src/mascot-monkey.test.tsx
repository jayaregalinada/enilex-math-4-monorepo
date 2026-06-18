import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MascotMonkey } from './mascot-monkey';
import type { MascotMood } from './theme';

describe('MascotMonkey', () => {
  it('renders an svg with at least one shape for every mood', () => {
    const moods: MascotMood[] = ['idle', 'cheer', 'sad'];

    for (const mood of moods) {
      const { container, unmount } = render(<MascotMonkey mood={mood} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg?.querySelector('path, rect')).not.toBeNull();
      unmount();
    }
  });

  it('renders differently for cheer and sad moods', () => {
    const cheer = render(<MascotMonkey mood="cheer" />);
    const cheerHtml = cheer.container.innerHTML;
    cheer.unmount();

    const sad = render(<MascotMonkey mood="sad" />);
    const sadHtml = sad.container.innerHTML;
    sad.unmount();

    expect(cheerHtml).not.toBe(sadHtml);
  });
});
