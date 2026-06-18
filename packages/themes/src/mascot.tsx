import type { MascotMood } from './theme';
import { useTheme } from './use-theme';

export interface MascotProps {
  mood: MascotMood;
}

const MOOD_LABEL: Record<MascotMood, string> = {
  idle: 'watching',
  cheer: 'cheering',
  sad: 'disappointed',
};

/**
 * The active theme's mascot, reacting to the run. Mood drives a CSS animation
 * class (defined by the app), so the character can bob, bounce, or droop without
 * needing separate art per mood.
 */
export function Mascot({ mood }: MascotProps) {
  const theme = useTheme();

  return (
    // a11y: the emoji is decorative; the label conveys the mascot's reaction.
    <div
      className={`mascot mascot--${mood}`}
      role="img"
      aria-label={`${theme.name} mascot ${MOOD_LABEL[mood]}`}
    >
      <span aria-hidden="true">{theme.mascot}</span>
    </div>
  );
}
