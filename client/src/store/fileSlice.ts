import type { StateCreator } from 'zustand';
import type { FileState } from '../types';

export interface FileActions {
  setFile:   (file: File) => void;
  setHash:   (hash: string) => void;
  clearFile: () => void;
}

export type FileSlice = FileState & FileActions;

export const initialFileState: FileState = {
  file: null,
  fileName: null,
  fileSize: null,
  fileMimeType: null,
  sha256Hash: null,
};

export const createFileSlice: StateCreator<FileSlice, [], [], FileSlice> = (set) => ({
  ...initialFileState,

  setFile: (file: File) => set({
    file,
    fileName:     file.name,
    fileSize:     file.size,
    fileMimeType: file.type || 'application/octet-stream',
    sha256Hash:   null,
  }),

  setHash:   (sha256Hash: string) => set({ sha256Hash }),
  clearFile: ()           => set(initialFileState),
});
