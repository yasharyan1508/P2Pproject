import { useEffect, useRef, useCallback, useState } from 'react';
import SimplePeer from 'simple-peer';
import { getSocket } from '../lib/socketClient';
import { useStore } from '../store';
import type { SignalEvent } from '../types';

const ICE_TIMEOUT_MS = 30_000; // PRD FR-WS-6: 30 seconds

/**
 * Hook to manage the WebRTC SimplePeer connection lifecycle, ICE candidate signaling,
 * and data channel communication.
 *
 * Architecture:
 * - Effect 1: Global signal listener (queues signals before peer exists)
 * - Effect 2: One-shot peer creation when status reaches 'connecting'
 * - The peer is NOT destroyed on status changes — only on unmount or explicit reset
 */
export function useWebRTC(params: {
  isInitiator: boolean;
  onData:    (data: string | ArrayBuffer) => void;
  onConnect: () => void;
  onClose:   () => void;
  onError:   (err: Error) => void;
}): {
  peer:     SimplePeer.Instance | null;
  sendData: (data: string | ArrayBuffer) => boolean;
} {
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const signalQueueRef = useRef<SimplePeer.SignalData[]>([]);
  const iceTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peerCreatedRef = useRef(false);   // Guard: only create peer once per session
  const [peerInstance, setPeerInstance] = useState<SimplePeer.Instance | null>(null);

  // Store callbacks in refs to avoid re-triggering effects
  const onDataRef    = useRef(params.onData);
  const onConnectRef = useRef(params.onConnect);
  const onCloseRef   = useRef(params.onClose);
  const onErrorRef   = useRef(params.onError);
  useEffect(() => {
    onDataRef.current    = params.onData;
    onConnectRef.current = params.onConnect;
    onCloseRef.current   = params.onClose;
    onErrorRef.current   = params.onError;
  }, [params.onData, params.onConnect, params.onClose, params.onError]);

  const { isInitiator } = params;
  const status = useStore((s) => s.status);

  const clearIceTimeout = useCallback(() => {
    if (iceTimeoutIdRef.current) {
      clearTimeout(iceTimeoutIdRef.current);
      iceTimeoutIdRef.current = null;
    }
  }, []);

  // ── Effect 1: Global signal listener — active from mount ──
  useEffect(() => {
    const socket = getSocket();

    const handleIncomingSignal = (event: SignalEvent) => {
      const peer = peerRef.current;
      if (peer && !peer.destroyed) {
        try {
          peer.signal(event.signalData as SimplePeer.SignalData);
        } catch (err) {
          console.warn('[useWebRTC] Failed to signal peer:', err);
        }
      } else {
        signalQueueRef.current.push(event.signalData as SimplePeer.SignalData);
      }
    };

    socket.on('signal', handleIncomingSignal);
    return () => {
      socket.off('signal', handleIncomingSignal);
    };
  }, []);

  // ── Effect 2: Create peer ONCE when status becomes 'connecting' ──
  useEffect(() => {
    // Only create when status is 'connecting' AND we haven't created one yet
    if (status !== 'connecting') return;
    if (peerCreatedRef.current) return;

    peerCreatedRef.current = true;

    const socket = getSocket();

    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      },
      channelConfig: {
        ordered: true,
      },
    });

    peerRef.current = peer;
    setPeerInstance(peer);

    // Drain queued signals
    while (signalQueueRef.current.length > 0) {
      const queued = signalQueueRef.current.shift()!;
      try {
        peer.signal(queued);
      } catch (err) {
        console.warn('[useWebRTC] Failed to apply queued signal:', err);
      }
    }

    // ICE timeout
    iceTimeoutIdRef.current = setTimeout(() => {
      if (!peer.destroyed) {
        peer.destroy();
        useStore.getState().setError(
          'ice_failed',
          'Unable to establish a direct connection within 30 seconds. This may be due to network restrictions.'
        );
      }
    }, ICE_TIMEOUT_MS);

    // ── Peer event handlers ──

    peer.on('signal', (signalData: SimplePeer.SignalData) => {
      const roomId = useStore.getState().roomId;
      if (roomId) {
        socket.emit('signal', { roomId, signalData });
      }
    });

    peer.on('connect', () => {
      clearIceTimeout();
      useStore.getState().setStatus('ready_to_send');
      onConnectRef.current();
    });

    peer.on('data', (data: unknown) => {
      onDataRef.current(data as string | ArrayBuffer);
    });

    let hasErrored = false;

    peer.on('error', (err: Error) => {
      if (hasErrored) return;
      hasErrored = true;
      clearIceTimeout();
      onErrorRef.current(err);
      useStore.getState().setError('ice_failed', `Connection error: ${err.message}`);
    });

    peer.on('close', () => {
      if (hasErrored) return;
      clearIceTimeout();
      onCloseRef.current();
    });

    // NO cleanup that destroys the peer here!
    // The peer must survive status transitions (connecting → transferring → verifying → complete).
    // It will be destroyed by the unmount cleanup below.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isInitiator]);

  // ── Effect 3: Cleanup on unmount only ──
  useEffect(() => {
    return () => {
      clearIceTimeout();
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      peerCreatedRef.current = false;
      setPeerInstance(null);
    };
  }, [clearIceTimeout]);

  const sendData = useCallback((data: string | ArrayBuffer): boolean => {
    const peer = peerRef.current;
    if (!peer || peer.destroyed) return false;

    const BUFFER_HIGH_WATERMARK = 2_097_152; // 2 MB
    const channel = (peer as unknown as { _channel?: RTCDataChannel })._channel;
    const buffered = channel?.bufferedAmount ?? 0;

    if (buffered > BUFFER_HIGH_WATERMARK) {
      return false;
    }

    peer.send(data);
    return true;
  }, []);

  return { peer: peerInstance, sendData };
}
