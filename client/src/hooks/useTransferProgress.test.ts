
import { renderHook, act } from '@testing-library/react';
import { useTransferProgress } from './useTransferProgress';
import { useStore } from '../store';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('useTransferProgress', () => {
  beforeEach(() => {
    useStore.getState().resetAll();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates speed and ETA correctly', () => {
    useStore.setState({ fileSize: 1048576, status: 'transferring' }); // 1 MB
    
    const { result } = renderHook(() => useTransferProgress());
    
    act(() => {
      result.current.startTracking();
      // First chunk: 64 KB
      result.current.updateChunk(1, 65536);
    });
    
    // Move forward 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
      // Next chunks up to 512 KB
      result.current.updateChunk(8, 524288);
    });

    const store = useStore.getState();
    expect(store.bytesProcessed).toBe(524288);
    // Speed should be around 512 KB/s
    expect(store.transferSpeedBps).toBeGreaterThan(0);
    expect(store.etaSeconds).toBeGreaterThan(0);
  });
});
