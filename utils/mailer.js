// utils/mailer.js
const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendConfirmationEmail = async (to, subject, text) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { name: "Corfiot Transfers", email: "no-reply@corfutransfersapp.com" };
    sendSmtpEmail.replyTo = { email: "evanlabos@corfutransfersapp.com", name: "Evan" };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo email sent:", response);
  } catch (error) {
    console.error("❌ Brevo email failed:", error?.response?.body || error);
  }
};

module.exports = { sendConfirmationEmail };
