// testBrevo.js
require("dotenv").config();
const { sendConfirmationEmail } = require("./utils/mailer");

(async () => {
  await sendConfirmationEmail(
    "evanlabos@corfutransfersapp.com", // 👈 change to your email
    "🚐 Test Email from Corfiot Transfers",
    "Hello! This is a test email sent through Brevo API.\n\nIf you see this, your API setup works 🎉"
  );
})();

