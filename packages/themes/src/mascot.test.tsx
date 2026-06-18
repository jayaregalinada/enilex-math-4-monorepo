import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Mascot } from './mascot';
import type { MascotMood } from './theme';
import { ThemeProvider } from './theme-provider';
import { THEMES } from './themes';

const [sampleTheme] = THEMES;
if (sampleTheme === undefined) {
  throw new Error('THEMES must not be empty');
}

describe('Mascot', () => {
  it('renders an svg sprite inside the mascot', () => {
    render(
      <ThemeProvider theme={sampleTheme}>
        <Mascot mood="idle" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('img').querySelector('svg')).not.toBeNull();
  });

  it('exposes an img role labelled with the theme name and the idle mood word', () => {
    render(
      <ThemeProvider theme={sampleTheme}>
        <Mascot mood="idle" />
      </ThemeProvider>,
    );

    // a11y: the labelled img conveys the mascot's reaction.
    const mascot = screen.getByRole('img');
    expect(mascot).toHaveAttribute('aria-label', `${sampleTheme.name} mascot watching`);
  });

  it('labels the cheer mood as cheering', () => {
    render(
      <ThemeProvider theme={sampleTheme}>
        <Mascot mood="cheer" />
      </ThemeProvider>,
    );

    const mascot = screen.getByRole('img');
    expect(mascot.getAttribute('aria-label')).toContain(sampleTheme.name);
    expect(mascot.getAttribute('aria-label')).toContain('cheering');
  });

  it('labels the sad mood as disappointed', () => {
    render(
      <ThemeProvider theme={sampleTheme}>
        <Mascot mood="sad" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('disappointed');
  });

  it('reflects the mood in the root className', () => {
    const moods: MascotMood[] = ['idle', 'cheer', 'sad'];

    for (const mood of moods) {
      const { unmount } = render(
        <ThemeProvider theme={sampleTheme}>
          <Mascot mood={mood} />
        </ThemeProvider>,
      );
      expect(screen.getByRole('img').className).toContain(`mascot--${mood}`);
      unmount();
    }
  });
});
