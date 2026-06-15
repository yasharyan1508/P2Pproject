import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export const ConnectingPanel: React.FC = () => {
  const [showLongWait, setShowLongWait] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLongWait(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      {/* Headline */}
      <h2 className="font-h1 text-[18px] font-semibold text-white mb-[40px] text-center">
        Establishing direct connection
      </h2>

      {/* Node Diagram */}
      <div className="relative flex items-center justify-between w-[240px] mb-[16px]">
        {/* Dashed Line */}
        <div className="absolute left-[24px] right-[24px] top-[24px] h-[1px] border-t border-dashed border-[#7C3AED]/30 z-0">
          {/* Traveling dot */}
          <div className="absolute top-[-3px] left-0 w-[6px] h-[6px] rounded-full bg-[#7C3AED] z-10 animate-[slide-right_1.5s_linear_infinite]"></div>
        </div>

        {/* Left Node */}
        <div className="flex flex-col items-center gap-[12px] z-10">
          <div className="w-[48px] h-[48px] rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] flex items-center justify-center">
            <div className="w-[8px] h-[8px] rounded-full bg-[#7C3AED]"></div>
          </div>
          <span className="font-h1 text-[12px] font-medium text-white">You</span>
        </div>

        {/* Right Node */}
        <div className="flex flex-col items-center gap-[12px] z-10">
          <div className="w-[48px] h-[48px] rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] flex items-center justify-center">
            <div className="w-[8px] h-[8px] rounded-full bg-[#7C3AED]"></div>
          </div>
          <span className="font-h1 text-[12px] font-medium text-white">Peer</span>
        </div>
      </div>

      {/* Explanation Text */}
      <p className="font-body text-[14px] text-[#9CA3AF] text-center max-w-[320px] mb-[24px] leading-[1.6]">
        Performing WebRTC ICE negotiation. Usually takes 2–5 seconds.
      </p>

      {/* Three-dot loader */}
      <div className="flex items-center justify-center gap-[6px] mb-[40px]">
        <div className="w-[8px] h-[8px] rounded-full bg-[#7C3AED] animate-[pulse_1s_ease-in-out_infinite]"></div>
        <div className="w-[8px] h-[8px] rounded-full bg-[#7C3AED] animate-[pulse_1s_ease-in-out_infinite_200ms]"></div>
        <div className="w-[8px] h-[8px] rounded-full bg-[#7C3AED] animate-[pulse_1s_ease-in-out_infinite_400ms]"></div>
      </div>

      {/* Long Wait Variant Text */}
      {showLongWait && (
        <p className="font-body text-[13px] text-[#F59E0B] text-center mb-[24px] animate-[fade-in-up_0.5s_ease-out]">
          Taking longer than usual. This may happen on restricted networks.
        </p>
      )}

      {/* Security Assurance Badge */}
      <div className="flex items-center gap-[6px] px-[16px] py-[6px] rounded-full ghost-border">
        <Shield className="w-[14px] h-[14px] text-[#9CA3AF]" />
        <span className="font-body text-[12px] text-[#9CA3AF]">
          DTLS encrypted &middot; No server relay
        </span>
      </div>
      
      <style>{`
        @keyframes slide-right {
          0% { left: 0%; }
          100% { left: 100%; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
