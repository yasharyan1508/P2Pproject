"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomStore = void 0;
class RoomStore {
    rooms = new Map();
    socketToRoom = new Map();
    createRoom(roomId, socketId) {
        if (this.rooms.has(roomId))
            return false; // Room already exists → reject
        const room = {
            roomId,
            peers: [socketId],
            createdAt: Date.now(),
        };
        this.rooms.set(roomId, room);
        this.socketToRoom.set(socketId, roomId);
        return true;
    }
    joinRoom(roomId, socketId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return 'room-not-found';
        if (room.peers.length >= 2)
            return 'room-full';
        room.peers.push(socketId);
        this.socketToRoom.set(socketId, roomId);
        return 'success';
    }
    getOtherPeer(roomId, mySocketId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        return room.peers.find(id => id !== mySocketId) ?? null;
    }
    getRoomBySocket(socketId) {
        const roomId = this.socketToRoom.get(socketId);
        if (!roomId)
            return null;
        return this.rooms.get(roomId) ?? null;
    }
    removeSocket(socketId) {
        const roomId = this.socketToRoom.get(socketId);
        if (!roomId)
            return null;
        this.socketToRoom.delete(socketId);
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        room.peers = room.peers.filter(id => id !== socketId);
        const remainingPeer = room.peers[0] ?? null;
        if (room.peers.length === 0) {
            this.rooms.delete(roomId); // Room is empty → destroy it
        }
        return { roomId, remainingPeer };
    }
    evictStaleRooms(maxAgeMs) {
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
    getRoomCount() {
        return this.rooms.size;
    }
}
exports.RoomStore = RoomStore;
