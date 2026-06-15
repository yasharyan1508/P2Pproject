import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

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
        className={`w-full h-[160px] md:h-[180px] rounded-xl border-2 flex flex-col items-center justify-center gap-stack_sm group cursor-pointer transition-all duration-150 relative overflow-hidden
          ${dragActive 
            ? 'border-primary border-solid bg-[#3B6EF8]/10 shadow-[0_0_0_4px_rgba(59,110,248,0.15)]' 
            : 'border-dashed border-outline-variant/25 bg-[#3B6EF8]/5 hover:bg-[#3B6EF8]/10'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) onFileSelect(e.target.files[0]);
          }}
        />
        
        <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center text-primary transition-transform duration-150 ${dragActive ? 'scale-110 bg-[#3B6EF8]/20 border border-[#3B6EF8]/40' : 'bg-[#3B6EF8]/10 border border-[#3B6EF8]/20 group-hover:scale-[1.05]'}`}>
          <Upload className={`w-[28px] h-[28px] transition-transform duration-150 ${dragActive ? 'scale-110' : ''}`} />
        </div>
        
        <div className="flex flex-col items-center gap-base">
          <span className="font-h1 text-[16px] text-on-surface">
            {dragActive ? 'Release to send' : 'Drop your file here'}
          </span>
          {!dragActive && (
            <div className="flex flex-col items-center gap-base">
              <span className="font-body text-[13px] text-on-surface-variant">or</span>
              <button 
                type="button" 
                className="bg-primary hover:bg-[#4F7EFF] text-white rounded-[10px] px-[28px] py-[12px] font-h1 text-[15px] shadow-[0_0_20px_rgba(59,110,248,0)] hover:shadow-[0_0_20px_rgba(59,110,248,0.4)] transition-all transform active:translate-y-[1px]"
              >
                Browse file
              </button>
            </div>
          )}
        </div>
        
        {!dragActive && (
          <span className="font-body text-[12px] text-on-surface-variant mt-2">Max 50 MB</span>
        )}
      </div>
      {error && <p className="mt-4 text-error text-[14px] text-center font-body">{error}</p>}
    </div>
  );
};
