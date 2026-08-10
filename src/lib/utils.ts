import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

/**
 * Projects recurring timetable entries onto the current week while preserving
 * their weekday and time. Calendar data is seeded with fixed dates, so passing
 * it through directly can otherwise render an empty current-week calendar.
 */
export function adjustScheduleToCurrentWeek<T extends { start: Date | string; end: Date | string }>(
  entries: T[],
): T[] {
  const today = new Date();
  const monday = new Date(today);
  const dayOffset = (today.getDay() + 6) % 7;
  monday.setDate(today.getDate() - dayOffset);
  monday.setHours(0, 0, 0, 0);

  const project = (value: Date | string) => {
    const original = new Date(value);
    const projected = new Date(monday);
    projected.setDate(monday.getDate() + ((original.getDay() + 6) % 7));
    projected.setHours(
      original.getHours(),
      original.getMinutes(),
      original.getSeconds(),
      original.getMilliseconds(),
    );
    return projected;
  };

  return entries.map((entry) => ({ ...entry, start: project(entry.start), end: project(entry.end) }));
}
