import React from 'react';
import { UserX } from 'lucide-react';

export const DisconnectedPanel: React.FC<{ isInitiator: boolean; onAction: () => void }> = ({ isInitiator, onAction }) => (
  <div className="text-center p-8 w-full">
    <UserX className="w-12 h-12 text-slate-400 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-slate-800 mb-2">Peer Disconnected</h3>
    <p className="text-slate-600 mb-8">
      {isInitiator ? 'The receiver' : 'The sender'} disconnected. Transfer incomplete.
    </p>
    <button 
      onClick={onAction}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
    >
      Start Over
    </button>
  </div>
);
