import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomeScreen } from './home-screen';

describe('HomeScreen', () => {
  it('plays when the Play button is pressed', () => {
    const onPlay = vi.fn();
    render(<HomeScreen onPlay={onPlay} />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(onPlay).toHaveBeenCalledOnce();
  });
});
