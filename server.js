// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const priceRoutes = require('./routes/priceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const indexingRoutes = require('./routes/indexingRoutes');

const app = express();

const allowedOrigins = [
  'https://corfutransfersapp.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// ✅ Basic root route to avoid 404 at /
app.get('/', (req, res) => {
  res.send('MyTour4U API is running');
});

// --- Mongo ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// --- Routes ---
app.use('/api/reservations', reservationRoutes);
app.use('/api', priceRoutes);
app.use('/api/google', indexingRoutes);

// --- HTTP server & Socket.IO ---
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// In-memory last-known location (deviceId -> {lat,lng,accuracy,timestamp})
const lastLocation = new Map();

// Namespace for live location
const nsp = io.of('/live');

nsp.on('connection', (socket) => {
  const role = socket.handshake.query?.role || 'viewer';
  const deviceId = socket.handshake.query?.deviceId || 'phone-1';

  // Each device has its own room
  socket.join(deviceId);

  // If an admin joins and we have a snapshot, send it immediately
  if (role === 'admin' && lastLocation.has(deviceId)) {
    socket.emit('location:bootstrap', { deviceId, ...lastLocation.get(deviceId) });
  }

  // Device pushes updates here
  socket.on('location:update', (payload) => {
    // payload: { deviceId, lat, lng, accuracy, timestamp }
    if (!payload || typeof payload.lat !== 'number' || typeof payload.lng !== 'number') return;

    const id = payload.deviceId || deviceId;
    const rec = {
      lat: payload.lat,
      lng: payload.lng,
      accuracy: typeof payload.accuracy === 'number' ? payload.accuracy : null,
      timestamp: payload.timestamp || Date.now(),
    };
    lastLocation.set(id, rec);

    // Broadcast to viewers of this device
    nsp.to(id).emit('location:push', { deviceId: id, ...rec });
  });

  socket.on('disconnect', () => {});
});

// REST bootstrap for admins (optional but handy)
app.get('/api/last-location/:deviceId', (req, res) => {
  const id = req.params.deviceId;
  if (!lastLocation.has(id)) return res.status(404).json({ ok: false, message: 'No location yet' });
  return res.json({ ok: true, deviceId: id, ...lastLocation.get(id) });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
