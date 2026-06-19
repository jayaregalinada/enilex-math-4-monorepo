/**
 * Audio file extensions we ship, in preference order: the first one the browser
 * can decode wins. OGG is preferred (smaller files), with M4A/AAC as the
 * fallback for Safari/iOS, which cannot decode OGG Vorbis via the Web Audio API.
 */
const FORMAT_PREFERENCE = ['ogg', 'm4a', 'mp3', 'wav'] as const;

export type AudioFormat = (typeof FORMAT_PREFERENCE)[number];

/** MIME strings used to probe decode support via `HTMLMediaElement.canPlayType`. */
const MIME_TYPES: Record<AudioFormat, string> = {
  ogg: 'audio/ogg; codecs="vorbis"',
  m4a: 'audio/mp4; codecs="mp4a.40.2"',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
};

/**
 * Whether the current browser can play `format`, via an `<audio>` element probe.
 * Outside a browser (SSR/tests) every format is assumed playable, so the
 * first-preference format is chosen deterministically.
 */
function canPlayFormat(format: AudioFormat): boolean {
  if (typeof document === 'undefined') {
    return true;
  }

  return document.createElement('audio').canPlayType(MIME_TYPES[format]) !== '';
}

/** The track's extension as a known {@link AudioFormat}, or null if unrecognised. */
function formatOf(path: string): AudioFormat | null {
  const ext = /\.([^.]+)$/.exec(path)?.[1]?.toLowerCase();

  return FORMAT_PREFERENCE.find((format) => format === ext) ?? null;
}

/** The path without its extension — the key that groups a song's format variants. */
function stemOf(path: string): string {
  return path.replace(/\.[^.]+$/, '');
}

/**
 * Collapses a set of discovered audio files — which may include several format
 * variants of the same song (e.g. `kawaii.ogg` and `kawaii.m4a`) — down to one
 * URL per song, choosing the most-preferred format the browser can actually
 * decode. Returns a path→URL map keyed by the extensionless stem, so the
 * filename markers (`-hard-mode`, `-game-over`) survive for categorisation.
 *
 * `canPlay` is injectable for tests; it defaults to the real browser probe.
 */
export function selectPlayableTracks(
  files: Record<string, string>,
  canPlay: (format: AudioFormat) => boolean = canPlayFormat,
): Record<string, string> {
  // stem -> (format -> url)
  const variants = new Map<string, Map<AudioFormat, string>>();

  for (const [path, url] of Object.entries(files)) {
    const format = formatOf(path);
    if (format === null) {
      continue;
    }

    const stem = stemOf(path);
    const byFormat = variants.get(stem) ?? new Map<AudioFormat, string>();
    byFormat.set(format, url);
    variants.set(stem, byFormat);
  }

  // Probe each format once — support doesn't change within a session.
  const playable = FORMAT_PREFERENCE.filter(canPlay);

  const selected: Record<string, string> = {};

  for (const [stem, byFormat] of variants) {
    // Prefer a decodable format in preference order; if none probes as playable
    // (e.g. an over-strict browser), fall back to any available variant rather
    // than silently dropping the song.
    const chosen =
      playable.find((format) => byFormat.has(format)) ??
      FORMAT_PREFERENCE.find((format) => byFormat.has(format));

    if (chosen !== undefined) {
      selected[stem] = byFormat.get(chosen) as string;
    }
  }

  return selected;
}
