import { io, Socket } from 'socket.io-client';

let _socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!_socket) {
    _socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      autoConnect: false,   // Must call socket.connect() explicitly
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return _socket;
};

export const destroySocket = (): void => {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
};
