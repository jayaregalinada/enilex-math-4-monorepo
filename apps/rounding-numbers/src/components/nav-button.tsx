import { IconBack, IconHome } from '@enilex-math-4-pkg/ui';

export interface NavButtonProps {
  onClick: () => void;
  /** 'back' (default) shows a back arrow; 'home' shows a house. */
  variant?: 'back' | 'home';
  /** Accessible label; defaults to 'Back' or 'Home' for the variant. */
  label?: string;
}

/**
 * The uniform top-left navigation control shared by every non-root screen, so
 * Back/Home always sits in the same place and pixel-icon style.
 */
export function NavButton({ onClick, variant = 'back', label }: NavButtonProps) {
  const text = label ?? (variant === 'home' ? 'Home' : 'Back');

  return (
    <button
      type="button"
      className="icon-button screen-nav"
      onClick={onClick}
      // a11y: icon-only nav control needs an explicit label.
      aria-label={text}
    >
      {variant === 'home' ? <IconHome /> : <IconBack />}
    </button>
  );
}
