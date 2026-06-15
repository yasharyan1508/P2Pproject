// ─────────────────────────────────────────────────
// ROOM TYPES
// ─────────────────────────────────────────────────

export interface Room {
  roomId:    string;
  peers:     string[];    // socket.id values
  createdAt: number;      // Unix ms timestamp
}

export type JoinRoomResult = 'success' | 'room-not-found' | 'room-full';

export interface RemoveSocketResult {
  roomId:        string;
  remainingPeer: string | null;
}

// ─────────────────────────────────────────────────
// CLIENT → SERVER EVENT PAYLOADS
// ─────────────────────────────────────────────────

export interface CreateRoomPayload {
  roomId: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

export interface SignalPayload {
  roomId:     string;
  signalData: unknown;
}

// ─────────────────────────────────────────────────
// SERVER → CLIENT EVENT PAYLOADS
// ─────────────────────────────────────────────────

export interface RoomCreatedEvent     { roomId: string; }
export interface JoinConfirmedEvent   { roomId: string; }
export interface PeerJoinedEvent      { peerId: string; }
export interface SignalEvent          { signalData: unknown; }
export interface PeerDisconnectedEvent { message: string; }
export interface RoomNotFoundEvent    { roomId: string; }
export interface RoomFullEvent        { roomId: string; }
export interface RoomErrorEvent       { message: string; }

// ─────────────────────────────────────────────────
// HTTP RESPONSE TYPES
// ─────────────────────────────────────────────────

export interface HealthResponse {
  status:      'ok';
  uptime:      number;
  activeRooms: number;
  timestamp:   string;
  version:     string;
}

export interface RootResponse {
  name:        string;
  version:     string;
  description: string;
  endpoints:   string[];
}

// ─────────────────────────────────────────────────
// SERVER CONFIG TYPE
// ─────────────────────────────────────────────────

export interface ServerConfig {
  port:                   number;
  nodeEnv:                'development' | 'production' | 'test';
  allowedOrigins:         string[];
  roomIdTtlMs:            number;
  ttlCleanupIntervalMs:   number;
}
