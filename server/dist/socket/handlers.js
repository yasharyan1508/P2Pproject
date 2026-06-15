"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHandlers = setupHandlers;
const validation_1 = require("./validation");
function setupHandlers(io, roomStore) {
    io.on('connection', (socket) => {
        socket.on('create-room', (payload) => {
            if (!(0, validation_1.validateCreateRoom)(payload)) {
                socket.emit('room-error', { message: 'Invalid room ID format' });
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
        socket.on('join-room', (payload) => {
            if (!(0, validation_1.validateJoinRoom)(payload)) {
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
        socket.on('signal', (payload) => {
            if (!(0, validation_1.validateSignal)(payload)) {
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
