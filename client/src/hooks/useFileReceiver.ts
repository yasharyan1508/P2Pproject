import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useStore } from '../store';
import { computeSha256, timingSafeEqual } from '../lib/hasher';
import { triggerDownload } from '../lib/downloader';
import type { MetadataMessage, EOFMessage, AckMessage, DataChannelMessage } from '../types';
import { useTransferProgress } from './useTransferProgress';
import SimplePeer from 'simple-peer';

/**
 * Hook to manage the file receiving pipeline (metadata -> chunks -> hash verification -> download).
 * 
 * @param peer - The active SimplePeer instance
 * @returns Object containing the handleData function to process incoming DataChannel messages
 */
export function useFileReceiver(peer: SimplePeer.Instance | null) {
  const progressHook = useTransferProgress();

  // Use refs instead of module-level variables to avoid React StrictMode
  // double-mount corruption and to scope state per hook instance.
  const chunkBufferRef = useRef<ArrayBuffer[]>([]);
  const chunksReceivedRef = useRef(0);
  const metadataRef = useRef<MetadataMessage | null>(null);

  const handleMetadata = useCallback((msg: MetadataMessage) => {
    metadataRef.current = msg;
    chunksReceivedRef.current = 0;
    chunkBufferRef.current = [];

    const store = useStore.getState();
    store.setFile({ name: msg.fileName, size: msg.fileSize, type: msg.fileMimeType } as unknown as File);
    store.setTotalChunks(msg.totalChunks);
    store.setStatus('transferring');
    progressHook.startTracking();
  }, [progressHook]);

  const handleChunk = useCallback((chunk: ArrayBuffer) => {
    chunkBufferRef.current.push(chunk);
    chunksReceivedRef.current++;
    const chunkSize = metadataRef.current?.chunkSize ?? 65536;
    progressHook.updateChunk(chunksReceivedRef.current, chunksReceivedRef.current * chunkSize);
  }, [progressHook]);

  const handleEOF = useCallback(async (msg: EOFMessage) => {
    const store = useStore.getState();
    store.setStatus('verifying');

    if (chunksReceivedRef.current !== msg.totalChunks) {
      store.setError('incomplete_transfer', 'Some data was lost in transit. Please try again.');
      chunkBufferRef.current = [];
      return;
    }

    const chunks = chunkBufferRef.current;
    const totalBytes = chunks.reduce((sum, c) => sum + c.byteLength, 0);
    const merged = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }
    chunkBufferRef.current = []; // Free memory

    const computedHash = await computeSha256(merged.buffer);

    if (!timingSafeEqual(computedHash, msg.sha256Hash)) {
      peer?.send('CTRL:' + JSON.stringify({ type: 'ack', status: 'corrupted' } satisfies AckMessage));
      store.setError('hash_mismatch', 'The file was corrupted during transfer. Download was blocked to protect you.');
      toast.error('File corrupted. Download blocked.', { duration: Infinity });
      return;
    }

    const blob = new Blob([merged], { type: metadataRef.current!.fileMimeType });
    triggerDownload(blob, metadataRef.current!.fileName);

    peer?.send('CTRL:' + JSON.stringify({ type: 'ack', status: 'verified' } satisfies AckMessage));

    store.setStatus('complete');
    toast.success('File downloaded successfully!', { duration: 5000 });
  }, [peer]);

  const handleData = useCallback((data: string | ArrayBuffer | Uint8Array) => {
    // simple-peer usually provides Uint8Array in browser, but handle all cases
    let buffer: Uint8Array;
    if (data instanceof Uint8Array) {
      buffer = data;
    } else if (data instanceof ArrayBuffer) {
      buffer = new Uint8Array(data);
    } else if (typeof data === 'string') {
      if (data.startsWith('CTRL:')) {
        try {
          const msg = JSON.parse(data.substring(5)) as DataChannelMessage;
          switch (msg.type) {
            case 'metadata': handleMetadata(msg); break;
            case 'eof':      handleEOF(msg);      break;
            case 'ack':      break;
          }
        } catch (err) {
          console.warn('[Receiver] Failed to parse string control message:', err);
        }
        return;
      }
      // If it's a string but doesn't start with CTRL:, it's unexpected, but we can treat as buffer
      buffer = new TextEncoder().encode(data);
    } else {
      const arrayBufferView = data as unknown as ArrayBufferView;
      buffer = new Uint8Array(arrayBufferView.buffer, arrayBufferView.byteOffset, arrayBufferView.byteLength);
    }

    // Check for 'CTRL:' prefix in binary buffer (C=67, T=84, R=82, L=76, :=58)
    if (buffer.length > 5 && buffer[0] === 67 && buffer[1] === 84 && buffer[2] === 82 && buffer[3] === 76 && buffer[4] === 58) {
      const text = new TextDecoder().decode(buffer.subarray(5));
      try {
        const msg = JSON.parse(text) as DataChannelMessage;
        switch (msg.type) {
          case 'metadata': handleMetadata(msg); break;
          case 'eof':      handleEOF(msg);      break;
          case 'ack':      break;
        }
      } catch (err) {
        console.warn('[Receiver] Failed to parse binary control message:', err);
      }
      return;
    }

    // Otherwise, it's a raw file chunk
    const chunkBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    handleChunk(chunkBuffer as ArrayBuffer);
  }, [handleMetadata, handleEOF, handleChunk]);

  return { handleData };
}
