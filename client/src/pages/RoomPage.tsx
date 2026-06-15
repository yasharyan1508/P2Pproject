import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useRoomAsReceiver } from '../hooks/useRoom';
import { useWebRTC } from '../hooks/useWebRTC';
import { useFileTransfer } from '../hooks/useFileTransfer';
import { useFileReceiver } from '../hooks/useFileReceiver';
import { getSocket, destroySocket } from '../lib/socketClient';

import { ShareLinkPanel } from '../components/ShareLinkPanel';
import { TransferProgressBar } from '../components/TransferProgressBar';
import { ErrorPanel } from '../components/ErrorPanel';
import { TransferCompletePanel } from '../components/TransferCompletePanel';
import { DownloadCompletePanel } from '../components/DownloadCompletePanel';
import { DisconnectedPanel } from '../components/DisconnectedPanel';
import { FilePreviewCard } from '../components/FilePreviewCard';
import { ConnectingPanel } from '../components/ConnectingPanel';
import { LiveRegion } from '../components/LiveRegion';
import { Loader2 } from 'lucide-react';

const STATUS_LIVE_MESSAGES: Record<string, string> = {
  idle: 'Ready',
  waiting_peer: 'Waiting for peer to join',
  connecting: 'Connecting to peer',
  transferring: 'Transfer in progress',
  verifying: 'Verifying file integrity',
  complete: 'Transfer complete',
  failed: 'Transfer failed',
  disconnected: 'Peer disconnected',
};

/**
 * ReceiverRoomManager must be defined OUTSIDE RoomPage to prevent
 * re-creation on every render (which would unmount/remount hooks).
 */
const ReceiverRoomManager: React.FC<{ roomId: string }> = ({ roomId }) => {
  useRoomAsReceiver(roomId);
  return null;
};

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // Select individual fields to avoid full-store re-renders
  const file = useStore((s) => s.file);
  const isInitiator = useStore((s) => s.isInitiator);
  const status = useStore((s) => s.status);
  const errorType = useStore((s) => s.errorType);
  const shareUrl = useStore((s) => s.shareUrl);
  const progressPercent = useStore((s) => s.progressPercent);
  const transferSpeedBps = useStore((s) => s.transferSpeedBps);
  const etaSeconds = useStore((s) => s.etaSeconds);
  const fileName = useStore((s) => s.fileName);
  const fileSize = useStore((s) => s.fileSize);

  // WebRTC Setup
  const [peerConnected, setPeerConnected] = useState(false);
  const webrtc = useWebRTC({
    isInitiator,
    onData: () => {
      // Data routing is handled by the useEffect below
    },
    onConnect: () => {
      setPeerConnected(true);
    },
    onClose: () => {
      setPeerConnected(false);
    },
    onError: (err) => {
      console.error('WebRTC error:', err);
    }
  });

  const senderTransfer = useFileTransfer();
  const receiverTransfer = useFileReceiver(webrtc.peer);

  // Route incoming data channel messages to the correct handler
  useEffect(() => {
    if (!webrtc.peer) return;
    const handleData = (data: any) => {
      if (isInitiator) {
        // Sender handles AckMessage from receiver
        let text = '';
        if (typeof data === 'string' && data.startsWith('CTRL:')) {
          text = data.substring(5);
        } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
           const buf = data instanceof ArrayBuffer ? new Uint8Array(data) : (data as Uint8Array);
           if (buf.length > 5 && buf[0] === 67 && buf[1] === 84 && buf[2] === 82 && buf[3] === 76 && buf[4] === 58) {
              text = new TextDecoder().decode(buf.subarray(5));
           }
        }
        
        if (text) {
          try {
            const msg = JSON.parse(text);
            if (msg.type === 'ack') {
              if (msg.status === 'verified') {
                useStore.getState().setStatus('complete');
              } else {
                useStore.getState().setError('hash_mismatch', 'Receiver reported corruption.');
              }
            }
          } catch (_e) { /* ignore parse errors */ }
        }
      } else {
        receiverTransfer.handleData(data);
      }
    };
    webrtc.peer.on('data', handleData);
    return () => {
      webrtc.peer?.off('data', handleData);
    };
  }, [webrtc.peer, isInitiator, receiverTransfer]);

  // Start transfer when WebRTC connects (Sender only)
  const transferStartedRef = useRef(false);
  useEffect(() => {
    if (isInitiator && peerConnected && webrtc.peer && status === 'transferring') {
      if (!transferStartedRef.current) {
        transferStartedRef.current = true;
        senderTransfer.startTransfer(webrtc.peer);
      }
    } else {
      // Reset if we disconnect
      if (!peerConnected) {
        transferStartedRef.current = false;
      }
    }
  }, [isInitiator, peerConnected, webrtc.peer, status, senderTransfer]);

  // Sender: listen for peer-joined / peer-disconnected on RoomPage.
  // useRoomAsSender (on HomePage) cleans up its listeners when SenderRoomManager
  // unmounts during navigation, so RoomPage MUST re-register them.
  useEffect(() => {
    if (!isInitiator) return;

    const socket = getSocket();

    const handlePeerJoined = () => {
      useStore.getState().setPeerConnected(true);
      useStore.getState().setStatus('connecting');
    };

    const handlePeerDisconnected = () => {
      useStore.getState().setStatus('disconnected');
      useStore.getState().setError('peer_disconnected', 'Peer disconnected. Transfer incomplete.');
    };

    socket.on('peer-joined', handlePeerJoined);
    socket.on('peer-disconnected', handlePeerDisconnected);

    return () => {
      socket.off('peer-joined', handlePeerJoined);
      socket.off('peer-disconnected', handlePeerDisconnected);
    };
  }, [isInitiator]);

  // Abort transfer if peer disconnects (status set by socket listeners above or useRoomAsReceiver)
  useEffect(() => {
    if (status === 'disconnected') {
      senderTransfer.abortTransfer();
    }
  }, [status, senderTransfer]);

  // Cleanup on page unload
  useEffect(() => {
    const handleUnload = () => {
      webrtc.peer?.destroy();
      destroySocket();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [webrtc.peer]);

  const handleReset = () => {
    senderTransfer.abortTransfer();
    webrtc.peer?.destroy();
    destroySocket();
    useStore.getState().resetAll();
    navigate('/');
  };

  const liveMessage = useMemo(() => STATUS_LIVE_MESSAGES[status] ?? '', [status]);

  const renderPanel = () => {
    switch (status) {
      case 'waiting_peer':  
        return isInitiator && shareUrl ? <ShareLinkPanel shareUrl={shareUrl} /> : null;
      case 'connecting':    
        return <ConnectingPanel />;
      case 'transferring':  
        return <TransferProgressBar percent={progressPercent} speedBps={transferSpeedBps} etaSeconds={etaSeconds} />;
      case 'verifying':     
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin mb-4" />
            <p className="text-slate-600">Verifying file integrity...</p>
          </div>
        );
      case 'complete':      
        return isInitiator
          ? <TransferCompletePanel onSendAnother={handleReset} />
          : <DownloadCompletePanel onGoHome={handleReset} />;
      case 'failed':        
        return <ErrorPanel errorType={errorType!} onPrimary={handleReset} onSecondary={handleReset} />;
      case 'disconnected':  
        return <DisconnectedPanel isInitiator={isInitiator} onAction={handleReset} />;
      default:              
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-margin_mobile md:px-0 py-12 pb-margin_desktop">
      <LiveRegion message={liveMessage} />
      {!isInitiator && roomId && <ReceiverRoomManager roomId={roomId} />}
      
      <div className="w-full max-w-container_max_width glass-card halo-glow rounded-xl p-stack_lg md:p-[40px] flex flex-col items-center relative">
        {/* Safari Warning Banner */}
        {/iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !isInitiator && status === 'transferring' && (
          <div className="w-full bg-[#F59E0B]/10 border border-[#F59E0B]/25 rounded-[10px] px-4 py-3 mb-6 flex items-center gap-3">
            <svg className="w-4 h-4 text-[#F59E0B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-body text-[13px] text-[#F59E0B] opacity-90 m-0">
              For best results on Safari iOS, keep this tab in the foreground while receiving.
            </p>
          </div>
        )}

        {(file || fileName) && status !== 'complete' && status !== 'failed' && status !== 'disconnected' && (
          <FilePreviewCard file={{ name: fileName || (file?.name ?? ''), size: fileSize || (file?.size ?? 0), type: file?.type || '' }} />
        )}
        
        {status === 'waiting_peer' && isInitiator && !file && (
          <div className="flex flex-col items-center justify-center p-8 gap-4 w-full">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="text-on-surface font-body">Initializing secure room...</p>
          </div>
        )}
        
        <div className="w-full mt-4 flex justify-center">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};
