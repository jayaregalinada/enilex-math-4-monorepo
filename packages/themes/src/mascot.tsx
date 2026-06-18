import type { ComponentType } from 'react';
import { MascotMonkey } from './mascot-monkey';
import { MascotOctopus } from './mascot-octopus';
import { MascotRocket } from './mascot-rocket';
import { MascotUnicorn } from './mascot-unicorn';
import type { MascotMood, MascotSprite, MascotSpriteProps } from './theme';
import { useTheme } from './use-theme';

export interface MascotProps {
  mood: MascotMood;
}

const MOOD_LABEL: Record<MascotMood, string> = {
  idle: 'watching',
  cheer: 'cheering',
  sad: 'disappointed',
};

const SPRITES: Record<MascotSprite, ComponentType<MascotSpriteProps>> = {
  rocket: MascotRocket,
  octopus: MascotOctopus,
  monkey: MascotMonkey,
  unicorn: MascotUnicorn,
};

/**
 * The active theme's pixel-art mascot, reacting to the run. Mood drives a CSS
 * animation class (defined by the app) so the character can bob, bounce, or
 * droop, and also swaps the sprite's facial expression.
 */
export function Mascot({ mood }: MascotProps) {
  const theme = useTheme();
  const Sprite = SPRITES[theme.mascot];

  return (
    // a11y: the sprite is decorative; the label conveys the mascot's reaction.
    <div
      className={`mascot mascot--${mood}`}
      role="img"
      aria-label={`${theme.name} mascot ${MOOD_LABEL[mood]}`}
    >
      <Sprite mood={mood} />
    </div>
  );
}
