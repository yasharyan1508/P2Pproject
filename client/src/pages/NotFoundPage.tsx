import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-5 md:px-0 pb-10">
      <div 
        className="w-[80px] h-[80px] rounded-full border flex items-center justify-center mb-[20px]"
        style={{ backgroundColor: 'rgba(148, 163, 184, 0.1)', borderColor: 'rgba(148, 163, 184, 0.15)' }}
      >
        <HelpCircle className="w-[40px] h-[40px] text-[#9CA3AF]" />
      </div>
      
      <h1 className="font-display text-[30px] md:text-[36px] font-semibold text-white mb-[16px] text-center">
        Page Not Found
      </h1>
      
      <p className="font-body text-[16px] text-[#9CA3AF] max-w-[400px] mb-[32px] leading-[1.6] text-center">
        We couldn't find the page you were looking for. It may have been moved or doesn't exist.
      </p>
      
      <Link 
        to="/" 
        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full px-[28px] py-[12px] font-semibold text-[15px] transition-all transform active:translate-y-[1px]"
      >
        Go to Homepage
      </Link>
    </div>
  );
};
