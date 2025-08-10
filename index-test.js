// index-test.js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Adjust this path to match your service account key file
const keyPath = path.join(__dirname, 'config', 'google-indexing.json');
const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

async function runIndexingTest(urlToIndex) {
  try {
    const client = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: client });

    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    console.log('✅ Success:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

// Change this URL to the one you want to test
const testUrl = 'https://corfutransfersapp.com/services';

runIndexingTest(testUrl);
