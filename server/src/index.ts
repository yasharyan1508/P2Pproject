import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getConfig, validateEnvironment } from './config';
import { setupSecurity } from './middleware/security';
import { setupRoutes } from './routes/health';
import { RoomStore } from './socket/roomStore';
import { setupHandlers } from './socket/handlers';

// 1. Setup config & validation
validateEnvironment();
const config = getConfig();

// 2. Setup express & http server
const app = express();
const httpServer = createServer(app);

// 3. Setup Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: config.allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 20_000,
  pingInterval: 25_000,
  maxHttpBufferSize: 1e4,
});

// 4. Setup state and features
const roomStore = new RoomStore();
setupSecurity(app, config);
setupRoutes(app, roomStore);
setupHandlers(io, roomStore);

// 5. Setup TTL cleanup
const cleanupInterval = setInterval(() => {
  const evicted = roomStore.evictStaleRooms(config.roomIdTtlMs);
  if (evicted > 0) {
    console.log(`[CLEANUP] Evicted ${evicted} stale rooms. Active: ${roomStore.getRoomCount()}`);
  }
}, config.ttlCleanupIntervalMs);

// 6. Graceful shutdown
process.on('SIGTERM', () => {
  clearInterval(cleanupInterval);
  httpServer.close(() => process.exit(0));
});

// 7. Start server
httpServer.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode.`);
});
