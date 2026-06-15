import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../lib/socketClient';
import { useStore } from '../store';

export function useSocket(): { socket: Socket | null; isConnected: boolean } {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect    = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = () => {
      useStore.getState().setError('server_unreachable',
        'Unable to reach the server. Check your internet connection.');
    };

    socket.on('connect',       handleConnect);
    socket.on('disconnect',    handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Register beforeunload cleanup
    const handleBeforeUnload = () => socket.disconnect();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('connect',       handleConnect);
      socket.off('disconnect',    handleDisconnect);
      socket.off('connect_error', handleConnectError);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
