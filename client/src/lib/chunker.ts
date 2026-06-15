const CHUNK_SIZE = parseInt(import.meta.env.VITE_CHUNK_SIZE_BYTES ?? '65536', 10);

/**
 * Splits an ArrayBuffer into smaller chunks of a predefined size for transmission.
 * 
 * @param buffer - The complete file data as an ArrayBuffer
 * @returns An array of smaller ArrayBuffers (chunks)
 */
export const chunkFile = (buffer: ArrayBuffer): ArrayBuffer[] => {
  const chunks: ArrayBuffer[] = [];
  let offset = 0;
  while (offset < buffer.byteLength) {
    chunks.push(buffer.slice(offset, Math.min(offset + CHUNK_SIZE, buffer.byteLength)));
    offset += CHUNK_SIZE;
  }
  return chunks;
};

/**
 * Calculates the total number of chunks a file will be split into.
 * 
 * @param fileSize - The total size of the file in bytes
 * @returns The total number of chunks
 */
export const getTotalChunks = (fileSize: number): number =>
  Math.ceil(fileSize / CHUNK_SIZE);

/**
 * Gets the current chunk size setting.
 * 
 * @returns The chunk size in bytes
 */
export const getChunkSize = (): number => CHUNK_SIZE;
