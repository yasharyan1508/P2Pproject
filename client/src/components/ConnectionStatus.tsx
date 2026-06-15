import React from 'react';
import type { TransferStatus } from '../types';

const STATUS_CONFIG = {
  idle:          { dot: 'bg-slate-300', text: 'Ready',         textColor: 'text-slate-500' },
  waiting_peer:  { dot: 'bg-amber-400 animate-pulse', text: 'Waiting for peer...', textColor: 'text-amber-600' },
  connecting:    { dot: 'bg-blue-400 animate-pulse',  text: 'Connecting...',        textColor: 'text-blue-600' },
  transferring:  { dot: 'bg-green-400 animate-pulse', text: 'Connected · Direct P2P', textColor: 'text-green-600' },
  verifying:     { dot: 'bg-green-400',              text: 'Verifying...',          textColor: 'text-green-600' },
  complete:      { dot: 'bg-green-500',              text: 'Complete',              textColor: 'text-green-600' },
  failed:        { dot: 'bg-red-400',                text: 'Failed',                textColor: 'text-red-600' },
  disconnected:  { dot: 'bg-slate-300',              text: 'Disconnected',          textColor: 'text-slate-500' },
};

export const ConnectionStatus: React.FC<{ status: TransferStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  );
};
