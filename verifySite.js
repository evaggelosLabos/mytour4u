// verifySite.js (version 2 - fetch token)
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const keyPath = path.join(__dirname, 'config', 'google-indexing.json');
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/siteverification'],
});

async function verifySite() {
  const siteVerification = google.siteVerification({ version: 'v1', auth });

  try {
    // Step 1: Get verification token
    const tokenRes = await siteVerification.webResource.getToken({
      requestBody: {
        site: {
          identifier: 'https://corfutransfersapp.com',
          type: 'SITE',
        },
        verificationMethod: 'file',
      },
    });

    const token = tokenRes.data.token;
    const fileName = token.replace('google-site-verification=', '');
    const filePath = path.resolve('C:/Users/egw/mytour4u/out', fileName);

    console.log(`✅ Create a file named: ${fileName}`);
    console.log(`📄 File contents: ${token}`);
    console.log('📂 Place it at: https://corfutransfersapp.com/' + fileName);

    // Optional: Write file locally to static export folder
    fs.writeFileSync(filePath, token);
    console.log(`📝 File saved at: ${filePath}`);

    // Wait for manual deployment or CDN sync if needed
    console.log('⏳ Waiting a few seconds before verification...');

    // Step 2: Attempt verification
    const verifyRes = await siteVerification.webResource.insert({
  verificationMethod: 'file',
  requestBody: {
    site: {
      identifier: 'https://corfutransfersapp.com',
      type: 'SITE',
    }
  },
});


    console.log('🎉 Verified successfully!');
    console.log(JSON.stringify(verifyRes.data, null, 2));
  } catch (err) {
    console.error('❌ Verification failed:');
    console.error(err.response?.data || err.message);
  }
}

verifySite();
