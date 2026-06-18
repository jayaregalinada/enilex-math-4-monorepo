import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MascotOctopus } from './mascot-octopus';
import type { MascotMood } from './theme';

describe('MascotOctopus', () => {
  it('renders an svg with at least one shape for every mood', () => {
    const moods: MascotMood[] = ['idle', 'cheer', 'sad'];

    for (const mood of moods) {
      const { container, unmount } = render(<MascotOctopus mood={mood} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg?.querySelector('path, rect')).not.toBeNull();
      unmount();
    }
  });

  it('renders differently for cheer and sad moods', () => {
    const cheer = render(<MascotOctopus mood="cheer" />);
    const cheerHtml = cheer.container.innerHTML;
    cheer.unmount();

    const sad = render(<MascotOctopus mood="sad" />);
    const sadHtml = sad.container.innerHTML;
    sad.unmount();

    expect(cheerHtml).not.toBe(sadHtml);
  });
});
