// backend/routes/indexingRoutes.js
const express = require('express');
const router = express.Router();
const { indexUrl } = require('../controllers/indexingController');

router.post('/index-url', indexUrl);

module.exports = router;
