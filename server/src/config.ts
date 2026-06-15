import { ServerConfig } from './types';

export function getConfig(): ServerConfig {
  return {
    port:                  parseInt(process.env.PORT ?? '3001', 10),
    nodeEnv:               (process.env.NODE_ENV as any) ?? 'development',
    allowedOrigins:        process.env.CORS_ORIGIN?.split(',').map(s => s.trim())
                           ?? process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim())
                           ?? ['http://localhost:5173'],
    roomIdTtlMs:           parseInt(process.env.ROOM_ID_TTL_MS ?? '3600000', 10),
    ttlCleanupIntervalMs:  parseInt(process.env.TTL_CLEANUP_INTERVAL_MS ?? '600000', 10),
  };
}

export function validateEnvironment(): void {
  const config = getConfig();
  if (isNaN(config.port)) throw new Error('PORT must be a valid number');
  if (config.roomIdTtlMs < 60_000) throw new Error('ROOM_ID_TTL_MS must be >= 60000');
  if (config.nodeEnv === 'production' && config.allowedOrigins[0] === 'http://localhost:5173') {
    console.warn('[WARN] ALLOWED_ORIGINS is using localhost in production!');
  }
}
