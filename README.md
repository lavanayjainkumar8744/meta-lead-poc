# Meta Lead Ads + React Native PoC

A simple project to show Meta Lead Ad submissions appearing live on a React Native app screen without refreshing or touching the device.

### How it works
- When a lead is submitted in Meta's Lead Testing Tool, Meta sends a webhook POST request to our backend.
- The Express backend receives the lead data and sends it to the mobile app using Socket.io.
- The React Native app receives the socket event and updates the list on the screen automatically.
- Ngrok is used to connect Meta's webhook to localhost:3000 during local development.

### Tech Stack
- **Backend:** Node.js, Express, Socket.io
- **Mobile:** React Native (Expo), Socket.io Client
- **Tunnel:** Ngrok

### How to run

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   node index.js
   ```

2. **Start Ngrok (in a separate terminal):**
   ```bash
   ngrok http 3000
   ```
   Add the generated forwarding URL in your Meta Developer App under Webhooks (`/webhook`) with verify token `my_unque_secret_token`.

3. **Start the mobile app:**
   ```bash
   cd mobile-app
   npm install
   npx expo start
   ```
   Scan the QR code with Expo Go on your phone.

### Testing
Open Meta's Lead Ads Testing Tool, select your Page and Form, and click **Create Lead**. The new lead will show up on your phone screen immediately.
