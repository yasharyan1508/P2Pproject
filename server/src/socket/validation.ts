import { CreateRoomPayload, JoinRoomPayload, SignalPayload } from '../types';

const ROOM_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;

export function isValidRoomId(id: unknown): id is string {
  return typeof id === 'string' && ROOM_ID_RE.test(id);
}

export function validateCreateRoom(payload: unknown): payload is CreateRoomPayload {
  return !!payload && typeof payload === 'object'
    && isValidRoomId((payload as any).roomId);
}

export function validateJoinRoom(payload: unknown): payload is JoinRoomPayload {
  return validateCreateRoom(payload); // Same validation rules
}

export function validateSignal(payload: unknown): payload is SignalPayload {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as any;
  return isValidRoomId(p.roomId)
    && typeof p.signalData === 'object'
    && p.signalData !== null;
}
