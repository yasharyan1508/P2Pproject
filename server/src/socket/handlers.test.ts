import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { RoomStore } from './roomStore';
import { setupHandlers } from './handlers';
import { AddressInfo } from 'net';

describe('Socket.IO Handlers', () => {
  let io: Server;
  let serverSocket: any;
  let clientSocket1: ClientSocket;
  let clientSocket2: ClientSocket;
  let roomStore: RoomStore;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    roomStore = new RoomStore();
    setupHandlers(io, roomStore);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket1 = Client(`http://localhost:${port}`);
      clientSocket2 = Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      let connected = 0;
      clientSocket1.on('connect', () => {
        if (++connected === 2) done();
      });
      clientSocket2.on('connect', () => {
        if (++connected === 2) done();
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket1.close();
    clientSocket2.close();
  });

  afterEach(() => {
    clientSocket1.removeAllListeners();
    clientSocket2.removeAllListeners();
    // Clear room store between tests
    roomStore.evictStaleRooms(0); // eviction with 0 maxAge to clear
  });

  it('should create a room successfully', (done) => {
    clientSocket1.on('room-created', (payload) => {
      expect(payload.roomId).toBe('test-room');
      done();
    });
    clientSocket1.emit('create-room', { roomId: 'test-room' });
  });

  it('should reject invalid create-room payload', (done) => {
    clientSocket1.on('room-error', (payload) => {
      expect(payload.message).toBe('Invalid room ID format');
      done();
    });
    clientSocket1.emit('create-room', { roomId: 'invalid room!' });
  });

  it('should join an existing room', (done) => {
    clientSocket1.emit('create-room', { roomId: 'test-room-2' });
    
    clientSocket1.on('peer-joined', (payload) => {
      expect(payload.peerId).toBeDefined();
      done();
    });

    clientSocket2.on('join-confirmed', (payload) => {
      expect(payload.roomId).toBe('test-room-2');
    });

    setTimeout(() => {
      clientSocket2.emit('join-room', { roomId: 'test-room-2' });
    }, 50);
  });

  it('should reject joining a missing room', (done) => {
    clientSocket2.on('room-not-found', (payload) => {
      expect(payload.roomId).toBe('missing-room');
      done();
    });
    clientSocket2.emit('join-room', { roomId: 'missing-room' });
  });

  it('should route signals between peers', (done) => {
    clientSocket1.emit('create-room', { roomId: 'signal-room' });
    
    setTimeout(() => {
      clientSocket2.emit('join-room', { roomId: 'signal-room' });
      
      setTimeout(() => {
        clientSocket2.on('signal', (payload) => {
          expect(payload.signalData.type).toBe('offer');
          done();
        });
        
        clientSocket1.emit('signal', { roomId: 'signal-room', signalData: { type: 'offer' } });
      }, 50);
    }, 50);
  });
});
