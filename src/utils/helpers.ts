// ============================================================
// Basra Manager — Utility Helpers
// ============================================================

/**
 * Generate a unique ID using timestamp + random string.
 * Avoids the need for the uuid package.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format a date string to Arabic-friendly display.
 * Example: "٢٠٢٦/٦/٢٥ ٣:٣٠ م"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format team display name.
 * Example: "يحيى / أحمد"
 */
export function formatTeamName(player1: string, player2: string): string {
  return `${player1} / ${player2}`;
}

/**
 * Calculate win percentage.
 */
export function calcWinPercentage(wins: number, gamesPlayed: number): string {
  if (gamesPlayed === 0) return '0%';
  return `${Math.round((wins / gamesPlayed) * 100)}%`;
}

/**
 * Convert a number to Arabic-Indic numerals.
 */
export function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((d) => (d >= '0' && d <= '9' ? arabicDigits[parseInt(d)] : d))
    .join('');
}
