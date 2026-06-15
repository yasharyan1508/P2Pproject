import React from 'react';
import { UserX } from 'lucide-react';

export const DisconnectedPanel: React.FC<{ isInitiator: boolean; onAction: () => void }> = ({ isInitiator, onAction }) => (
  <div className="text-center p-8 w-full">
    <UserX className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">Peer Disconnected</h3>
    <p className="text-[#9CA3AF] mb-8">
      {isInitiator ? 'The receiver' : 'The sender'} disconnected. Transfer incomplete.
    </p>
    <button 
      onClick={onAction}
      className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-lg transition-colors"
    >
      Start Over
    </button>
  </div>
);
