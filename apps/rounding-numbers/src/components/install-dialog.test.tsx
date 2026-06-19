import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Stub the hook so we can control what it returns without real browser events.
vi.mock('@/hooks/use-install-prompt', () => ({
  useInstallPrompt: vi.fn(),
}));

const { useInstallPrompt } = await import('@/hooks/use-install-prompt');
const { InstallDialog } = await import('./install-dialog');

const mockHook = useInstallPrompt as ReturnType<typeof vi.fn>;

describe('InstallDialog', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    // Default state: installable, not yet installed, not iOS.
    mockHook.mockReturnValue({
      canPromptInstall: false,
      isInstalled: false,
      isIOS: false,
      promptInstall: vi.fn(),
    });
  });

  it('renders the Install app button when not installed', () => {
    render(<InstallDialog />);
    expect(screen.getByRole('button', { name: 'Install app' })).toBeInTheDocument();
  });

  it('renders nothing when the app is already installed', () => {
    mockHook.mockReturnValue({
      canPromptInstall: false,
      isInstalled: true,
      isIOS: false,
      promptInstall: vi.fn(),
    });

    const { container } = render(<InstallDialog />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: 'Install app' })).toBeNull();
  });

  it('renders the Install app button on iOS (no beforeinstallprompt support)', () => {
    mockHook.mockReturnValue({
      canPromptInstall: false,
      isInstalled: false,
      isIOS: true,
      promptInstall: vi.fn(),
    });

    render(<InstallDialog />);

    expect(screen.getByRole('button', { name: 'Install app' })).toBeInTheDocument();
  });
});
