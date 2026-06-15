import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const BrowserUnsupportedPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center w-full px-margin_mobile md:px-0 py-12 pb-margin_desktop bg-background text-on-background relative overflow-hidden">
    {/* Ambient Background mock since it's not wrapped in Layout */}
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 circuit-grid opacity-30"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] orb-cobalt animate-pulse" style={{ opacity: 0.315 }}></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] orb-violet"></div>
    </div>
    
    <div className="w-full max-w-container_max_width glass-card halo-glow rounded-xl p-stack_lg md:p-[40px] flex flex-col items-center relative z-10 text-center">
      <div 
        className="w-[80px] h-[80px] rounded-full border flex items-center justify-center mb-[20px]"
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
      >
        <AlertTriangle className="w-[40px] h-[40px]" style={{ color: '#EF4444' }} />
      </div>
      
      <h1 className="font-display text-[30px] md:text-[36px] font-semibold text-on-surface mb-[16px]">
        Browser Unsupported
      </h1>
      
      <p className="font-body text-[16px] text-on-surface-variant max-w-[400px] mb-[32px] leading-[1.6]">
        Your browser doesn't support the required WebRTC features for direct P2P file transfers.
      </p>
      
      <div className="w-full text-left bg-primary-container/5 border border-outline-variant/10 p-[24px] rounded-[10px] text-[14px] text-on-surface-variant max-w-[400px] mx-auto">
        <p className="font-h1 font-semibold mb-[12px] text-on-surface">Please use a modern browser such as:</p>
        <ul className="list-disc pl-[20px] space-y-[8px] font-body">
          <li>Google Chrome (latest)</li>
          <li>Mozilla Firefox (latest)</li>
          <li>Apple Safari (15+)</li>
          <li>Microsoft Edge (latest)</li>
        </ul>
      </div>
    </div>
  </div>
);
