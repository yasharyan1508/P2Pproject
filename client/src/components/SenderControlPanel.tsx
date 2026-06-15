import React, { useState } from 'react';
import { toast } from 'sonner';
import { useStore } from '../store';
import { FileDropZone } from './FileDropZone';
import { FilePreviewCard } from './FilePreviewCard';
import { computeSha256 } from '../lib/hasher';
import { readFileAsArrayBuffer } from '../lib/fileReader';
import { Upload } from 'lucide-react';

interface Props {
  roomId: string;
}

export const SenderControlPanel: React.FC<Props> = ({ roomId }) => {
  const file = useStore((state) => state.file);
  const status = useStore((state) => state.status);
  const setFile = useStore((state) => state.setFile);
  const setStatus = useStore((state) => state.setStatus);
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success('Room ID copied to clipboard', { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleSend = () => {
    if (file && status === 'ready_to_send') {
      setStatus('transferring');
    }
  };

  const canSend = file !== null && status === 'ready_to_send';

return (
  <div className="w-full flex flex-col items-center max-w-[520px]">

    {/* Room ID block */}
    <div className="w-full flex flex-col items-center mb-8 mt-4">
      {/* Giant Room ID */}
      <div
        onClick={handleCopy}
        className="cursor-pointer group mb-3"
        title="Click to copy Room ID"
      >
        {copied ? (
          <h2 className="font-['JetBrains_Mono'] text-[64px] md:text-[80px] font-bold text-[#10B981] tracking-[0.15em] leading-none transition-colors">
            COPIED
          </h2>
        ) : (
          <h2 className="font-['JetBrains_Mono'] text-[64px] md:text-[80px] font-bold text-white tracking-[0.15em] leading-none group-hover:text-gray-200 transition-colors">
            {roomId}
          </h2>
        )}
      </div>

      {/* Sub-text */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p className="text-[15px] text-[#9CA3AF]">Share the Room ID with receiver!</p>
      </div>

      {/* Copy full link button */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
          toast.success('Join link copied!', { duration: 2000 });
        }}
        className="text-[14px] text-[#7C3AED] border border-[#7C3AED]/60 rounded-lg px-6 py-2 hover:bg-[#7C3AED]/10 transition-colors"
      >
        Or copy full join link
      </button>
    </div>

    {/* File drop zone or file preview */}
    <div className="w-full mb-6">
      {!file ? (
        <FileDropZone onFileSelect={handleFileSelect} error={validationError} />
      ) : (
        <div className="relative">
          <FilePreviewCard file={file} />
          <button
            onClick={() => useStore.getState().clearFile()}
            className="absolute -top-3 -right-3 w-7 h-7 bg-[#161622] border border-white/10 hover:border-red-500 hover:text-red-400 rounded-full flex items-center justify-center text-white/60 transition-all text-[16px] leading-none"
            title="Remove file"
          >
            ×
          </button>
        </div>
      )}
    </div>

    {/* Send button */}
    <button
      onClick={handleSend}
      disabled={!canSend}
      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-[#161622] disabled:text-white/30 disabled:border disabled:border-white/10 disabled:cursor-not-allowed text-white rounded-xl px-6 py-4 font-semibold text-[16px] shadow-[0_0_20px_rgba(124,58,237,0)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-3 active:translate-y-[1px]"
    >
      <Upload className="w-5 h-5" />
      Send File
    </button>
  </div>
);
};
