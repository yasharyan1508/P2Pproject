"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSecurity = setupSecurity;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
function setupSecurity(app, config) {
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: config.allowedOrigins,
        methods: ['GET'],
        credentials: false,
    }));
    app.use(express_1.default.json({ limit: '10kb' }));
    app.set('trust proxy', true);
}
