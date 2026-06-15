# P2P Web Share

A secure, serverless file sharing application utilizing WebRTC and Socket.io for fully peer-to-peer, zero-storage file transfers.

## Architecture Overview
This application follows a client-server hybrid architecture where the server acts purely as a signaling and matchmaking service.
- **Client**: React + Vite + Zustand + SimplePeer (WebRTC) + TailwindCSS
- **Server**: Node.js + Express + Socket.io

All file data flows directly between peers (P2P) over an encrypted WebRTC data channel. The server never sees, buffers, or stores the file content.

### Security Features
- **Zero Server Storage**: Files are transferred via P2P connection; the server only routes WebRTC SDP offers/answers.
- **Data Integrity**: SHA-256 hashes of the file are computed on the sender side and verified on the receiver side before download.
- **Constant-Time Comparison**: Hash verification utilizes constant-time string comparison to prevent timing attacks.
- **Rate Limiting**: Socket connection rate-limiter prevents DoS attacks on the signaling server.

## Running Locally

### Prerequisites
- Node.js v18+
- npm v9+

### Setup

1. **Clone the repository and install dependencies**
   ```bash
   cd P2Pproject/server && npm install
   cd ../client && npm install
   ```

2. **Configure Environment Variables**
   - Copy `client/.env.example` to `client/.env` and update the `VITE_SOCKET_URL` if needed.
   - Copy `server/.env.example` to `server/.env` and adjust the CORS domains.

3. **Start the Development Servers**
   - **Backend**: `cd server && npm run dev`
   - **Frontend**: `cd client && npm run dev`

### Testing
- Run Client tests (Vitest): `cd client && npm test`
- Run Server tests (Jest): `cd server && npm test`

## Deployment

### Frontend (Vercel)
The `client` directory contains a `vercel.json` configured for React SPA routing. Connect your Vercel account to the repository and set the root directory to `client`.

### Backend (Render)
The `server` directory includes a `render.yaml` for zero-config deployment. Connect your Render account and it will automatically deploy the WebSocket signaling server. Make sure to update the `FRONTEND_URL` environment variable to match your Vercel domain.