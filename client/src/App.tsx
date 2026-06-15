import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HomePage } from './pages/HomePage';
import { RoomPage } from './pages/RoomPage';
import { BrowserUnsupportedPage } from './pages/BrowserUnsupportedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ConnectionStatus } from './components/ConnectionStatus';
import { isWebRTCSupported, isCryptoSubtleSupported } from './utils/featureDetect';
import { useStore } from './store';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const status = useStore((state) => state.status);

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <header className="fixed top-0 w-full h-[72px] z-50 flex items-center justify-between px-6 md:px-10">
        <Link
          to="/"
          onClick={() => useStore.getState().resetAll()}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {/* Chain-link icon — shown on Home and Sender pages */}
          <svg fill="none" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg" className="text-[#7C3AED]" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="font-display text-[20px] font-bold tracking-tight">
            <span className="text-[#7C3AED]">P2P</span>
            <span className="text-white"> Share</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ConnectionStatus status={status} />
          {(status === 'waiting_peer' || status === 'connecting' || status === 'ready_to_send' || status === 'transferring' || status === 'verifying') && (
            <button
              onClick={() => {
                if ((status === 'transferring' || status === 'verifying') && !window.confirm('A file transfer is in progress. Exit and cancel?')) return;
                import('./lib/socketClient').then(({ destroySocket }) => destroySocket());
                useStore.getState().resetAll();
                window.location.href = '/';
              }}
              className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-all
                ${(status === 'transferring' || status === 'verifying')
                  ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
                  : 'border border-white/70 text-white hover:bg-white/10'
                }`}
            >
              {(status === 'transferring' || status === 'verifying') ? '✕ Exit Room' : 'Exit Room'}
            </button>
          )}
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center z-10 pt-[72px]">
        {children}
      </main>
      <Toaster position="top-right" richColors closeButton theme="dark" />
    </div>
  );
};

export default function App() {
  if (!isWebRTCSupported() || !isCryptoSubtleSupported()) {
    return <BrowserUnsupportedPage />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
