import React from 'react';
import { Link2Off, Ban, WifiOff, AlertTriangle, UserX, CloudOff } from 'lucide-react';
import type { ErrorType } from '../types';

interface ErrorStyle {
  icon: any;
  colorHex: string;
  headline: string;
  body: string;
  primaryLabel: string;
  secondaryLabel?: string;
}

const ERROR_CONFIG: Record<ErrorType, ErrorStyle> = {
  room_not_found:     { icon: Link2Off,    colorHex: '#EF4444', headline: 'Link Not Valid', body: 'This link has expired or the sender has disconnected. Ask the sender to generate a new link.', primaryLabel: 'Go to Homepage' },
  room_full:          { icon: Ban,         colorHex: '#EF4444', headline: 'Room Full',      body: 'This link is already in use between two people. Each link supports exactly one sender and one receiver.', primaryLabel: 'Go to Homepage' },
  ice_failed:         { icon: WifiOff,     colorHex: '#F97316', headline: 'Can\'t Establish Connection', body: 'A direct connection couldn\'t be established. This often happens on restricted networks. Try a different network or connection.', primaryLabel: 'Try Again', secondaryLabel: 'Go to Homepage' },
  hash_mismatch:      { icon: AlertTriangle, colorHex: '#EF4444', headline: 'File Corrupted', body: 'The file didn\'t arrive intact. Download was blocked to protect you. Ask the sender to try again.', primaryLabel: 'Retry Transfer', secondaryLabel: 'Go to Homepage' },
  incomplete_transfer:{ icon: AlertTriangle, colorHex: '#EF4444', headline: 'Transfer Incomplete', body: 'Some data was lost in transit. The partial file has been discarded.', primaryLabel: 'Retry Transfer' },
  peer_disconnected:  { icon: UserX,       colorHex: '#94A3B8', headline: 'Peer Disconnected', body: 'The connection was closed before the transfer completed. The partial file has been discarded.', primaryLabel: 'Go to Homepage' },
  server_unreachable: { icon: CloudOff,    colorHex: '#94A3B8', headline: 'Server Unreachable', body: 'Cannot connect to the signaling server. Check your internet connection and try again.', primaryLabel: 'Retry Connection' },
};

// Helper function to hex to rgba
const getRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface Props {
  errorType: ErrorType;
  onPrimary: () => void;
  onSecondary?: () => void;
}

export const ErrorPanel: React.FC<Props> = ({ errorType, onPrimary, onSecondary }) => {
  const config = ERROR_CONFIG[errorType];
  const Icon = config.icon;

  const bgStyle = { backgroundColor: getRgba(config.colorHex, 0.15), borderColor: getRgba(config.colorHex, 0.3) };
  
  return (
    <div className="flex flex-col items-center justify-center py-4 w-full relative">
      <div 
        className="w-[80px] h-[80px] rounded-full border flex items-center justify-center mb-[20px]"
        style={bgStyle}
      >
        <Icon className="w-[40px] h-[40px]" style={{ color: config.colorHex }} />
      </div>
      
      <h3 className="font-h1 text-[24px] font-bold text-on-surface mb-[16px] text-center">{config.headline}</h3>
      <p className="font-body text-[14px] text-on-surface-variant text-center mb-[28px] max-w-[320px] leading-[1.6]">{config.body}</p>
      
      <div className="flex flex-col gap-[12px] w-full md:w-auto items-center">
        <button 
          onClick={onPrimary} 
          className="w-full md:w-auto bg-primary hover:bg-[#4F7EFF] text-white rounded-[10px] px-[28px] py-[12px] font-h1 text-[15px] shadow-[0_0_20px_rgba(59,110,248,0)] hover:shadow-[0_0_20px_rgba(59,110,248,0.4)] transition-all transform active:translate-y-[1px]"
        >
          {config.primaryLabel}
        </button>
        {config.secondaryLabel && onSecondary && (
          <button 
            onClick={onSecondary} 
            className="w-full md:w-auto bg-transparent border border-outline-variant/30 hover:bg-[#3B6EF8]/10 hover:border-[#3B6EF8]/30 text-on-surface rounded-[10px] px-[28px] py-[12px] font-h1 text-[15px] transition-all transform active:translate-y-[1px]"
          >
            {config.secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
};
