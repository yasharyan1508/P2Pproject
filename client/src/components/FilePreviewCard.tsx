import React from 'react';
import { File as FileIcon, Loader2 } from 'lucide-react';
import { formatBytes } from '../utils/format';

interface Props {
  file: File | { name: string; size: number; type: string };
  onClear?: () => void;
  isHashComputing?: boolean;
}

export const FilePreviewCard: React.FC<Props> = ({ file, onClear, isHashComputing }) => {
  return (
    <div className="flex items-center justify-between pb-[20px] mb-[20px] border-b ghost-border w-full">
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        <div className="w-[44px] h-[52px] flex-shrink-0 flex items-center justify-center text-[#9CA3AF] relative bg-[#0D0D13] rounded-md border border-white/10">
          <FileIcon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-h1 text-[15px] font-semibold text-white truncate">{file.name}</p>
          <p className="font-body text-[13px] text-[#9CA3AF] mt-[4px]">
            {formatBytes(file.size)} &middot; {file.type || 'Unknown type'}
          </p>
          {isHashComputing && (
            <div className="flex items-center gap-[6px] mt-[6px]">
              <Loader2 className="w-[14px] h-[14px] text-[#9CA3AF] animate-spin" />
              <span className="font-body text-[12px] text-[#9CA3AF]">Computing integrity hash...</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        {onClear && (
          <button 
            onClick={onClear}
            className="font-h1 text-[13px] font-medium text-[#9CA3AF] hover:text-white transition-colors border border-transparent hover:border-white/10 px-3 py-1.5 rounded-lg"
          >
            &times; Change
          </button>
        )}
      </div>
    </div>
  );
};
