import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full text-center flex flex-col items-center max-w-container_max_width px-margin_mobile md:px-0 py-12 pb-margin_desktop">
      <div className="w-full glass-card halo-glow rounded-xl p-stack_lg md:p-[40px] flex flex-col items-center relative z-10 text-center">
        <div 
          className="w-[80px] h-[80px] rounded-full border flex items-center justify-center mb-[20px]"
          style={{ backgroundColor: 'rgba(148, 163, 184, 0.1)', borderColor: 'rgba(148, 163, 184, 0.15)' }}
        >
          <HelpCircle className="w-[40px] h-[40px] text-on-surface-variant" />
        </div>
        
        <h1 className="font-display text-[30px] md:text-[36px] font-semibold text-on-surface mb-[16px]">
          Page Not Found
        </h1>
        
        <p className="font-body text-[16px] text-on-surface-variant max-w-[400px] mb-[32px] leading-[1.6]">
          We couldn't find the page you were looking for. It may have been moved or doesn't exist.
        </p>
        
        <Link 
          to="/" 
          className="bg-primary hover:bg-[#4F7EFF] text-white rounded-[10px] px-[28px] py-[12px] font-h1 text-[15px] shadow-[0_0_20px_rgba(59,110,248,0)] hover:shadow-[0_0_20px_rgba(59,110,248,0.4)] transition-all transform active:translate-y-[1px]"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};
