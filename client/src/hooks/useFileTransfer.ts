import { useRef, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { toast } from 'sonner';
import { useStore } from '../store';
import { readFileAsArrayBuffer } from '../lib/fileReader';
import { computeSha256 } from '../lib/hasher';
import { chunkFile, getChunkSize } from '../lib/chunker';
import type { MetadataMessage, EOFMessage } from '../types';
import { useTransferProgress } from './useTransferProgress';

export function useFileTransfer() {
  const arrayBufferRef = useRef<ArrayBuffer | null>(null);
  const abortRef = useRef(false);
  const progressHook = useTransferProgress();

  const startTransfer = useCallback(async (peer: SimplePeer.Instance) => {
    abortRef.current = false;
    const store  = useStore.getState();
    const { file, fileName, fileSize, fileMimeType, sha256Hash } = store;

    try {
      if (!file && !arrayBufferRef.current) {
        throw new Error("No file found to transfer. Did you refresh the page?");
      }

      let arrayBuffer = arrayBufferRef.current;
      if (!arrayBuffer) {
        arrayBuffer = await readFileAsArrayBuffer(file!);
        arrayBufferRef.current = arrayBuffer;
      }

      let hash = sha256Hash;
      if (!hash) {
        hash = await computeSha256(arrayBuffer);
        store.setHash(hash);
      }

      const chunks = chunkFile(arrayBuffer);
      const totalChunks = chunks.length;
      store.setTotalChunks(totalChunks);

      progressHook.startTracking();

      const CHUNK_SIZE = getChunkSize();

      const metadata: MetadataMessage = {
        type: 'metadata', fileName: fileName || 'unknown',
        fileSize: fileSize || arrayBuffer.byteLength, 
        fileMimeType: fileMimeType || 'application/octet-stream',
        totalChunks, chunkSize: CHUNK_SIZE, sha256Hash: hash,
      };
      
      peer.send('CTRL:' + JSON.stringify(metadata));

      const BUFFER_HIGH = 1_048_576;  // 1 MB
      const BUFFER_LOW  = 524_288;    // 500 KB

      for (let i = 0; i < chunks.length; i++) {
        if (abortRef.current) return;

        const channel = (peer as unknown as { _channel?: RTCDataChannel })._channel;
        if (channel && channel.bufferedAmount > BUFFER_HIGH) {
          await new Promise<void>((resolve) => {
            channel.bufferedAmountLowThreshold = BUFFER_LOW;
            const check = () => {
              if (channel.bufferedAmount <= BUFFER_LOW) {
                channel.removeEventListener('bufferedamountlow', check);
                resolve();
              }
            };
            channel.addEventListener('bufferedamountlow', check);
            // Check immediately in case it drained before event was added
            check();
          });
        }

        if (abortRef.current) return;

        peer.send(chunks[i]);
        progressHook.updateChunk(i + 1, (i + 1) * CHUNK_SIZE);
        
        // Slight delay occasionally to yield to UI thread
        if (i % 50 === 0) {
          await new Promise(r => setTimeout(r, 0));
        }
      }

      if (abortRef.current) return;

      const eof: EOFMessage = { type: 'eof', totalChunks, sha256Hash: hash };
      peer.send('CTRL:' + JSON.stringify(eof));

      store.setStatus('verifying');
    } catch (err: unknown) {
      console.error("[useFileTransfer] Transfer failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Transfer failed: ${errorMessage}`);
      store.setError('ice_failed', `Transfer stopped: ${errorMessage}`);
    }
  }, [progressHook]);

  const abortTransfer = useCallback(() => {
    abortRef.current = true;
  }, []);

  return { startTransfer, abortTransfer, arrayBufferRef };
}
