import React, { useState } from 'react';
import { useStore } from '../store';
import { useRoomAsSender } from '../hooks/useRoom';
import { FileDropZone } from '../components/FileDropZone';
import { computeSha256 } from '../lib/hasher';
import { readFileAsArrayBuffer } from '../lib/fileReader';

const SenderRoomManager: React.FC = () => {
  useRoomAsSender();
  return null;
};

export const HomePage: React.FC = () => {
  const file = useStore((state) => state.file);
  const setFile = useStore((state) => state.setFile);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.size === 0) {
      setValidationError('This file is empty.');
      return;
    }
    const maxMbStr = import.meta.env.VITE_MAX_FILE_SIZE_MB;
    const maxMb = maxMbStr ? parseInt(maxMbStr, 10) : 50;
    if (selectedFile.size > maxMb * 1024 * 1024) {
      setValidationError(`File exceeds ${maxMb} MB limit.`);
      return;
    }

    setValidationError(null);
    setFile(selectedFile);

    try {
      const buffer = await readFileAsArrayBuffer(selectedFile);
      const hash = await computeSha256(buffer);
      useStore.getState().setHash(hash);
    } catch (err) {
      console.error('Failed to compute hash:', err);
    }
  };

  return (
    <div className="w-full text-center flex flex-col items-center max-w-container_max_width px-margin_mobile md:px-0 py-12 pb-margin_desktop">
      {file && <SenderRoomManager />}
      
      {/* Hero Section */}
      <div className="w-full text-center mb-stack_lg">
        <h1 className="font-display-mobile md:font-display text-[30px] md:text-[36px] font-semibold tracking-[-0.02em] text-on-background mb-stack_sm">
          Transfer files. Direct.
        </h1>
        <div className="w-full h-[1px] ghost-border my-stack_md max-w-[48px] mx-auto"></div>
        <p className="font-body text-[16px] text-on-surface-variant max-w-[400px] mx-auto">
          No server. No storage. Browser to browser.
        </p>
      </div>

      {/* File Drop Zone Card */}
      <div className="w-full glass-card halo-glow rounded-xl p-stack_lg md:p-[40px] transition-all duration-500 relative">
        {file ? (
          <div className="w-full h-[180px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-on-surface font-body">Initializing secure room...</p>
            </div>
          </div>
        ) : (
          <FileDropZone onFileSelect={handleFileSelect} error={validationError} />
        )}
      </div>

      {/* Trust Indicators */}
      <div className="w-full mt-[48px] flex flex-col md:flex-row justify-center md:justify-between items-center gap-stack_lg">
        <div className="flex items-center gap-stack_sm">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-mono-label text-[11px] text-on-surface-variant uppercase tracking-[0.08em]">DTLS ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-stack_sm">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-mono-label text-[11px] text-on-surface-variant uppercase tracking-[0.08em]">NO UPLOAD SPEED LIMIT</span>
        </div>
        <div className="flex items-center gap-stack_sm">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <span className="font-mono-label text-[11px] text-on-surface-variant uppercase tracking-[0.08em]">NO SERVER LOGS</span>
        </div>
      </div>
    </div>
  );
};
