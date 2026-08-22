type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60_000; // Clean up expired keys every 60 seconds

function cleanupExpired(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  buckets.forEach((v, k) => {
    if (v.resetAt <= now) {
      buckets.delete(k);
    }
  });
}

/** Process-local limiter; use a shared store before multi-instance deployment. */
export function allowAuthRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupExpired(now);

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
