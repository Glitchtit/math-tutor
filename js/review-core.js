// Spaced review schedule: an item comes back after 1, 3, 7, 21, then 60 days; a miss starts it over at 1 day.

export const INTERVALS = [1, 3, 7, 21, 60];
export const DAY = 86400000;

// prev: { step, due, last } or undefined; returns the next schedule entry
export function nextReview(prev, ok, now = Date.now()) {
  const step = ok ? Math.min((prev ? prev.step : -1) + 1, INTERVALS.length - 1) : 0;
  return { step, due: now + INTERVALS[step] * DAY, last: now };
}

// keys due at `now`, most overdue first
export function dueKeys(review, now = Date.now()) {
  return Object.entries(review).filter(([, r]) => r.due <= now).sort((a, b) => a[1].due - b[1].due).map(([k]) => k);
}
