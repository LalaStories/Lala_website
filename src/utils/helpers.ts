/**
 * Merges CSS class names together filtering out falsy values.
 */
export function cn(...inputs: (string | undefined | null | boolean | number)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Formats a given number of seconds into MM:SS format.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
