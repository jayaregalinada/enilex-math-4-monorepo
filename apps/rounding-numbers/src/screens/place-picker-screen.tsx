import { PLACES } from '@enilex-math-4-pkg/game-core';
import { NavButton } from '@/components/nav-button';
import { formatNumber } from '@/lib/format-number';

export interface PlacePickerScreenProps {
  onSelect: (exponent: number) => void;
  onBack: () => void;
}

/** Easy/Normal place-value chooser: a grid of the eight places with their magnitudes. */
export function PlacePickerScreen({ onSelect, onBack }: PlacePickerScreenProps) {
  return (
    <section className="screen">
      <NavButton onClick={onBack} />
      <h2 className="screen__title">Pick a place value</h2>
      <div className="place-grid">
        {PLACES.map((place) => (
          <button
            key={place.exponent}
            type="button"
            className="place-card"
            onClick={() => onSelect(place.exponent)}
          >
            <span className="place-card__label">{place.label}</span>
            <span className="place-card__value">{formatNumber(10 ** place.exponent)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
