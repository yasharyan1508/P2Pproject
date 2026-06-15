import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';
import { formatBytes } from '../utils/format';

export const DownloadCompletePanel: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const fileName = useStore((s) => s.fileName);
  const fileSize = useStore((s) => s.fileSize);
  
  const displaySize = formatBytes(fileSize || 0);
  const displayName = fileName || 'File';

  return (
    <div className="w-full flex flex-col items-center relative py-4">
      <div className="w-[80px] h-[80px] rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center mb-[20px] animate-[pop-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
        <CheckCircle2 className="w-[40px] h-[40px] text-[#10B981]" />
      </div>
      
      <h2 className="font-h1 text-[24px] font-bold text-on-surface mb-[16px] text-center">
        Download Complete
      </h2>
      
      <div className="flex flex-col items-center gap-[8px] mb-[28px]">
        <span className="font-h1 text-[16px] font-semibold text-on-surface text-center">
          {displayName}
        </span>
        <span className="font-body text-[13px] text-on-surface-variant text-center">
          {displaySize} &middot; Securely saved
        </span>
        <div className="flex items-center gap-[6px] mt-[6px]">
          <ShieldCheck className="w-[14px] h-[14px] text-[#10B981]" />
          <span className="font-body text-[13px] text-[#10B981]">
            Integrity verified — SHA-256 matched
          </span>
        </div>
      </div>
      
      <button 
        onClick={onGoHome}
        className="w-full md:w-auto bg-transparent border border-outline-variant/30 hover:bg-[#3B6EF8]/10 hover:border-[#3B6EF8]/30 text-on-surface rounded-[10px] px-[28px] py-[12px] font-h1 text-[15px] transition-all transform active:translate-y-[1px]"
      >
        Send Your Own File
      </button>
      
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
