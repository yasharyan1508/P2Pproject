export const isWebRTCSupported = () =>
  typeof RTCPeerConnection !== 'undefined';

export const isCryptoSubtleSupported = () =>
  typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
