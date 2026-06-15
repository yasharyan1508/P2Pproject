import React, { useState, useRef } from 'react';


interface Props {
  onFileSelect: (file: File) => void;
  error?: string | null;
}

export const FileDropZone: React.FC<Props> = ({ onFileSelect, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = () => setDragActive(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleClick = () => fileInputRef.current?.click();
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
  };

return (
  <div className="w-full">
    <div
      role="region"
      aria-label="File drop zone"
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`w-full min-h-[200px] py-8 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-150
        ${dragActive
          ? 'border-[#7C3AED] border-solid bg-[#7C3AED]/10 shadow-[0_0_0_4px_rgba(124,58,237,0.15)]'
          : 'border-dashed border-[#2A2A3E] bg-[#111118] hover:border-[#7C3AED]/40'
        }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) onFileSelect(e.target.files[0]);
        }}
      />

      {/* Upload icon */}
      <svg
        className={`w-10 h-10 text-[#7C3AED] transition-transform duration-150 ${dragActive ? 'scale-110' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>

      {/* Labels */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[16px] font-semibold text-white">
          {dragActive ? 'Release to send' : 'Drop your file here'}
        </span>
        {!dragActive && (
          <>
            <span className="text-[13px] text-[#6B7280]">or</span>
            <button
              type="button"
              className="border border-white/20 text-white bg-transparent hover:bg-white/5 rounded-lg px-5 py-2 text-[14px] font-medium transition-colors"
            >
              Browse file
            </button>
            <span className="text-[12px] text-[#6B7280] mt-1">Max 50 MB</span>
          </>
        )}
      </div>
    </div>
    {error && <p className="mt-3 text-red-400 text-[13px] text-center">{error}</p>}
  </div>
);
};
