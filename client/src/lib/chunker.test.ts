import { describe, it, expect } from 'vitest';
import { chunkFile, getTotalChunks, getChunkSize } from './chunker';

// Mock the chunk size environment variable if needed, or rely on the fallback
describe('chunker', () => {
  const CHUNK_SIZE = getChunkSize();

  describe('chunkFile', () => {
    it('should split buffer into correct number of chunks', () => {
      const buffer = new Uint8Array(CHUNK_SIZE * 2.5).buffer; // 2.5 chunks
      const chunks = chunkFile(buffer);
      
      expect(chunks.length).toBe(3);
      expect(chunks[0].byteLength).toBe(CHUNK_SIZE);
      expect(chunks[1].byteLength).toBe(CHUNK_SIZE);
      expect(chunks[2].byteLength).toBe(CHUNK_SIZE * 0.5);
    });

    it('should handle buffer smaller than chunk size', () => {
      const buffer = new Uint8Array(1024).buffer;
      const chunks = chunkFile(buffer);
      
      expect(chunks.length).toBe(1);
      expect(chunks[0].byteLength).toBe(1024);
    });

    it('should handle empty buffer', () => {
      const buffer = new Uint8Array(0).buffer;
      const chunks = chunkFile(buffer);
      
      expect(chunks.length).toBe(0);
    });
  });

  describe('getTotalChunks', () => {
    it('should calculate total chunks correctly', () => {
      expect(getTotalChunks(CHUNK_SIZE * 2)).toBe(2);
      expect(getTotalChunks(CHUNK_SIZE * 2 + 1)).toBe(3);
      expect(getTotalChunks(100)).toBe(1);
      expect(getTotalChunks(0)).toBe(0);
    });
  });
});
