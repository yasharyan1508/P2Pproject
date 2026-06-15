import { Server, Socket } from 'socket.io';
import { RoomStore } from './roomStore';
import { validateCreateRoom, validateJoinRoom, validateSignal } from './validation';

// Rate Limiter for create-room events
// Limits each IP to 10 room creations per minute
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_ROOMS_PER_WINDOW = 10;
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let record = rateLimiter.get(ip);
  
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimiter.set(ip, record);
    return true;
  }
  
  if (record.count >= MAX_ROOMS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

// Cleanup rate limiter map every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimiter.entries()) {
    if (now > record.resetTime) {
      rateLimiter.delete(ip);
    }
  }
}, 5 * 60_000);

/**
 * Sets up Socket.io event handlers for signaling and room management.
 * 
 * @param io - The Socket.io Server instance
 * @param roomStore - The RoomStore instance for managing active rooms
 */
export function setupHandlers(io: Server, roomStore: RoomStore): void {
  io.on('connection', (socket: Socket) => {
    // Get IP address from socket handshake
    const clientIp = socket.handshake.address || socket.conn.remoteAddress;
    
    /**
     * Handles room creation requests from initiators (senders).
     * Validates payload, checks rate limits, and registers the room.
     */
    socket.on('create-room', (payload: unknown) => {
      if (!validateCreateRoom(payload)) {
        socket.emit('room-error', { message: 'Invalid room ID format' });
        return;
      }
      
      if (!checkRateLimit(clientIp)) {
        socket.emit('room-error', { message: 'Rate limit exceeded. Please wait a minute before creating another room.' });
        return;
      }
      
      const { roomId } = payload;
      if (!roomStore.createRoom(roomId, socket.id)) {
        socket.emit('room-error', { message: 'Room already exists' });
        return;
      }
      socket.join(roomId);
      socket.emit('room-created', { roomId });
    });

    /**
     * Handles join requests from receivers.
     * Validates room ID, checks room capacity, and notifies peers upon success.
     */
    socket.on('join-room', (payload: unknown) => {
      if (!validateJoinRoom(payload)) {
        socket.emit('room-error', { message: 'Invalid room ID format' });
        return;
      }
      const { roomId } = payload;
      const result = roomStore.joinRoom(roomId, socket.id);
      switch (result) {
        case 'room-not-found':
          socket.emit('room-not-found', { roomId });
          return;
        case 'room-full':
          socket.emit('room-full', { roomId });
          return;
        case 'success': {
          socket.join(roomId);
          const otherPeer = roomStore.getOtherPeer(roomId, socket.id);
          socket.emit('join-confirmed', { roomId });
          if (otherPeer) {
            io.to(otherPeer).emit('peer-joined', { peerId: socket.id });
          }
          break;
        }
      }
    });

    /**
     * Handles WebRTC signaling data exchange between peers.
     * Validates payload structure and securely routes signal data without inspection.
     */
    socket.on('signal', (payload: unknown) => {
      if (!validateSignal(payload)) {
        socket.emit('room-error', { message: 'Invalid signal payload' });
        return;
      }
      const { roomId, signalData } = payload;
      const otherPeer = roomStore.getOtherPeer(roomId, socket.id);
      if (!otherPeer) {
        socket.emit('room-error', { message: 'Signal target not found' });
        return;
      }
      // Zero content inspection - just forward
      io.to(otherPeer).emit('signal', { signalData });
    });

    /**
     * Handles socket disconnect events.
     * Cleans up room membership and notifies any remaining peer.
     */
    socket.on('disconnect', () => {
      const result = roomStore.removeSocket(socket.id);
      if (result) {
        if (result.remainingPeer) {
          io.to(result.remainingPeer).emit('peer-disconnected', {
            message: 'Your peer disconnected.',
          });
        }
        console.log(`[INFO] Socket disconnected. Room ${result.roomId} ${result.remainingPeer ? 'has 1 peer remaining' : 'destroyed'}`);
      }
    });
  });
}
