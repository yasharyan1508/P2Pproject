import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const BrowserUnsupportedPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center w-full px-5 md:px-0 py-12" style={{ backgroundColor: '#0D0D13' }}>
    <div 
      className="w-[80px] h-[80px] rounded-full border flex items-center justify-center mb-[20px]"
      style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
    >
      <AlertTriangle className="w-[40px] h-[40px]" style={{ color: '#EF4444' }} />
    </div>
    
    <h1 className="font-display text-[30px] md:text-[36px] font-semibold text-white mb-[16px] text-center">
      Browser Unsupported
    </h1>
    
    <p className="font-body text-[16px] text-[#9CA3AF] max-w-[400px] mb-[32px] leading-[1.6] text-center">
      Your browser doesn't support the required WebRTC features for direct P2P file transfers.
    </p>
    
    <div className="w-full text-left bg-white/5 border border-white/10 p-[24px] rounded-[10px] text-[14px] text-[#9CA3AF] max-w-[400px] mx-auto">
      <p className="font-semibold mb-[12px] text-white">Please use a modern browser such as:</p>
      <ul className="list-disc pl-[20px] space-y-[8px] font-body">
        <li>Google Chrome (latest)</li>
        <li>Mozilla Firefox (latest)</li>
        <li>Apple Safari (15+)</li>
        <li>Microsoft Edge (latest)</li>
      </ul>
    </div>
  </div>
);
