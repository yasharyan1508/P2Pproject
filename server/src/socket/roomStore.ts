import { Room } from '../types';

export class RoomStore {
  private rooms:        Map<string, Room>   = new Map();
  private socketToRoom: Map<string, string> = new Map();

  /**
   * Creates a new room and adds the initiator socket to it.
   * 
   * @param roomId - Unique identifier for the room
   * @param socketId - Socket ID of the room creator
   * @returns True if room was created successfully, false if room already exists
   */
  createRoom(roomId: string, socketId: string): boolean {
    if (this.rooms.has(roomId)) return false;            // Room already exists → reject
    const room: Room = {
      roomId,
      peers: [socketId],
      createdAt: Date.now(),
    };
    this.rooms.set(roomId, room);
    this.socketToRoom.set(socketId, roomId);
    return true;
  }

  /**
   * Joins an existing room if it has capacity.
   * 
   * @param roomId - Unique identifier for the room
   * @param socketId - Socket ID of the joining peer
   * @returns 'success' | 'room-not-found' | 'room-full' based on outcome
   */
  joinRoom(roomId: string, socketId: string): 'success' | 'room-not-found' | 'room-full' {
    const room = this.rooms.get(roomId);
    if (!room)                        return 'room-not-found';
    // If this socket is already in the room, treat as idempotent success
    if (room.peers.includes(socketId)) return 'success';
    if (room.peers.length >= 2)        return 'room-full';
    room.peers.push(socketId);
    this.socketToRoom.set(socketId, roomId);
    return 'success';
  }

  /**
   * Retrieves the socket ID of the other peer in the room.
   * 
   * @param roomId - Unique identifier for the room
   * @param mySocketId - Socket ID of the requesting peer
   * @returns The socket ID of the other peer, or null if alone/not found
   */
  getOtherPeer(roomId: string, mySocketId: string): string | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    return room.peers.find(id => id !== mySocketId) ?? null;
  }

  /**
   * Retrieves the room associated with a given socket ID.
   * 
   * @param socketId - Socket ID to look up
   * @returns The Room object if found, otherwise null
   */
  getRoomBySocket(socketId: string): Room | null {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return null;
    return this.rooms.get(roomId) ?? null;
  }

  /**
   * Removes a socket from its associated room and cleans up empty rooms.
   * 
   * @param socketId - Socket ID to remove
   * @returns Object containing the roomId and any remaining peer's socket ID, or null if socket not in a room
   */
  removeSocket(socketId: string): { roomId: string; remainingPeer: string | null } | null {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return null;
    this.socketToRoom.delete(socketId);

    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.peers = room.peers.filter(id => id !== socketId);
    const remainingPeer = room.peers[0] ?? null;

    if (room.peers.length === 0) {
      this.rooms.delete(roomId);    // Room is empty → destroy it
    }

    return { roomId, remainingPeer };
  }

  /**
   * Evicts rooms that have existed longer than the specified maximum age.
   * 
   * @param maxAgeMs - Maximum allowed age of a room in milliseconds
   * @returns Number of evicted rooms
   */
  evictStaleRooms(maxAgeMs: number): number {
    const now = Date.now();
    let evicted = 0;
    // Iterate over entries using Array.from to avoid map mutation issues
    for (const [roomId, room] of Array.from(this.rooms.entries())) {
      if (now - room.createdAt > maxAgeMs) {
        for (const socketId of room.peers) {
          this.socketToRoom.delete(socketId);
        }
        this.rooms.delete(roomId);
        evicted++;
      }
    }
    return evicted;
  }

  /**
   * Gets the current number of active rooms.
   * 
   * @returns Total number of rooms
   */
  getRoomCount(): number {
    return this.rooms.size;
  }
}
