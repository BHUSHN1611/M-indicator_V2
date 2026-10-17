/**
 * Time calculation and conversion utilities for timetable-based tracking.
 */

const MINUTES_PER_DAY = 1440;

/**
 * Parses "HH:MM" (or "HH:MM:SS") 24h string into minutes since midnight.
 * Returns null if input is null or invalid.
 */
export function timeStringToMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;

  return hours * 60 + minutes;
}

/**
 * Converts a JavaScript Date into fractional minutes since midnight (0.0 to 1439.999).
 */
export function dateToMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

/**
 * Converts minutes since midnight back to a 24-hour "HH:MM" string.
 */
export function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Formats difference in minutes into human-friendly ETA label.
 * Example: <= 0 -> "now", 4 -> "4m", 72 -> "1h 12m"
 */
export function formatEta(diffMinutes: number): string {
  if (diffMinutes <= 0) return 'now';
  if (diffMinutes < 60) return `${Math.ceil(diffMinutes)}m`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = Math.ceil(diffMinutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Linearly interpolates missing (null) stop times and handles midnight rollover.
 * Ensures the resulting array of minutes is monotonically increasing.
 */
export function interpolateStopTimes(rawTimes: (string | null | undefined)[]): number[] {
  if (rawTimes.length === 0) return [];

  // 1. Convert to minutes
  const rawMinutes: (number | null)[] = rawTimes.map(timeStringToMinutes);

  // 2. Adjust for midnight rollover in non-null entries
  let rolloverOffset = 0;
  let lastValidMinute: number | null = null;
  const adjustedMinutes: (number | null)[] = [];

  for (const m of rawMinutes) {
    if (m === null) {
      adjustedMinutes.push(null);
      continue;
    }

    let current = m + rolloverOffset;
    if (lastValidMinute !== null && current < lastValidMinute) {
      // Midnight crossed: add 24 hours
      rolloverOffset += MINUTES_PER_DAY;
      current = m + rolloverOffset;
    }

    adjustedMinutes.push(current);
    lastValidMinute = current;
  }

  // 3. Fill intermediate gaps via linear interpolation
  const filled = [...adjustedMinutes];
  let i = 0;

  while (i < filled.length) {
    if (filled[i] !== null) {
      i++;
      continue;
    }

    let prevIdx = i - 1;
    while (prevIdx >= 0 && filled[prevIdx] === null) prevIdx--;

    let nextIdx = i;
    while (nextIdx < filled.length && filled[nextIdx] === null) nextIdx++;

    const prevVal = prevIdx >= 0 ? (filled[prevIdx] as number) : null;
    const nextVal = nextIdx < filled.length ? (filled[nextIdx] as number) : null;

    for (let k = i; k < nextIdx; k++) {
      if (prevVal !== null && nextVal !== null) {
        const frac = (k - prevIdx) / (nextIdx - prevIdx);
        filled[k] = prevVal + (nextVal - prevVal) * frac;
      } else if (prevVal !== null) {
        filled[k] = prevVal;
      } else if (nextVal !== null) {
        filled[k] = nextVal;
      } else {
        filled[k] = 0;
      }
    }
    i = nextIdx;
  }

  return filled.map((v) => v as number);
}
