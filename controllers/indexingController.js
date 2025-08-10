// backend/controllers/indexingController.js
const { google } = require('googleapis');
const path = require('path');

const key = require(path.join(__dirname, '../config/google-indexing.json'));

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({
  version: 'v3',
  auth,
});

exports.indexUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: 'URL_UPDATED', // or 'URL_DELETED'
      },
    });

    res.json({
      success: true,
      result: response.data,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};
