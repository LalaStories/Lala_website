/**
 * Fixed-window counter kept in memory. It mirrors the upstream throttles so
 * abusive traffic is stopped here instead of burning the shared quota. It
 * resets on deploy and is per-container, so it is a backstop, not the real
 * limit — the shop backend enforces its own.
 */
const hits = new Map<string, number[]>();
const MAX_KEYS = 10_000;

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return false;
}
