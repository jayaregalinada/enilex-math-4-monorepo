import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from './theme-provider';
import { THEMES } from './themes';
import { useTheme } from './use-theme';

const [sampleTheme] = THEMES;
if (sampleTheme === undefined) {
  throw new Error('THEMES must not be empty');
}

function ThemeProbe() {
  const theme = useTheme();

  return <span>{theme.name}</span>;
}

describe('ThemeProvider', () => {
  it('renders its children', () => {
    render(
      <ThemeProvider theme={sampleTheme}>
        <p>child content</p>
      </ThemeProvider>,
    );

    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('tags the wrapper with the theme id and the palette CSS variables', () => {
    const { container } = render(
      <ThemeProvider theme={sampleTheme}>
        <p>child</p>
      </ThemeProvider>,
    );

    const root = container.querySelector('.theme-root');
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute('data-theme', sampleTheme.id);
    expect((root as HTMLElement).style.getPropertyValue('--color-bg')).toBe(sampleTheme.palette.bg);
  });

  it('supplies the theme to descendants reading useTheme()', () => {
    render(
      <ThemeProvider theme={sampleTheme}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByText(sampleTheme.name)).toBeInTheDocument();
  });
});
