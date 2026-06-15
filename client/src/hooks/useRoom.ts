import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { getSocket } from '../lib/socketClient';
import { useStore } from '../store';
import type { RoomCreatedEvent } from '../types';

/**
 * Hook for the Initiator (Sender) to generate a room ID, connect to the signaling server,
 * handle collisions, and wait for a peer to join.
 */
export function useRoomAsSender() {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();
    const store  = useStore.getState();

    // Step 1: Generate room ID
    const roomId  = nanoid(8);
    const shareUrl = `${window.location.origin}/room/${roomId}`;

    // Step 2: Update store
    store.setRoom(roomId, true);
    store.setShareUrl(shareUrl);
    store.setStatus('waiting_peer');   // Note: this may be premature — set after room-created

    // Step 3: Connect socket and create room
    socket.connect();
    socket.emit('create-room', { roomId });

    // Step 4: Listen for server responses
    const handleRoomCreated = ({ roomId: confirmedId }: RoomCreatedEvent) => {
      // Navigate to the room page
      navigate(`/room/${confirmedId}`);
    };

    const handleRoomError = () => {
      // Collision: retry with a new nanoid
      const newRoomId   = nanoid(8);
      const newShareUrl = `${window.location.origin}/room/${newRoomId}`;
      store.setRoom(newRoomId, true);
      store.setShareUrl(newShareUrl);
      socket.emit('create-room', { roomId: newRoomId });
      // This retry is transparent to the user
    };

    const handlePeerJoined = () => {
      useStore.getState().setPeerConnected(true);
      useStore.getState().setStatus('connecting');
      // useWebRTC will handle SimplePeer initialization after this
    };

    const handlePeerDisconnected = () => {
      useStore.getState().setStatus('disconnected');
      useStore.getState().setError('peer_disconnected', 'Peer disconnected. Transfer incomplete.');
      toast.error('Peer disconnected. Transfer incomplete.', { duration: Infinity });
    };

    socket.on('room-created',      handleRoomCreated);
    socket.on('room-error',        handleRoomError);
    socket.on('peer-joined',       handlePeerJoined);
    socket.on('peer-disconnected', handlePeerDisconnected);

    return () => {
      socket.off('room-created',      handleRoomCreated);
      socket.off('room-error',        handleRoomError);
      socket.off('peer-joined',       handlePeerJoined);
      socket.off('peer-disconnected', handlePeerDisconnected);
    };
  }, [navigate]);
}

/**
 * Hook for the Receiver to join an existing room via a share link,
 * handling errors like room-full or room-not-found.
 * 
 * @param roomId - The ID of the room to join
 */
export function useRoomAsReceiver(roomId: string) {
  useEffect(() => {
    const socket = getSocket();
    const store  = useStore.getState();

    // Step 1: Set room state (receiver, no shareUrl)
    store.setRoom(roomId, false);

    // Step 2: Connect and join
    socket.connect();
    socket.emit('join-room', { roomId });

    // Step 3: Listen for server responses
    const handleJoinConfirmed = () => {
      useStore.getState().setPeerConnected(true);
      useStore.getState().setStatus('connecting');
      // useWebRTC will initialize SimplePeer as non-initiator
    };

    const handleRoomNotFound = () => {
      useStore.getState().setError('room_not_found',
        'This link is no longer valid. The room may not exist or the sender may have disconnected.');
    };

    const handleRoomFull = () => {
      useStore.getState().setError('room_full',
        'This room is already in use. Each link supports only one sender and one receiver.');
    };

    const handlePeerDisconnected = () => {
      useStore.getState().setStatus('disconnected');
      useStore.getState().setError('peer_disconnected', 'Sender disconnected. Transfer incomplete.');
      toast.error('Sender disconnected. Transfer incomplete.', { duration: Infinity });
    };

    socket.on('join-confirmed',    handleJoinConfirmed);
    socket.on('room-not-found',    handleRoomNotFound);
    socket.on('room-full',         handleRoomFull);
    socket.on('peer-disconnected', handlePeerDisconnected);

    return () => {
      socket.off('join-confirmed',    handleJoinConfirmed);
      socket.off('room-not-found',    handleRoomNotFound);
      socket.off('room-full',         handleRoomFull);
      socket.off('peer-disconnected', handlePeerDisconnected);
    };
  }, [roomId]);
}
