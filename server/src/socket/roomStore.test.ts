import { RoomStore } from './roomStore';

describe('RoomStore', () => {
  let store: RoomStore;

  beforeEach(() => {
    store = new RoomStore();
  });

  it('creates a room', () => {
    const result = store.createRoom('room1', 'socket1');
    expect(result).toBe(true);
    expect(store.getRoomCount()).toBe(1);
    
    const room = store.getRoomBySocket('socket1');
    expect(room).toBeDefined();
    expect(room?.roomId).toBe('room1');
  });

  it('rejects duplicate room creation', () => {
    store.createRoom('room1', 'socket1');
    const result = store.createRoom('room1', 'socket2');
    expect(result).toBe(false);
  });

  it('allows a second peer to join', () => {
    store.createRoom('room1', 'socket1');
    const result = store.joinRoom('room1', 'socket2');
    expect(result).toBe('success');
    
    expect(store.getOtherPeer('room1', 'socket1')).toBe('socket2');
    expect(store.getOtherPeer('room1', 'socket2')).toBe('socket1');
  });

  it('rejects joining a non-existent room', () => {
    const result = store.joinRoom('missing', 'socket1');
    expect(result).toBe('room-not-found');
  });

  it('rejects joining a full room', () => {
    store.createRoom('room1', 'socket1');
    store.joinRoom('room1', 'socket2');
    const result = store.joinRoom('room1', 'socket3');
    expect(result).toBe('room-full');
  });

  it('removes socket and destroys empty room', () => {
    store.createRoom('room1', 'socket1');
    const result = store.removeSocket('socket1');
    
    expect(result).toEqual({ roomId: 'room1', remainingPeer: null });
    expect(store.getRoomCount()).toBe(0);
  });

  it('removes socket and keeps remaining peer', () => {
    store.createRoom('room1', 'socket1');
    store.joinRoom('room1', 'socket2');
    const result = store.removeSocket('socket1');
    
    expect(result).toEqual({ roomId: 'room1', remainingPeer: 'socket2' });
    expect(store.getRoomCount()).toBe(1);
    
    const room = store.getRoomBySocket('socket2');
    expect(room?.peers).toEqual(['socket2']);
  });

  it('evicts stale rooms', () => {
    // We mock Date.now() to control time
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);
    store.createRoom('room1', 'socket1'); // Created at 1000
    
    nowSpy.mockReturnValue(5000); // Now it's 5000
    store.createRoom('room2', 'socket2'); // Created at 5000
    
    // Evict older than 3000ms
    const evicted = store.evictStaleRooms(3000);
    expect(evicted).toBe(1); // room1 should be evicted (age 4000)
    expect(store.getRoomCount()).toBe(1);
    expect(store.getRoomBySocket('socket1')).toBeNull();
    expect(store.getRoomBySocket('socket2')?.roomId).toBe('room2');
    
    nowSpy.mockRestore();
  });
});
