import type { StateCreator } from 'zustand';
import type { RoomState } from '../types';

export interface RoomActions {
  setRoom:          (roomId: string, isInitiator: boolean) => void;
  setShareUrl:      (url: string) => void;
  setPeerConnected: (connected: boolean) => void;
  clearRoom:        () => void;
}

export type RoomSlice = RoomState & RoomActions;

export const initialRoomState: RoomState = {
  roomId: null,
  shareUrl: null,
  isInitiator: false,
  peerConnected: false,
};

export const createRoomSlice: StateCreator<RoomSlice, [], [], RoomSlice> = (set) => ({
  ...initialRoomState,

  setRoom: (roomId: string, isInitiator: boolean) => set({ roomId, isInitiator }),

  setShareUrl: (shareUrl: string) => set({ shareUrl }),

  setPeerConnected: (peerConnected: boolean) => set({ peerConnected }),

  clearRoom: () => set(initialRoomState),
});
