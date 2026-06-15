import React from 'react';
import type { TransferStatus } from '../types';

const STATUS_CONFIG: Record<string, { text: string }> = {
  idle:          { text: 'Ready' },
  waiting_peer:  { text: 'Waiting for peer...' },
  connecting:    { text: 'Connecting...' },
  ready_to_send: { text: 'Ready' },
  transferring:  { text: 'Connected · Direct P2P' },
  verifying:     { text: 'Verifying...' },
  complete:      { text: 'Complete' },
  failed:        { text: 'Failed' },
  disconnected:  { text: 'Disconnected' },
};

export const ConnectionStatus: React.FC<{ status: TransferStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  return (
    <span className="text-[15px] text-[#9CA3AF] font-normal">
      {config.text}
    </span>
  );
};
