"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const config_1 = require("./config");
const security_1 = require("./middleware/security");
const health_1 = require("./routes/health");
const roomStore_1 = require("./socket/roomStore");
const handlers_1 = require("./socket/handlers");
// 1. Setup config & validation
(0, config_1.validateEnvironment)();
const config = (0, config_1.getConfig)();
// 2. Setup express & http server
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// 3. Setup Socket.io
const io = new socket_io_1.Server(httpServer, {
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
const roomStore = new roomStore_1.RoomStore();
(0, security_1.setupSecurity)(app, config);
(0, health_1.setupRoutes)(app, roomStore);
(0, handlers_1.setupHandlers)(io, roomStore);
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
