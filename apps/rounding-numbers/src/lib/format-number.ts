/** Format a whole number with comma thousands separators (e.g. 1234567 → "1,234,567"). */
export function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
