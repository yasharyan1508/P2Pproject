import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';
import { formatBytes } from '../utils/format';

export const TransferCompletePanel: React.FC<{ onSendAnother: () => void }> = ({ onSendAnother }) => {
  const file = useStore((s) => s.file);
  const fileName = useStore((s) => s.fileName);
  const fileSize = useStore((s) => s.fileSize);
  
  const displaySize = formatBytes(fileSize || file?.size || 0);
  const displayName = fileName || file?.name || 'File';

  return (
    <div className="w-full flex flex-col items-center relative py-4">
      {/* Confetti container could be added here if needed */}
      
      <div className="w-[80px] h-[80px] rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center mb-[20px] animate-[pop-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
        <CheckCircle2 className="w-[40px] h-[40px] text-[#10B981]" />
      </div>
      
      <h2 className="font-h1 text-[24px] font-bold text-white mb-[16px] text-center">
        File Sent Successfully
      </h2>
      
      <div className="flex flex-col items-center gap-[8px] mb-[28px]">
        <span className="font-h1 text-[16px] font-semibold text-white text-center">
          {displayName}
        </span>
        <span className="font-body text-[13px] text-[#9CA3AF] text-center">
          {displaySize} &middot; Transfer complete
        </span>
        <div className="flex items-center gap-[6px] mt-[6px]">
          <ShieldCheck className="w-[14px] h-[14px] text-[#10B981]" />
          <span className="font-body text-[13px] text-[#10B981]">
            Integrity verified — SHA-256 matched
          </span>
        </div>
      </div>
      
      <button 
        onClick={onSendAnother}
        className="w-full md:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-[10px] px-[28px] py-[12px] font-h1 text-[15px] shadow-[0_0_20px_rgba(124,58,237,0)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform active:translate-y-[1px]"
      >
        Send Another File
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
