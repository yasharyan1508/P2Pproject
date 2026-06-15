import { create } from 'zustand';
import { createFileSlice } from './fileSlice';
import type { FileSlice } from './fileSlice';
import { createRoomSlice } from './roomSlice';
import type { RoomSlice } from './roomSlice';
import { createTransferSlice } from './transferSlice';
import type { TransferSlice } from './transferSlice';
import { initialFileState } from './fileSlice';
import { initialRoomState } from './roomSlice';
import { initialTransferState } from './transferSlice';

export type AppStore = FileSlice & RoomSlice & TransferSlice & {
  resetAll: () => void;
};

export const useStore = create<AppStore>()((set, get, api) => ({
  ...createFileSlice(set as any, get as any, api as any),
  ...createRoomSlice(set as any, get as any, api as any),
  ...createTransferSlice(set as any, get as any, api as any),

  resetAll: () => set({
    ...initialFileState,
    ...initialRoomState,
    ...initialTransferState,
  }),
}));
