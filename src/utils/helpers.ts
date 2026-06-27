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
 * Format a date string to a readable display.
 * Example: "6/25/2026, 03:30 PM"
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
