import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconSettings } from './icon-settings';

describe('IconSettings', () => {
  it('renders a decorative svg with a shape child by default', () => {
    const { container } = render(<IconSettings />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // a11y: an unlabelled icon is decorative and hidden from assistive tech.
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.querySelector('path, rect')).toBeInTheDocument();
  });

  it('exposes an img role labelled with the title prop', () => {
    render(<IconSettings title="Settings" />);

    // a11y: a titled icon becomes an image labelled for assistive tech.
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Settings');
  });
});
