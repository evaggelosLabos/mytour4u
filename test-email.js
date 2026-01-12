// test-email.js
require('dotenv').config();
const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendTestEmail() {
  try {
    const sendSmtpEmail = {
      to: [{ email: "eliminatorelab@gmail.com" }], // 👈 change to your test inbox
      sender: { name: "Corfiot Transfers", email: "evanlabos@corfutransfersapp.com" },
      subject: "🚀 Brevo Test Email",
      textContent: "Hello! This is a test email sent via Brevo + Node.js 🎉",
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo test email sent:", response);
  } catch (error) {
    console.error("❌ Brevo test email failed:", error);
  }
}

sendTestEmail();
