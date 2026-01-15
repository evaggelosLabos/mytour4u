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
  'https://www.corfutransfersapp.com', // ✅ ADD THIS
  'http://localhost:3000',
  'http://localhost:3001',
];

// --- Express/CORS ---
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS: ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ ADD OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],     // ✅ SAFE
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ IMPORTANT for preflight
app.use(express.json());

// Root route
app.get('/', (req, res) => res.send('MyTour4U API is running'));

// --- Mongo ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- REST Routes ---
app.use('/api/reservations', reservationRoutes);
app.use('/api/price-requests', priceRoutes);
app.use('/api/google', indexingRoutes);

// --- HTTP + Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS: ' + origin));
    },
    methods: ['GET', 'POST', 'OPTIONS'], // ✅ ADD OPTIONS (safe)
    credentials: true,
  },
});

// ===== LIVE LOCATION NAMESPACE =====
const lastLocation = new Map();   // deviceId -> { lat, lng, accuracy, timestamp }
const admins = new Set();         // Set<Socket> for connected admins

const nsp = io.of('/live');

nsp.on('connection', (socket) => {
  const role = socket.handshake.query?.role || 'viewer';
  const deviceId = socket.handshake.query?.deviceId || `device-${Math.random().toString(36).slice(2,8)}`;
  console.log(`[LIVE] connected socket=${socket.id} role=${role} deviceId=${deviceId}`);

  if (role === 'driver') {
    socket.join(deviceId);
  }

  if (role === 'admin') {
    admins.add(socket);
    lastLocation.forEach((loc, id) => {
      socket.emit('location:bootstrap', { deviceId: id, ...loc });
    });
  }

  socket.on('location:update', (payload) => {
    if (!payload || typeof payload.lat !== 'number' || typeof payload.lng !== 'number') return;

    const id = payload.deviceId || deviceId;
    const rec = {
      lat: payload.lat,
      lng: payload.lng,
      accuracy: (typeof payload.accuracy === 'number') ? payload.accuracy : null,
      timestamp: payload.timestamp || Date.now(),
    };
    lastLocation.set(id, rec);

    admins.forEach((adminSock) => {
      adminSock.emit('location:push', { deviceId: id, ...rec });
    });

    nsp.to(id).emit('location:push', { deviceId: id, ...rec });
  });

  socket.on('disconnect', () => {
    if (admins.has(socket)) admins.delete(socket);
    console.log(`[LIVE] disconnected socket=${socket.id} role=${role} deviceId=${deviceId}`);
  });
});

// REST: last-known for a single device
app.get('/api/last-location/:deviceId', (req, res) => {
  const id = req.params.deviceId;
  if (!lastLocation.has(id)) return res.status(404).json({ ok: false, message: 'No location yet' });
  return res.json({ ok: true, deviceId: id, ...lastLocation.get(id) });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
