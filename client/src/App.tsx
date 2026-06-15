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

const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 circuit-grid opacity-30"></div>
    <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] orb-cobalt animate-pulse" style={{ opacity: 0.315 }}></div>
    <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] orb-violet"></div>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const status = useStore((state) => state.status);

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <AmbientBackground />
      <header className="fixed top-0 w-full h-[64px] z-50 flex items-center justify-between px-margin_mobile md:px-margin_desktop max-w-[1440px] bg-background/80 backdrop-blur-xl border-b border-outline-variant/10">
        <Link to="/" onClick={() => useStore.getState().resetAll()} className="flex items-center gap-gutter text-primary-container hover:text-primary transition-colors">
          <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            <circle cx="12" cy="12" fill="currentColor" fillOpacity="0.2" r="3" stroke="currentColor" strokeWidth="1.5"></circle>
          </svg>
          <span className="font-h1 text-[16px] font-semibold tracking-tight text-on-background">P2P Share</span>
        </Link>
        <ConnectionStatus status={status} />
      </header>
      <main className="flex-1 w-full flex flex-col items-center z-10 pt-[64px]">
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
