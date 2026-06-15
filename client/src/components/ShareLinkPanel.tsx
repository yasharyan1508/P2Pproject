import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  shareUrl: string;
}

export const ShareLinkPanel: React.FC<Props> = ({ shareUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard', { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full mb-[24px]">
        <p className="font-h1 text-[13px] font-medium text-[#9CA3AF] mb-[10px] text-left w-full">Share this link with the receiver</p>
        <div className="flex items-stretch gap-[12px] w-full">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="flex-1 px-[16px] py-[12px] bg-[#111118] ghost-border rounded-[10px] font-mono-label text-[13px] text-white outline-none truncate"
          />
          <button 
            onClick={handleCopy}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-[10px] px-[20px] font-h1 text-[15px] shadow-[0_0_20px_rgba(124,58,237,0)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center min-w-[120px] active:translate-y-[1px]"
          >
            {copied ? <span className="text-[#10B981]">Copied ✓</span> : 'Copy Link'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-[8px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[8px] h-[8px] rounded-full bg-[#F59E0B] animate-pulse"></div>
          <p className="font-body text-[14px] text-[#9CA3AF]">Waiting for receiver to open the link...</p>
        </div>
        <p className="font-body text-[12px] text-[#6B7280]">
          The link is valid until you close this tab.
        </p>
      </div>
      
      <a href="/" className="font-body text-[13px] text-[#7C3AED] hover:underline mt-[24px] cursor-pointer">
        Choose a different file
      </a>
    </div>
  );
};
