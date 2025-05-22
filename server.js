const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const priceRoutes = require('./routes/priceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

const allowedOrigins = [
  'https://corfutranfersapp.com',
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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/reservations', reservationRoutes);
app.use('/api', priceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
