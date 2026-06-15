import { useRef } from 'react';
import { useStore } from '../store';

interface SpeedSample {
  timestamp: number;
  bytes:     number;
}

export function useTransferProgress() {
  const speedWindow = useRef<SpeedSample[]>([]);
  const lastUpdateTime = useRef(0);

  const startTracking = () => {
    speedWindow.current = [];
    lastUpdateTime.current = 0;
    useStore.getState().setStatus('transferring');
  };

  const updateChunk = (chunksProcessed: number, bytesProcessed: number) => {
    const now = Date.now();
    const store = useStore.getState();

    store.updateProgress(chunksProcessed, bytesProcessed);

    speedWindow.current.push({ timestamp: now, bytes: bytesProcessed });

    if (now - lastUpdateTime.current < 250) return;
    lastUpdateTime.current = now;

    const windowStart = now - 5000;
    while (speedWindow.current.length > 1 && speedWindow.current[0].timestamp < windowStart) {
      speedWindow.current.shift();
    }

    const oldest     = speedWindow.current[0];
    const windowBytes = bytesProcessed - oldest.bytes;
    const windowSec  = (now - oldest.timestamp) / 1000;
    const speedBps   = windowSec > 0.1 ? windowBytes / windowSec : 0;

    const totalBytes    = store.fileSize ?? 0;
    const remainingBytes = Math.max(0, totalBytes - bytesProcessed);
    const etaSeconds    = speedBps > 0 ? remainingBytes / speedBps : 0;

    store.updateSpeed(speedBps, etaSeconds);
  };

  return { startTracking, updateChunk };
}
