/**
 * Formats a byte count into a human-readable string (B, KB, MB).
 * 
 * @param bytes - The number of bytes
 * @returns A formatted string representation (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1_048_576)  return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
};

/**
 * Formats a transfer speed (bytes per second) into a human-readable string.
 * 
 * @param bps - Bytes per second
 * @returns A formatted string representation (e.g., "5.2 MB/s")
 */
export const formatSpeed = (bps: number): string => {
  if (bps < 1024)       return `${bps.toFixed(0)} B/s`;
  if (bps < 1_048_576)  return `${(bps / 1024).toFixed(0)} KB/s`;
  return `${(bps / 1_048_576).toFixed(1)} MB/s`;
};

/**
 * Formats an Estimated Time of Arrival (ETA) in seconds into a human-readable string.
 * 
 * @param seconds - ETA in seconds
 * @returns A formatted string representation (e.g., "~2m 30s")
 */
export const formatEta = (seconds: number): string => {
  if (seconds <= 0 || !isFinite(seconds)) return '...';
  if (seconds < 60) return `~${Math.ceil(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.ceil(seconds % 60);
  return s > 0 ? `~${m}m ${s}s` : `~${m}m`;
};
