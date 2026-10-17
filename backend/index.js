const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// setup socket.io with cors enabled
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// verify token configured in meta developer portal
const VERIFY_TOKEN = 'my_unque_secret_token';

// 1. GET /webhook - Meta Webhook Verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully by Meta');
      return res.status(200).send(challenge);
    } else {
      console.log('Verification failed: Token mismatch');
      return res.sendStatus(403);
    }
  }

  res.sendStatus(400);
});

// 2. POST /webhook - Receives incoming lead events from Meta
app.post('/webhook', (req, res) => {
  const data = req.body;

  if (data.object === 'page') {
    if (data.entry && Array.isArray(data.entry)) {
      data.entry.forEach((entry) => {
        if (entry.changes && entry.changes.length > 0) {
          const leadChange = entry.changes[0];
          console.log('New lead event received from Meta:', leadChange);

          // Broadcast to connected mobile app via socket.io
          io.emit('lead_received', leadChange);
        }
      });
    }

    // Acknowledge receipt to Meta
    return res.status(200).send('EVENT_RECEIVED');
  }

  res.sendStatus(404);
});

// Socket connection tracking
io.on('connection', (socket) => {
  console.log('Mobile client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Mobile client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
