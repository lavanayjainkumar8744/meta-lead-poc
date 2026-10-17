# Meta Lead Ads + React Native (Real-Time PoC)

A lightweight proof-of-concept demonstrating real-time lead ingestion from Meta (Facebook) Lead Ads into a React Native mobile application without manual device interaction.

## Architecture Overview

```
[Meta Lead Testing Tool]
          │  (HTTP POST Webhook)
          ▼
   [Ngrok Tunnel]
          │
          ▼
[Node.js / Express Server]
          │  (Socket.io Event: 'lead_received')
          ▼
[React Native Mobile App]  ──> Automatically updates leads list
```

1. **Meta Webhook (`GET /webhook`):** Handles one-time verification challenge handshake using the verify token.
2. **Meta Webhook (`POST /webhook`):** Receives the lead notification payload when a form is submitted.
3. **Socket.io Server:** Broadcasts the new lead event to all active client connections.
4. **React Native Client:** Listens on the WebSocket channel and appends new leads to the active screen state instantaneously.

## Prerequisites

- Node.js (v18+)
- Expo CLI / Expo Go app on mobile device or simulator
- Ngrok (for local HTTPS tunneling)

## Setup & Running Locally

### 1. Backend Server

```bash
cd backend
npm install
node index.js
```

The server will start on `http://localhost:3000`.

### 2. Expose Local Server via Ngrok

```bash
ngrok http 3000
```

Copy the HTTPS forwarding URL and configure it in your Meta Developer App under Webhooks (`/webhook`).

### 3. Mobile App

```bash
cd mobile-app
npm install
npm start
```

Scan the QR code using Expo Go on Android or iOS.

## Testing with Meta Lead Ads Tool

1. Open Meta's Lead Ads Testing Tool.
2. Select your Facebook Page and Lead Form.
3. Click **Create Lead**.
4. The submitted lead will appear live on the mobile app screen immediately without refreshing.
