const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const priceRoutes = require('./routes/priceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/reservations', reservationRoutes);
app.use('/api', priceRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
