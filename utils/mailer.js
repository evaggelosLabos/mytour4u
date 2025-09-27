// utils/mailer.js
const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY // 🔑 store in .env
);

const sendConfirmationEmail = async (to, subject, text) => {
  try {
    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: { name: "Corfiot Transfers", email: "evanlabos@corfutransfersapp.com" },
      subject,
      textContent: text,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Brevo email failed:", error);
  }
};

module.exports = { sendConfirmationEmail };
