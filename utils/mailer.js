// utils/mailer.js
const nodemailer = require('nodemailer');

// ⚠️ Replace with your SiteGround email + password
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendConfirmationEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Corfiot Transfers" <evanlabos@corfutransfersapp.com>', // sender
      to,       // recipient
      subject,  // subject
      text,     // plain text
    });
    console.log("✅ Confirmation email sent to", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = { sendConfirmationEmail };
