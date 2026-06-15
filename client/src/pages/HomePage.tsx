import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomAsSender } from '../hooks/useRoom';


const SenderRoomManager: React.FC = () => {
  useRoomAsSender();
  return null;
};

export const HomePage: React.FC = () => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomIdToJoin.trim()) {
      navigate(`/room/${roomIdToJoin.trim()}`);
    }
  };

  return (
  <div className="w-full min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-5 md:px-0 pb-10">
    {isCreatingRoom && <SenderRoomManager />}

    {/* Hero */}
    <div className="w-full text-center mb-10">
      <h1 className="font-display text-[48px] md:text-[64px] font-bold tracking-tight text-white mb-3 leading-tight">
        Transfer files. Direct.
      </h1>
      <p className="text-[18px] text-[#9CA3AF]">
        No server. No storage. Browser to browser.
      </p>
    </div>

    {/* Actions */}
    <div className="w-full max-w-[440px] flex flex-col items-center gap-5">
      {isCreatingRoom ? (
        <div className="w-full h-[56px] flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-[15px]">Initializing secure room...</p>
        </div>
      ) : (
        <>
          {/* Create Room — white pill */}
          <button
            onClick={() => setIsCreatingRoom(true)}
            className="w-full bg-white text-black font-bold text-[17px] rounded-full py-[14px] hover:bg-gray-100 transition-colors"
          >
            Create Room
          </button>

          <span className="text-[13px] text-[#6B7280] font-medium tracking-widest">OR</span>

          {/* Join Room — dark pill input + button */}
          <form onSubmit={handleJoin} className="relative w-full">
            <input
              type="text"
              placeholder="ENTER ROOM ID"
              value={roomIdToJoin}
              onChange={(e) => setRoomIdToJoin(e.target.value.toUpperCase())}
              className="w-full bg-[#111118] border border-white/10 rounded-full pl-6 pr-[100px] py-[14px] text-[15px] text-white outline-none focus:border-[#7C3AED]/60 transition-colors placeholder:text-[#6B7280] uppercase tracking-widest font-['JetBrains_Mono']"
            />
            <button
              type="submit"
              disabled={!roomIdToJoin.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1F1F2E] text-white hover:bg-[#2A2A3E] disabled:opacity-40 disabled:cursor-not-allowed rounded-full px-6 py-2 font-semibold text-[14px] transition-colors"
            >
              Join
            </button>
          </form>
        </>
      )}
    </div>

    {/* Trust indicators */}
    <div className="w-full mt-16 flex flex-col md:flex-row justify-center items-center gap-10">
      {/* DTLS Encrypted */}
      <div className="flex flex-col items-center gap-2">
        <svg className="w-7 h-7 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span className="text-[13px] text-[#9CA3AF]">DTLS Encrypted</span>
      </div>
      {/* No Upload Speed Limit */}
      <div className="flex flex-col items-center gap-2">
        <svg className="w-7 h-7 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        <span className="text-[13px] text-[#9CA3AF]">No Upload Speed Limit</span>
      </div>
      {/* No Server Logs */}
      <div className="flex flex-col items-center gap-2">
        <svg className="w-7 h-7 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
        <span className="text-[13px] text-[#9CA3AF]">No Server Logs</span>
      </div>
    </div>
  </div>
);
};
