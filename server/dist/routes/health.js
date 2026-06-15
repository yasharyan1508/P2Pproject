"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
function setupRoutes(app, roomStore) {
    app.get('/health', (_req, res) => {
        const mem = process.memoryUsage();
        res.json({
            status: 'ok',
            uptime: Math.floor(process.uptime()),
            activeRooms: roomStore.getRoomCount(),
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version ?? '1.0.0',
            nodeVersion: process.version,
            memoryMB: {
                heapUsed: Math.round(mem.heapUsed / 1_048_576),
                heapTotal: Math.round(mem.heapTotal / 1_048_576),
                rss: Math.round(mem.rss / 1_048_576),
            },
        });
    });
    app.get('/', (_req, res) => {
        res.json({
            name: 'P2P Web Share Signaling Server',
            version: process.env.npm_package_version ?? '1.0.0',
            description: 'File data never passes through this server.',
            endpoints: ['GET /', 'GET /health'],
        });
    });
    app.use((_req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
}
