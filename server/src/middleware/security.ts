import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import { ServerConfig } from '../types';

export function setupSecurity(app: Express, config: ServerConfig): void {
  app.use(helmet());
  app.use(cors({
    origin: config.allowedOrigins,
    methods: ['GET'],
    credentials: false,
  }));
  app.use(express.json({ limit: '10kb' }));
  app.set('trust proxy', true);
}
