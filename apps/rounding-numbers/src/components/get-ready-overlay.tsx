export interface GetReadyOverlayProps {
  count: number;
}

/**
 * Full-screen "Get ready!" cover shown before a timed run begins. It blurs the
 * board behind it (so the first question stays hidden) and intercepts clicks
 * until the countdown reaches "go". Keyed on `count` so each number re-pops.
 */
export function GetReadyOverlay({ count }: GetReadyOverlayProps) {
  return (
    <div className="get-ready" role="status" aria-live="assertive">
      <p className="get-ready__label">Get ready!</p>
      <p className="get-ready__count" key={count}>
        {count}
      </p>
    </div>
  );
}
