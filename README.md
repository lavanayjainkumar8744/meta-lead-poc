# Meta Lead Ads - Real-Time React Native PoC

A proof of concept showing real-time lead updates in a React Native app when a lead ad form is submitted on Meta, without any manual action or refreshing on the device.

## How It Works

1. **Meta Webhook (`GET /webhook`):** Verifies the webhook subscription with Meta's developer platform using a secret token.
2. **Lead Ingestion (`POST /webhook`):** Receives lead notifications from Meta whenever a user submits a test lead form.
3. **Socket.io Broadcasting:** The backend pushes the incoming lead payload to connected mobile clients in real-time.
4. **React Native Client:** Listens on the WebSocket connection and immediately updates the state to show the lead card on the screen.

```
Meta Lead Testing Tool
         │
         ▼ (HTTP POST Webhook)
    Ngrok Tunnel
         │
         ▼
Node.js Express Backend
         │
         ▼ (Socket.io Event: 'lead_received')
React Native Mobile App (Auto-renders lead card)
```

## Running Locally

### 1. Backend Server
```bash
cd backend
npm install
node index.js
```
Server runs on `http://localhost:3000`.

### 2. Ngrok Tunnel
Expose local port 3000 to the internet:
```bash
ngrok http 3000
```
Use the generated HTTPS URL to configure the Webhook URL in Meta App Dashboard (`/webhook`).

### 3. Mobile App
```bash
cd mobile-app
npm install
npx expo start
```
Scan the QR code with Expo Go on Android or iOS.

## Testing with Meta Lead Ads Tool
1. Go to [Meta Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing).
2. Choose your Page and Lead Form.
3. Click **Create Lead**.
4. The lead will appear automatically on the mobile screen without touching the phone.
