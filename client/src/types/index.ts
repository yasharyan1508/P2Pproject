// ─────────────────────────────────────────────────
// WIRE PROTOCOL TYPES (Data Channel messages)
// ─────────────────────────────────────────────────

export interface MetadataMessage {
  type:         'metadata';
  fileName:     string;
  fileSize:     number;
  fileMimeType: string;
  totalChunks:  number;
  chunkSize:    number;
  sha256Hash:   string;
}

export interface EOFMessage {
  type:        'eof';
  totalChunks: number;
  sha256Hash:  string;
}

export interface AckMessage {
  type:   'ack';
  status: 'verified' | 'corrupted';
}

export type DataChannelMessage = MetadataMessage | EOFMessage | AckMessage;

// ─────────────────────────────────────────────────
// APPLICATION STATE TYPES
// ─────────────────────────────────────────────────

export type TransferStatus =
  | 'idle'
  | 'waiting_peer'
  | 'connecting'
  | 'transferring'
  | 'verifying'
  | 'complete'
  | 'failed'
  | 'disconnected';

export type ErrorType =
  | 'room_not_found'
  | 'room_full'
  | 'ice_failed'
  | 'hash_mismatch'
  | 'incomplete_transfer'
  | 'peer_disconnected'
  | 'server_unreachable';

// ─────────────────────────────────────────────────
// SOCKET EVENT TYPES
// ─────────────────────────────────────────────────

// Client → Server
export interface CreateRoomPayload { roomId: string; }
export interface JoinRoomPayload   { roomId: string; }
export interface SignalPayload     { roomId: string; signalData: unknown; }

// Server → Client
export interface RoomCreatedEvent      { roomId: string; }
export interface JoinConfirmedEvent    { roomId: string; }
export interface PeerJoinedEvent       { peerId: string; }
export interface SignalEvent           { signalData: unknown; }
export interface PeerDisconnectedEvent { message: string; }
export interface RoomNotFoundEvent     { roomId: string; }
export interface RoomFullEvent         { roomId: string; }
export interface RoomErrorEvent        { message: string; code?: string; }

// ─────────────────────────────────────────────────
// STORE SLICE TYPES
// ─────────────────────────────────────────────────

export interface FileState {
  file:         File | null;
  fileName:     string | null;
  fileSize:     number | null;
  fileMimeType: string | null;
  sha256Hash:   string | null;
}

export interface RoomState {
  roomId:        string | null;
  shareUrl:      string | null;
  isInitiator:   boolean;
  peerConnected: boolean;
}

export interface TransferState {
  status:           TransferStatus;
  totalChunks:      number;
  chunksProcessed:  number;
  bytesProcessed:   number;
  progressPercent:  number;
  transferSpeedBps: number;
  etaSeconds:       number;
  startTimestamp:   number | null;
  errorType:        ErrorType | null;
  errorMessage:     string | null;
}

// ─────────────────────────────────────────────────
// COMPONENT PROP TYPES
// ─────────────────────────────────────────────────

export interface ProgressProps {
  percent:    number;
  speedBps:   number;
  etaSeconds: number;
  fileName:   string;
  fileSize:   number;
}

export interface ErrorPanelProps {
  errorType:   ErrorType;
  onPrimary:   () => void;
  onSecondary?: () => void;
}
