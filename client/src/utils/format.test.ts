import { describe, it, expect } from 'vitest';
import { formatBytes, formatSpeed, formatEta } from './format';

describe('format utilities', () => {
  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(500)).toBe('500 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1500)).toBe('1 KB');
      expect(formatBytes(1_048_576)).toBe('1.0 MB');
      expect(formatBytes(1_500_000)).toBe('1.4 MB');
    });
  });

  describe('formatSpeed', () => {
    it('formats speed correctly', () => {
      expect(formatSpeed(500)).toBe('500 B/s');
      expect(formatSpeed(1024)).toBe('1 KB/s');
      expect(formatSpeed(1500)).toBe('1 KB/s');
      expect(formatSpeed(1_048_576)).toBe('1.0 MB/s');
      expect(formatSpeed(1_500_000)).toBe('1.4 MB/s');
    });
  });

  describe('formatEta', () => {
    it('formats ETA correctly', () => {
      expect(formatEta(-1)).toBe('...');
      expect(formatEta(0)).toBe('...');
      expect(formatEta(Infinity)).toBe('...');
      expect(formatEta(30)).toBe('~30s');
      expect(formatEta(59)).toBe('~59s');
      expect(formatEta(60)).toBe('~1m');
      expect(formatEta(65)).toBe('~1m 5s');
      expect(formatEta(125)).toBe('~2m 5s');
    });
  });
});
