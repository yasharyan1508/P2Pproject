"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidRoomId = isValidRoomId;
exports.validateCreateRoom = validateCreateRoom;
exports.validateJoinRoom = validateJoinRoom;
exports.validateSignal = validateSignal;
const ROOM_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;
function isValidRoomId(id) {
    return typeof id === 'string' && ROOM_ID_RE.test(id);
}
function validateCreateRoom(payload) {
    return !!payload && typeof payload === 'object'
        && isValidRoomId(payload.roomId);
}
function validateJoinRoom(payload) {
    return validateCreateRoom(payload); // Same validation rules
}
function validateSignal(payload) {
    if (!payload || typeof payload !== 'object')
        return false;
    const p = payload;
    return isValidRoomId(p.roomId)
        && typeof p.signalData === 'object'
        && p.signalData !== null;
}
