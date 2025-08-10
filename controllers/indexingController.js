// backend/controllers/indexingController.js
const { google } = require('googleapis');

// Lazily create an authenticated Indexing API client.
// Credentials are loaded automatically from GOOGLE_APPLICATION_CREDENTIALS,
// which you set in Render to /etc/secrets/google-indexing.json
let indexingClientPromise = null;

async function getIndexingClient() {
  if (!indexingClientPromise) {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const authClient = await auth.getClient();
    indexingClientPromise = google.indexing({ version: 'v3', auth: authClient });
  }
  return indexingClientPromise;
}

exports.indexUrl = async (req, res) => {
  const { url, type = 'URL_UPDATED' } = req.body; // type can be URL_UPDATED or URL_DELETED
  if (!url) return res.status(400).json({ success: false, error: 'Missing URL' });

  try {
    const indexing = await getIndexingClient();
    const response = await indexing.urlNotifications.publish({
      requestBody: { url, type },
    });

    res.json({ success: true, result: response.data });
  } catch (err) {
    const msg = err?.response?.data || err.message || 'Indexing error';
    console.error('Indexing error:', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
