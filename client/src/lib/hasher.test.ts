import { describe, it, expect } from 'vitest';
import { computeSha256, timingSafeEqual } from './hasher';

describe('hasher', () => {
  describe('computeSha256', () => {
    it('should compute correct SHA-256 hash for a given ArrayBuffer', async () => {
      const text = 'hello world';
      const encoder = new TextEncoder();
      const buffer = encoder.encode(text).buffer;
      const hash = await computeSha256(buffer);
      // SHA-256 of "hello world"
      expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    });

    it('should compute consistent hashes', async () => {
      const buffer = new Uint8Array([1, 2, 3]).buffer;
      const hash1 = await computeSha256(buffer);
      const hash2 = await computeSha256(buffer);
      expect(hash1).toBe(hash2);
    });
  });

  describe('timingSafeEqual', () => {
    it('should return true for identical strings', () => {
      expect(timingSafeEqual('abcdef', 'abcdef')).toBe(true);
    });

    it('should return false for different strings of same length', () => {
      expect(timingSafeEqual('abcdef', 'abcdeg')).toBe(false);
    });

    it('should return false for strings of different lengths', () => {
      expect(timingSafeEqual('abc', 'abcd')).toBe(false);
    });
  });
});
