type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

/** Process-local limiter; use a shared store before multi-instance deployment. */
export function allowAuthRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
