import React from 'react';
import { Zap, Lock } from 'lucide-react';
import { formatSpeed, formatEta } from '../utils/format';

interface Props {
  percent: number;
  speedBps: number;
  etaSeconds: number;
}

export const TransferProgressBar: React.FC<Props> = ({ percent, speedBps, etaSeconds }) => (
  <div className="w-full flex flex-col items-center">
    <span className="font-h1 text-[11px] font-medium text-[#7C3AED] tracking-[0.1em] uppercase mb-[8px]">
      Transferring
    </span>
    
    <div className="font-display text-[36px] md:text-[48px] font-bold text-white mb-[16px] leading-none">
      {Math.round(percent)}%
    </div>
    
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Transfer progress"
      className="h-[8px] w-full bg-[#94A3B8]/10 rounded-[4px] overflow-hidden mb-[16px] relative"
    >
      <div
        className="h-full fiber-progress rounded-[4px] transition-[width] duration-500 ease-out relative overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
    
    <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-[8px] mb-[32px]">
      <div className="flex items-center gap-[6px] opacity-100 transition-opacity duration-200">
        <Zap className="w-[14px] h-[14px] text-[#7C3AED]" />
        <span className="font-h1 text-[14px] font-semibold text-white">{formatSpeed(speedBps)}</span>
      </div>
      <span className="font-body text-[14px] text-[#9CA3AF] opacity-100 transition-opacity duration-200">
        {formatEta(etaSeconds)} remaining
      </span>
    </div>
    
    <div className="w-full h-[1px] ghost-border mb-[16px]"></div>
    <div className="flex items-center justify-center gap-[6px]">
      <Lock className="w-[14px] h-[14px] text-[#9CA3AF]" />
      <span className="font-body text-[12px] text-[#9CA3AF]">
        DTLS Encrypted &middot; No server relay
      </span>
    </div>
    
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%) skewX(-15deg); }
        100% { transform: translateX(100%) skewX(-15deg); }
      }
    `}</style>
  </div>
);
