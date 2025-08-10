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

// Root route
app.get('/', (req, res) => {
  res.send('MyTour4U API is running');
});

// Mongo
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Routes
app.use('/api/reservations', reservationRoutes);
app.use('/api', priceRoutes);
app.use('/api/google', indexingRoutes);

// HTTP server + Socket.IO
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

// Store last known locations
const lastLocation = new Map();

// Namespace for live tracking
const nsp = io.of('/live');

nsp.on('connection', (socket) => {
  const role = socket.handshake.query?.role || 'viewer';
  const deviceId = socket.handshake.query?.deviceId || `device-${Math.random().toString(36).substring(2, 8)}`;

  console.log(`[SOCKET] ${role} connected: ${deviceId}`);

  if (role === 'driver') {
    socket.join(deviceId);
  }

  if (role === 'admin') {
    // Send all last-known locations on connect
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
      accuracy: typeof payload.accuracy === 'number' ? payload.accuracy : null,
      timestamp: payload.timestamp || Date.now(),
    };
    lastLocation.set(id, rec);

    // Send to all admins
    nsp.sockets.forEach((client) => {
      if (client.handshake.query?.role === 'admin') {
        client.emit('location:push', { deviceId: id, ...rec });
      }
    });

    // Send to this driver's room (if needed)
    nsp.to(id).emit('location:push', { deviceId: id, ...rec });
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET] ${role} disconnected: ${deviceId}`);
  });
});

// REST bootstrap for specific device
app.get('/api/last-location/:deviceId', (req, res) => {
  const id = req.params.deviceId;
  if (!lastLocation.has(id)) return res.status(404).json({ ok: false, message: 'No location yet' });
  return res.json({ ok: true, deviceId: id, ...lastLocation.get(id) });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
