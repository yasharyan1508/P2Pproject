import { isValidRoomId, validateCreateRoom, validateJoinRoom, validateSignal } from './validation';

describe('validation', () => {
  describe('isValidRoomId', () => {
    it('returns true for valid room IDs', () => {
      expect(isValidRoomId('test-room-123')).toBe(true);
      expect(isValidRoomId('A')).toBe(true);
      expect(isValidRoomId('abcdefghijklmnopqrst')).toBe(true); // 20 chars
      expect(isValidRoomId('user_room_45')).toBe(true);
    });

    it('returns false for invalid room IDs', () => {
      expect(isValidRoomId('')).toBe(false);
      expect(isValidRoomId('toolongroomnamethatexceeds20chars')).toBe(false);
      expect(isValidRoomId('invalid@chars')).toBe(false);
      expect(isValidRoomId('space room')).toBe(false);
      expect(isValidRoomId(123)).toBe(false);
      expect(isValidRoomId(null)).toBe(false);
    });
  });

  describe('validateCreateRoom', () => {
    it('validates correct payloads', () => {
      expect(validateCreateRoom({ roomId: 'valid-room' })).toBe(true);
    });

    it('rejects invalid payloads', () => {
      expect(validateCreateRoom(null)).toBe(false);
      expect(validateCreateRoom({})).toBe(false);
      expect(validateCreateRoom({ roomId: 'invalid room' })).toBe(false);
    });
  });

  describe('validateJoinRoom', () => {
    it('validates correct payloads', () => {
      expect(validateJoinRoom({ roomId: 'valid-room' })).toBe(true);
    });

    it('rejects invalid payloads', () => {
      expect(validateJoinRoom(null)).toBe(false);
      expect(validateJoinRoom({})).toBe(false);
      expect(validateJoinRoom({ roomId: 'invalid room' })).toBe(false);
    });
  });

  describe('validateSignal', () => {
    it('validates correct payloads', () => {
      expect(validateSignal({ roomId: 'valid-room', signalData: { type: 'offer' } })).toBe(true);
    });

    it('rejects invalid payloads', () => {
      expect(validateSignal(null)).toBe(false);
      expect(validateSignal({})).toBe(false);
      expect(validateSignal({ roomId: 'valid-room' })).toBe(false);
      expect(validateSignal({ roomId: 'valid-room', signalData: null })).toBe(false);
      expect(validateSignal({ roomId: 'invalid room', signalData: {} })).toBe(false);
    });
  });
});
