const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const VERIFY_TOKEN = 'my_unque_secret_token';

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      return res.status(200).send(challenge);
    } else {
      console.log('Token mismatch on webhook verification');
      return res.sendStatus(403);
    }
  }

  res.sendStatus(400);
});

app.post('/webhook', (req, res) => {
  const data = req.body;

  if (data.object === 'page') {
    if (data.entry && Array.isArray(data.entry)) {
      data.entry.forEach((entry) => {
        if (entry.changes && entry.changes.length > 0) {
          const leadChange = entry.changes[0];
          console.log('New lead received from Meta:', leadChange);

          io.emit('lead_received', leadChange);
        }
      });
    }

    return res.status(200).send('EVENT_RECEIVED');
  }

  res.sendStatus(404);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
