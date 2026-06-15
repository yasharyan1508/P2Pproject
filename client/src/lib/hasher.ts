/**
 * Computes the SHA-256 hash of an ArrayBuffer.
 * 
 * @param data - The file data as a BufferSource
 * @returns A promise that resolves to the hex string representation of the hash
 */
export const computeSha256 = async (data: BufferSource): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray  = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Performs a constant-time comparison of two strings to prevent timing attacks.
 * Useful for securely comparing cryptographic hashes.
 * 
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns True if strings are exactly equal, false otherwise
 */
export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};
