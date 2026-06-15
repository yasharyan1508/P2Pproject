import type { StateCreator } from 'zustand';
import type { TransferState, TransferStatus, ErrorType } from '../types';

export interface TransferActions {
  setStatus:      (status: TransferStatus) => void;
  setError:       (type: ErrorType, message: string) => void;
  setTotalChunks: (n: number) => void;
  updateProgress: (chunksProcessed: number, bytesProcessed: number) => void;
  updateSpeed:    (speedBps: number, etaSeconds: number) => void;
  reset:          () => void;
}

export type TransferSlice = TransferState & TransferActions;

export const initialTransferState: TransferState = {
  status: 'idle',
  totalChunks: 0,
  chunksProcessed: 0,
  bytesProcessed: 0,
  progressPercent: 0,
  transferSpeedBps: 0,
  etaSeconds: 0,
  startTimestamp: null,
  errorType: null,
  errorMessage: null,
};

export const createTransferSlice: StateCreator<TransferSlice, [], [], TransferSlice> = (set, get) => ({
  ...initialTransferState,

  setStatus: (status: TransferStatus) => set({ status }),

  setError: (errorType: ErrorType, errorMessage: string) => set({ status: 'failed', errorType, errorMessage }),

  setTotalChunks: (totalChunks: number) => set({ totalChunks }),

  updateProgress: (chunksProcessed: number, bytesProcessed: number) => {
    const totalChunks = get().totalChunks;
    const progressPercent = totalChunks > 0
      ? Math.min(100, (chunksProcessed / totalChunks) * 100)
      : 0;
    set({ chunksProcessed, bytesProcessed, progressPercent });
  },

  updateSpeed: (transferSpeedBps: number, etaSeconds: number) => set({ transferSpeedBps, etaSeconds }),

  reset: () => set(initialTransferState),
});
